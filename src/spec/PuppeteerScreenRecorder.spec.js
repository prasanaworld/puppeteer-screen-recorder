import fs from 'fs';
import test from 'ava';
import puppeteer from 'puppeteer';
import PuppeteerScreenRecorder from '../lib/PuppeteerScreenRecorder';

test('case 1 --> Happy Path: Should be able to create a new screen-recording session', async (assert) => {
    /** setup */
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const outputVideoPath = './video/test/video-recorder/testCase1.mp4';
    const recorder = new PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);

    /** execute */
    await page.goto('https://github.com', { waitUntil: 'networkidle2' });
    await page.goto('https://google.com', { waitUntil: 'networkidle2' });

    /** clear */
    const status = await recorder.stop();
    await browser.close();

    /** assert */
    assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs.existsSync(outputVideoPath), true);
});


test('case 2 --> Happy Path: Should be follow new tab open and record it successfully', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const outputVideoPath = './video/test/video-recorder/testCase2.mp4';
  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start(outputVideoPath);

  /** execute */
  await page.goto('https://prasanaworld.herokuapp.com');

  await page.waitForSelector('.openLog');
  const link = await page1.$('.openLog');
  const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));  // declare promise
  await link.click({button: 'middle'});
  const page2 = await newPagePromise;

  await page2.bringToFront();

  await page2.close();

  await page.goto('https://google.com', { waitUntil: 'networkidle2' });

  /** clear */
  const status = await recorder.stop();
  await browser.close();

  /** assert */
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});
