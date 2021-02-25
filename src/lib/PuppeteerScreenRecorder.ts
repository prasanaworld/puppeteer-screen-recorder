import fs from 'fs';
import { dirname, extname } from 'path';

import { Page } from 'puppeteer';

import { pageVideoStreamCollector } from './pageVideoStreamCollector';
import PageVideoStreamWriter, { VideoOptions } from './pageVideoStreamWriter';

export type PuppeteerScreenRecorderOptions = VideoOptions & {
  readonly followNewTab: boolean;
};

/**
 * @ignore
 */
const defaultPuppeteerScreenRecorderOptions: PuppeteerScreenRecorderOptions = {
  followNewTab: true,
  fps: 25,
  ffmpeg_Path: null,
};

/**
 * PuppeteerScreenRecorder class is responsible for managing the video
 *
 * ```typescript
 * const screenRecorderOptions = {
 *  followNewTab: true,
 *  fps: 25,
 * }
 * const savePath = "./test/demo.mp4";
 * const screenRecorder = new PuppeteerScreenRecorder(page, screenRecorderOptions);
 * await screenRecorder.start(savePath);
 *  // some puppeteer action or test
 * await screenRecorder.stop()
 * ```
 */
export class PuppeteerScreenRecorder {
  private page: Page;
  private options: PuppeteerScreenRecorderOptions;
  private streamReader: pageVideoStreamCollector;
  private streamWriter: PageVideoStreamWriter;
  private isScreenCaptureEnded: boolean | null = null;

  constructor(page: Page, options = {}) {
    this.options = Object.assign(
      {},
      defaultPuppeteerScreenRecorderOptions,
      options
    );
    this.streamReader = new pageVideoStreamCollector(page, this.options);
    this.page = page;
  }

  /**
   * @ignore
   */
  private setupListeners(): void {
    this.page.on('close', async () => await this.stop());

    this.streamReader.on('pageScreenFrame', (pageScreenFrame) => {
      this.streamWriter.insert(pageScreenFrame);
    });

    this.streamWriter.on('videoStreamWriterError', () => this.stop());
  }

  /**
   * @ignore
   */
  private async ensureDirectoryExist(dirPath) {
    return new Promise((resolve, reject) => {
      try {
        fs.mkdirSync(dirPath, { recursive: true });
        return resolve(dirPath);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @public
   * @method getRecordDuration
   * @description return the total duration of the video recorded,
   *  1. if this method is called before calling the stop method, it would be return the time till it has recorded.
   *  2. if this method is called after stop method, it would give the total time for recording
   * @returns total duration of video
   */
  public getRecordDuration(): string {
    if (!this.streamWriter) {
      return '00:00:00:00';
    }
    return this.streamWriter.duration;
  }

  /**
   *
   * @public
   * @method start
   * @param savePath accepts a path string to store the video
   * @description Start the video capturing session
   * @returns PuppeteerScreenRecorder
   * @example
   * ```
   *  const savepath = ''
   *  await recorder.start()
   * ```
   */
  public async start(savePath: string): Promise<PuppeteerScreenRecorder> {
    if (extname(savePath) !== '.mp4') {
      throw new Error('Arguments should be .mp4 extension');
    }

    await this.ensureDirectoryExist(dirname(savePath));

    this.streamWriter = new PageVideoStreamWriter(savePath, this.options);
    this.setupListeners();

    await this.streamReader.start();
    return this;
  }

  /**
   * @public
   * @method stop
   * @description stop the video capturing session
   * @returns indicate whether stop is completed correct or not, if true without any error else false.
   */
  public async stop(): Promise<boolean> {
    if (this.isScreenCaptureEnded !== null) {
      return this.isScreenCaptureEnded;
    }

    await this.streamReader.stop();
    this.isScreenCaptureEnded = await this.streamWriter.stop();
    return this.isScreenCaptureEnded;
  }
}
