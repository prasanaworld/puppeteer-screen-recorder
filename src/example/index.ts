import puppeteer from 'puppeteer';

import { PuppeteerScreenRecorder } from '../lib/PuppeteerScreenRecorder';

/**
 * @ignore
 */
async function executeSample(format) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start(format);
  await page.goto('https://yahoo.com');

  await page.goto('https://google.com');
  await recorder.stop();
  await browser.close();
}

executeSample('./report/video/simple1.mp4');
executeSample('./report/video/simple1.mov');
executeSample('./report/video/simple1.avi');
executeSample('./report/video/simple1.webm');
