import fs from 'fs';
import { dirname } from 'path';

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
 * const screenRecorder = new PuppeteerScreenRecorder(page, screenRecorderOptions);
 * await screenRecorder.start()
 *  // some puppeteer action or test
 * await screenRecorder.stop()
 * ```
 */
export default class PuppeteerScreenRecorder {
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

  private setupListeners(): void {
    this.page.on('close', async () => await this.stop());

    this.streamReader.on('pageScreenFrame', (pageScreenFrame) => {
      this.streamWriter.insert(pageScreenFrame);
    });

    this.streamWriter.on('videoStreamWriterError', () => this.stop());
  }

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
   *
   * @public
   * @method start
   * @param savePath accepts a path string to store the video
   * @description Start the video capturing session
   * @returns
   */
  public async start(savePath: string): Promise<PuppeteerScreenRecorder> {
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
