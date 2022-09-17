import fs from 'fs';
import { PassThrough } from 'stream';

import puppeteer from 'puppeteer';

import { PuppeteerScreenRecorder } from '../lib/PuppeteerScreenRecorder';

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * @ignore
 */
async function testStartMethod(format) {
  const browser = await puppeteer.launch({
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start(format);
  await page.goto('https://www.youtube.com/watch?v=fh4RNP4bMWk');
  await sleep(2000);
  await page.evaluate(() => {
    const buttonElement = Array.from(
      document.querySelectorAll<HTMLButtonElement>('a yt-formatted-string')
    ).find((element) => element.textContent === 'Reject all');

    if (buttonElement) {
      buttonElement.click();
    }
  });
  await page.click('button[title="Play (k)"]');
  await page.waitFor(20 * 1000);
  await recorder.stop();
  await browser.close();
}

/**
 * @ignore
 */
async function testStartStreamMethod(format) {
  const browser = await puppeteer.launch({
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  const passthrough = new PassThrough();
  format = format.replace('video', 'stream');
  const fileWriteStream = fs.createWriteStream(format);

  passthrough.pipe(fileWriteStream);
  await recorder.startStream(passthrough);
  await page.goto('https://www.youtube.com/watch?v=fh4RNP4bMWk');
  await sleep(2000);
  await page.click('button[title="Play (k)"]');
  await page.waitFor(20 * 1000);
  await recorder.stop();
  await browser.close();
}

/**
 * @ignore
 */
async function executeSample(format) {
  const argList = process.argv.slice(2);
  const isStreamTest = argList.includes('stream');

  if (isStreamTest) {
    console.log('Testing with startSteam Method');
    return testStartStreamMethod(format);
  }

  console.log('Testing with start Method');
  return testStartMethod(format);
}

executeSample('./report/video/simple1.mp4').then(() => {
  console.log('completed');
});
