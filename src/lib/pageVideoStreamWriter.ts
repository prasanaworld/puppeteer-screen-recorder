import { EventEmitter } from 'events';
import { PassThrough, Writable } from 'stream';

import ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg';

import {
  pageScreenFrame,
  VIDEO_WRITE_STATUS,
  VideoOptions,
} from './pageVideoStreamTypes';

/**
 * @ignore
 */
export default class PageVideoStreamWriter extends EventEmitter {
  private readonly screenLimit = 40;
  private screenCastFrames = [];
  private lastProcessedFrame: pageScreenFrame;
  public duration = '00:00:00:00';

  private status = VIDEO_WRITE_STATUS.NOT_STARTED;
  private options: VideoOptions;

  private videoMediatorStream: PassThrough = new PassThrough();
  private writerPromise: Promise<boolean>;

  constructor(savePath: string | Writable, options?: VideoOptions) {
    super();

    if (options) {
      this.options = options;
    }

    const isWritable = this.isWritableStream(savePath);
    if (isWritable || typeof savePath === 'string') {
      this.configureVideoFile(savePath, isWritable);
    }
  }

  private get videoFrameSize(): string {
    const { width, height } = this.options.videoFrame;

    return width !== null && height !== null ? `${width}x${height}` : '100%';
  }

  private getFfmpegPath(): string | null {
    if (this.options.ffmpeg_Path) {
      return this.options.ffmpeg_Path;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ffmpeg = require('@ffmpeg-installer/ffmpeg');
      if (ffmpeg.path) {
        return ffmpeg.path;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  private configureFFmPegPath(): void {
    const ffmpegPath = this.getFfmpegPath();

    if (!ffmpegPath) {
      throw new Error(
        'Missing path for FFmpeg, \n Set the FFMPEG_PATH env variable'
      );
    }

    setFfmpegPath(ffmpegPath);
  }

  private configureVideoFile(
    savePath: string | Writable,
    isWritableStream: boolean
  ): void {
    this.configureFFmPegPath();
    this.writerPromise = new Promise((resolve) => {
      const command = ffmpeg({ source: this.videoMediatorStream, priority: 20 })
        .videoCodec('libx264')
        .size(this.videoFrameSize)
        .aspect(this.options.aspectRatio || '4:3')
        .inputFormat('image2pipe')
        .inputFPS(this.options.fps)
        .outputOptions('-preset ultrafast')
        .outputOptions('-pix_fmt yuv420p')
        .on('progress', (progressDetails) => {
          this.duration = progressDetails.timemark;
        })
        .on('error', (e) => {
          this.handleWriteStreamError(e.message);
          if (isWritableStream) {
            (savePath as Writable).emit('error', e);
          }
          resolve(false);
        })
        .on('end', () => {
          if (isWritableStream) {
            (savePath as Writable).end();
          }
          resolve(true);
        });

      if (this.options.duration) {
        command.duration(this.options.duration);
      }

      if (isWritableStream) {
        command.toFormat('mp4');
        // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/blob/68d5c948b689b3058e52435e0bc3d4af0eee349e/examples/any-to-mp4-steam.js
        command.addOutputOptions(
          '-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov'
        );
        command.pipe(savePath);
      } else {
        command.save(savePath);
      }
    });
  }

  private handleWriteStreamError(errorMessage): void {
    this.emit('videoStreamWriterError', errorMessage);

    if (
      this.status !== VIDEO_WRITE_STATUS.IN_PROGRESS &&
      errorMessage.includes('pipe:0: End of file')
    ) {
      return;
    }
    return console.error(
      `Error unable to capture video stream: ${errorMessage}`
    );
  }

  private findSlot(timestamp: number): number {
    if (this.screenCastFrames.length === 0) {
      return 0;
    }

    let i: number;
    let frame: pageScreenFrame;

    for (i = this.screenCastFrames.length - 1; i >= 0; i--) {
      frame = this.screenCastFrames[i];

      if (timestamp > frame.timestamp) {
        break;
      }
    }

    return i + 1;
  }

  public insert(frame: pageScreenFrame): void {
    // reduce the queue into half when it is full
    if (this.screenCastFrames.length === this.screenLimit) {
      const numberOfFramesToSplice = Math.floor(this.screenLimit / 2);
      const framesToProcess = this.screenCastFrames.splice(
        0,
        numberOfFramesToSplice
      );
      this.processFrameBeforeWrite(framesToProcess);
    }

    const insertionIndex = this.findSlot(frame.timestamp);

    if (insertionIndex === this.screenCastFrames.length) {
      this.screenCastFrames.push(frame);
    } else {
      this.screenCastFrames.splice(insertionIndex, 0, frame);
    }
  }

  private trimFrame(fameList: pageScreenFrame[]): pageScreenFrame[] {
    if (!this.lastProcessedFrame) {
      this.lastProcessedFrame = fameList[0];
    }

    return fameList.map((currentFrame: pageScreenFrame) => {
      const duration =
        currentFrame.timestamp - this.lastProcessedFrame.timestamp;
      this.lastProcessedFrame = currentFrame;

      return {
        ...currentFrame,
        duration,
      };
    });
  }

  private processFrameBeforeWrite(frames: pageScreenFrame[]): void {
    const processedFrames = this.trimFrame(frames);

    processedFrames.forEach(({ blob, duration }) => {
      this.write(blob, duration);
    });
  }

  public write(data: Buffer, durationSeconds = 1): void {
    this.status = VIDEO_WRITE_STATUS.IN_PROGRESS;

    const NUMBER_OF_FPS = Math.max(
      Math.floor(durationSeconds * this.options.fps),
      1
    );

    for (let i = 0; i < NUMBER_OF_FPS; i++) {
      this.videoMediatorStream.write(data);
    }
  }

  private drainFrames(stoppedTime: number): void {
    this.processFrameBeforeWrite(this.screenCastFrames);
    this.screenCastFrames = [];

    if (!this.lastProcessedFrame) return;
    const durationSeconds = stoppedTime - this.lastProcessedFrame.timestamp;
    this.write(this.lastProcessedFrame.blob, durationSeconds);
  }

  public stop(stoppedTime = Date.now() / 1000): Promise<boolean> {
    if (this.status === VIDEO_WRITE_STATUS.COMPLETED) {
      return this.writerPromise;
    }

    this.drainFrames(stoppedTime);

    this.videoMediatorStream.end();
    this.status = VIDEO_WRITE_STATUS.COMPLETED;
    return this.writerPromise;
  }

  private isWritableStream(savePath: string | Writable): boolean {
    if (savePath && typeof savePath !== 'string') {
      if (!('writable' in savePath) || !savePath.writable) {
        throw new Error('Output should be a writable stream');
      }
      return true;
    }
    return false;
  }
}
