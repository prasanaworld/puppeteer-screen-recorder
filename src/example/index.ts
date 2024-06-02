import fs from 'fs';
import { PassThrough } from 'stream';

import puppeteer from 'puppeteer';

import { PuppeteerScreenRecorder } from '../lib/PuppeteerScreenRecorder';

/** @ignore */
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/** @ignore */
async function testStartMethod(format: string, isStream: boolean) {
  const browser = await puppeteer.launch({
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
    headless: false,
  });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  if (isStream) {
    const passthrough = new PassThrough();
    format = format.replace('video', 'stream');
    const fileWriteStream = fs.createWriteStream(format);
    passthrough.pipe(fileWriteStream);
    await recorder.startStream(passthrough);
  } else {
    await recorder.start(format);
  }
  await page.goto('https://developer.mozilla.org/en-US/docs/Web/CSS/animation');
  await sleep(10 * 1000);
  await recorder.stop();
  await browser.close();
}

async function executeSample(format) {
  const argList = process.argv.slice(2);
  const isStreamTest = argList.includes('stream');

  console.log(
    `Testing with Method using ${isStreamTest ? 'stream' : 'normal'} mode`
  );
  return testStartMethod(format, isStreamTest);
}

executeSample('./report/video/simple1.mp4').then(() => {
  console.log('completed');
});
