import puppeteer from 'puppeteer';

import { PuppeteerScreenRecorder } from '../lib/PuppeteerScreenRecorder';

/** @ignore */
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/** @ignore */
async function testStartMethod(format: string) {
  const executablePath = process.env['PUPPETEER_EXECUTABLE_PATH'];
  const browser = await puppeteer.launch({
    ...(executablePath ? { executablePath: executablePath } : {}),
    headless: false,
  });
  const page = await browser.newPage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recorder = new PuppeteerScreenRecorder(page as any);
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await recorder.start(format);

  await page.goto('https://developer.mozilla.org/en-US/docs/Web/CSS/animation');
  await sleep(10 * 1000);

  await recorder.stop();
  await browser.close();
}

async function executeSample(format) {
  return testStartMethod(format);
}

executeSample('./report/video/simple1.mp4').then(() => {
  console.log('completed');
});
