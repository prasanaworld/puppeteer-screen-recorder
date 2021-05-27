import fs from 'fs';

import test from 'ava';
import puppeteer from 'puppeteer';
import { dirname } from 'path';
import { PassThrough } from 'stream';

import { PuppeteerScreenRecorder, PuppeteerScreenRecorderOptions } from '../';

test('case 1 --> Happy Path: Should be able to create a new screen-recording session', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
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
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 2 --> Happy Path: should be to get the total duration of recording', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const outputVideoPath = './test-output/test/video-recorder/testCase2.mp4';
  const recorder = new PuppeteerScreenRecorder(page);
  const recorderValue = await recorder.start(outputVideoPath);

  /** execute */
  await page.goto('https://github.com', { waitUntil: 'load' });

  await page.goto('https://google.com', { waitUntil: 'load' });
  /** clear */
  const status = await recorder.stop();

  const duration = recorder.getRecordDuration();
  await browser.close();

  /** assert */
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  console.log('duration', duration);
  assert.is(duration !== '00:00:00:00', true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 2 --> Happy Path: testing video recording with video frame width, height and aspect ratio', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
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
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('test 3 -> Error Path: should throw error if an invalid savePath argument is passed for start method', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
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
    assert.true(error.message === 'Arguments should be .mp4 extension');
  }
});

test('test 4 --> Test laggy video: Bug report', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const Config = {
    followNewTab: true,
    fps: 60,
    videoFrame: {
      width: 1920,
      height: 1080,
    },
    aspectRatio: '16:9',
  };
  const recorder = new PuppeteerScreenRecorder(page, Config);
  const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';

  /** execute */
  await page.goto(
    'https://starwarsintrocreator.kassellabs.io/#!/CMXWBXGT3ldfeU0v89pv'
  );
  await page.waitForSelector(
    '.requestInteraction > #requestInteractionButton > div'
  );
  await page.click('.requestInteraction > #requestInteractionButton > div');
  await recorder.start(outputVideoPath); // video must have .mp4 has an extension.
  try {
    await page.waitForSelector('#downloadButton', {
      visible: true,
      timeout: 20000,
    });
  } catch (e) {
    console.log('button not found');
  }

  /** clear */
  const status = await recorder.stop();
  await browser.close();

  /** assert */
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 5 --> Happy Path: Should be able to create a new screen-recording session using streams', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const outputVideoPath = './test-output/test/video-recorder/testCase5.mp4';
  try {
    // we are testing using filestream output so we should ensure that the path exists
    fs.mkdirSync(dirname(outputVideoPath), { recursive: true });
  } catch (e) {
    console.error(e);
  }
  /** setup streams (PassThrough as an output from screen recorder and fs.WriteStream as an output from PassThrough stream ) */
  const passStream = new PassThrough();
  const fileWriteStream = fs.createWriteStream(outputVideoPath);
  passStream.pipe(fileWriteStream);

  const recorder = new PuppeteerScreenRecorder(page);
  const recorderValue = await recorder.startStream(passStream);

  /** execute */
  await page.goto('https://github.com', { waitUntil: 'load' });
  await page.goto('https://google.com', { waitUntil: 'load' });

  /** clear */
  const status = await recorder.stop();
  await browser.close();

  /** assert */
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fileWriteStream.writableEnded, true);
  assert.is(fileWriteStream.writableFinished, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});