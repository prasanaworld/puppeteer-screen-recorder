import fs from 'fs';
import { dirname } from 'path';

import test from 'ava';
import puppeteer from 'puppeteer';

import { PuppeteerScreenRecorder, PuppeteerScreenRecorderOptions } from '../';

test('case 1a --> Happy Path: Should be able to create a new screen-recording session', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
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

test('case 1a --> Happy Path: Should be able to create a new screen-recording session using mp4 format', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
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

test('case 1b --> Happy Path: Should be able to create a new screen-recording session using mov', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
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
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 1c --> Happy Path: Should be able to create a new screen-recording session using webm', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
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
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 1d --> Happy Path: should be to get the total duration of recording using avi', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
  const page = await browser.newPage();

  const outputVideoPath = './test-output/test/video-recorder/testCase2.avi';
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
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
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
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
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
    assert.true(error.message === 'File format is not supported');
  }
});

test('case 4 --> Happy Path: Should be able to create a new screen-recording session using streams', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
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
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
  fileWriteStream.on('end', () => {
    assert.is(fileWriteStream.writableFinished, true);
  });
});

test('case 5a --> Happy Path: testing video recording with video frame width, height and autopad color', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
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
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 5b --> Happy Path: testing video recording with video frame width, height and autopad color as hex code', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
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
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 5c --> Happy Path: testing video recording with video frame width, height and default autopad color', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
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
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 6 --> Happy Path: should create a video with a custom crf', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
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
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});
