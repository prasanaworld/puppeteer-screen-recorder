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
  const executablePath = process.env['PUPPETEER_EXECUTABLE_PATH'];
  const browser = await puppeteer.launch({
    ...(executablePath ? { executablePath: executablePath } : {}),
    headless: false,
  });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await recorder.start('./report/video/simple1.mp4');

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
