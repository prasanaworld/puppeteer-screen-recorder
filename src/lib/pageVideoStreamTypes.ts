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

/**
 * @type Videooptions
 */
export type VideoOptions = {
  readonly fps?: number;
  readonly ffmpeg_Path?: string | null;
  readonly videoFrame?: {
    width: number | null;
    height: number | null;
  };
  readonly aspectRatio?: '3:2' | '4:3' | '16:9';
};

export type PuppeteerScreenRecorderOptions = VideoOptions & {
  readonly followNewTab: boolean;
};
