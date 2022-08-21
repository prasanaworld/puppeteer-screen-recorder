/**
 * @ignore
 * @enum VIDEO_WRITE_STATUS
 */
export enum VIDEO_WRITE_STATUS {
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'ERROR',
}

/**
 * @ignore
 * @type PageScreen
 */
export type pageScreenFrame = {
  readonly blob: Buffer;
  readonly timestamp: number;
  readonly duration?: number;
};

export type PuppeteerScreenRecorderOptions = {
  /**
   * @name followNewTab
   * @member PuppeteerScreenRecorderOptions
   * @description Boolean value which is indicate whether to follow the tab or not. Default value is true.
   * @default true
   * */
  readonly followNewTab: boolean;

  /**
   * @name fps
   * @member PuppeteerScreenRecorderOptions
   * @description Numeric value which denotes no.of Frames per second in which the video should be recorded. default value is 25.
   * @default 25
   */
  readonly fps?: number;

  /**
   * @name ffmpeg_Path
   * @member PuppeteerScreenRecorderOptions
   * @description String value pointing to the installation of FFMPEG. Default is null (Automatically install the FFMPEG and use it).
   * @default null
   */
  readonly ffmpeg_Path?: string | null;

  /**
   * @name videoFrame
   * @member PuppeteerScreenRecorderOptions
   * @description An object which is to specify the width and height of the capturing video frame. Default to browser viewport size.
   */
  readonly videoFrame?: {
    width: number | null;
    height: number | null;
  };

  /**
   * @name aspectRatio
   * @member PuppeteerScreenRecorderOptions
   * @description Specify the aspect ratio of the video. Default value is 4:3.
   * @default 4:3
   */
  readonly aspectRatio?: '3:2' | '4:3' | '16:9';

  /**
   * @name videoCodec
   * @member PuppeteerScreenRecorderOptions
   * @description Specify the codec used by FFMPEG when creating the final video file. The default value is libx264.
   */
  readonly videoCodec?: string;

  /**
   * @name videoBitrate
   * @member PuppeteerScreenRecorderOptions
   * @description Specify the target bitrate of the final video file in bits/s. The default value is 1000.
   */
  readonly videoBitrate?: number;

  /**
   * @name videoCrf
   * @member PuppeteerScreenRecorderOptions
   * @description Specify the crf of the final video file. The default value is 23.
   */
  readonly videoCrf?: number;

  /**
   * @name videoPreset
   * @member PuppeteerScreenRecorderOptions
   * @description Specify the preset to use when encoding the video file. The default value is 'ultrafast'.
   */
  readonly videoPreset?: string;

  /**
   * @name videoPixelFormat
   * @member PuppeteerScreenRecorderOptions
   * @description Specify the pixel format to use when encoding the video file. The default value is 'yuv420p'.
   */
  readonly videoPixelFormat?: string;

  /**
   * @name autopad
   * @member PuppeteerScreenRecorderOptions
   * @description Specify whether autopad option is used and its color. Default to autopad deactivation mode.
   */
  readonly autopad?: {
    color?: string;
  };

  /**
   * @name recordDurationLimit
   * @member PuppeteerScreenRecorderOptions
   * @description  Numerical value specify duration (in seconds) to record the video. By default video is recorded till stop method is invoked`. (Note: It's mandatory to invoke Stop() method even if this value is set)
   */
  readonly recordDurationLimit?: number;
};

/** @ignore */
export type VideoOptions = Omit<PuppeteerScreenRecorderOptions, 'followNewTab'>;

/**
 * @description supported video format for recording.
 * @example
 *  recording.start('./video.mp4');
 *  recording.start('./video.mov');
 *  recording.start('./video.webm');
 *  recording.start('./video.avi');
 */
export enum SupportedFileFormats {
  MP4 = 'mp4',
  MOV = 'mov',
  AVI = 'avi',
  WEBM = 'webm',
}
