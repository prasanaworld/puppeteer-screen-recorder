import fs from 'fs';
import { dirname } from 'path';

import { describe, expect, it } from '@jest/globals';
import puppeteer from 'puppeteer';

import { PuppeteerScreenRecorder, PuppeteerScreenRecorderOptions } from '../';

const launchBrowser = async () => {
  const puppeteerPath = process.env['PUPPETEER_EXECUTABLE_PATH'];

  const browser = await puppeteer.launch({
    headless: true,
    ...(puppeteerPath ? { executablePath: puppeteerPath } : {}),
  });

  return browser;
};

describe('Happy path test case', () => {
  it('Should be able to create a new screen-recording session', async () => {
    /** setup */
    const browser = await launchBrowser();

    const page = await browser.newPage();

    const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
    const recorder = new PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });

    /** clear */
    const status = await recorder.stop();
    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });

  it('Should be able to create a new screen-recording session using mp4 format', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
    const recorder = new PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });

    /** clear */
    const status = await recorder.stop();
    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });

  it('Should be able to create a new screen-recording session using mov', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const outputVideoPath = './test-output/test/video-recorder/testCase1.mov';
    const recorder = new PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });

    /** clear */
    const status = await recorder.stop();
    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });

  it('Should be able to create a new screen-recording session using webm', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const outputVideoPath = './test-output/test/video-recorder/testCase1.webm';
    const recorder = new PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });

    /** clear */
    const status = await recorder.stop();
    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });

  it('should be to get the total duration of recording using avi', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const outputVideoPath = './test-output/test/video-recorder/testCase2.avi';
    const recorder = new PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });

    await page.goto('https://google.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();

    recorder.getRecordDuration();
    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });

  it('should be able to record a video with video frame width, height and aspect ratio', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const options: PuppeteerScreenRecorderOptions = {
      followNewTab: false,
      videoFrame: {
        width: 1024,
        height: 1024,
      },
      aspectRatio: '4:3',
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';
    const recorder = new PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();

    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });

  it('Should be able to create a new screen-recording session using streams', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';
    try {
      fs.mkdirSync(dirname(outputVideoPath), { recursive: true });
    } catch (e) {
      console.error(e);
    }

    const fileWriteStream = fs.createWriteStream(outputVideoPath);

    const recorder = new PuppeteerScreenRecorder(page);
    await recorder.startStream(fileWriteStream);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });

    /** clear */
    const status = await recorder.stop();
    await browser.close();

    /** assert */
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    fileWriteStream.on('end', () => {
      expect(fileWriteStream.writableFinished).toBeTruthy();
    });
  });
});

describe('video frame testing', () => {
  it('testing video recording with video frame width, height and autopad color', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const options: PuppeteerScreenRecorderOptions = {
      followNewTab: false,
      videoFrame: {
        width: 1024,
        height: 1024,
      },
      autopad: {
        color: 'gray',
      },
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase5a.mp4';
    const recorder = new PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();

    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });

  it('testing video recording with video frame width, height and autopad color as hex code', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const options: PuppeteerScreenRecorderOptions = {
      followNewTab: false,
      videoFrame: {
        width: 1024,
        height: 1024,
      },
      autopad: {
        color: '#008000',
      },
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase5b.mp4';
    const recorder = new PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();

    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });

  it('testing video recording with video frame width, height and default autopad color', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const options: PuppeteerScreenRecorderOptions = {
      followNewTab: false,
      videoFrame: {
        width: 1024,
        height: 1024,
      },
      autopad: {},
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase5c.mp4';
    const recorder = new PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();

    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });
});

describe('Defensive test', () => {
  it('should throw error if an invalid savePath argument is passed for start method', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    try {
      const outputVideoPath = './test-output/test/video-recorder/';
      const recorder = new PuppeteerScreenRecorder(page);
      await recorder.start(outputVideoPath);
      /** execute */
      await page.goto('https://github.com', { waitUntil: 'load' });

      await page.goto('https://google.com', { waitUntil: 'load' });
      /** clear */
      await recorder.stop();
    } catch (error) {
      expect(error.message === 'File format is not supported').toBeTruthy();
    }
  });

  it('should create a video with a custom crf', async () => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();

    const options: PuppeteerScreenRecorderOptions = {
      followNewTab: false,
      videoFrame: {
        width: 1024,
        height: 1024,
      },
      videoCrf: 0,
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase6.mp4';
    const recorder = new PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();

    await browser.close();

    /** assert */
    expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
    expect(status).toBeTruthy();
    expect(fs.existsSync(outputVideoPath)).toBeTruthy();
  });
});
