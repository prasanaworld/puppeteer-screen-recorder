import { EventEmitter } from 'events';
import { PassThrough } from 'stream';

import ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg';

import { pageScreenFrame } from './pageVideoStreamCollector';

export type VideoOptions = {
  readonly fps?: number;
  readonly ffmpeg_Path?: string | null;
};

/**
 * @ignore
 */
enum VIDEO_WRITE_STATUS {
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'ERROR',
}

/**
 * @ignore
 */
export default class PageVideoStreamWriter extends EventEmitter {
  private readonly screenLimit = 40;
  private screenCastFrames = [];
  private lastProcessedFrame: pageScreenFrame;

  private status = VIDEO_WRITE_STATUS.NOT_STARTED;
  private options: VideoOptions;

  private videoMediatorStream: PassThrough = new PassThrough();
  private writerPromise: Promise<boolean>;

  constructor(savePath: string, options?: VideoOptions) {
    super();

    if (options) {
      this.options = options;
    }

    this.configureVideoFile(savePath);
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

  private configureVideoFile(savePath: string): void {
    this.configureFFmPegPath();
    this.writerPromise = new Promise((resolve) => {
      ffmpeg({ source: this.videoMediatorStream, priority: 20 })
        .videoCodec('libx264')
        .inputFormat('image2pipe')
        .inputFPS(this.options.fps)
        .outputOptions('-preset ultrafast')
        .outputOptions('-pix_fmt yuv420p')
        .on('error', (e) => {
          this.handleWriteStreamError(e.message);
          resolve(false);
        })
        .on('end', () => resolve(true))
        .save(savePath);
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
      Math.round(durationSeconds * this.options.fps),
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
}
