# puppeteer-screen-recorder

A puppeteer Plugin that uses the native [chrome devtool protocol](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-startScreencast) for capturing video frame by frame. Also supports an option to follow pages that are opened by the current page object. [Check out API Docs](https://prasanaworld.github.io/puppeteer-screen-recorder/classes/puppeteerscreenrecorder.html).

[![NPM](https://nodei.co/npm/puppeteer-screen-recorder.png)](https://npmjs.org/package/puppeteer-screen-recorder)

![GitHub](https://img.shields.io/github/license/prasanaworld/puppeteer-screen-recorder)
[![Build Status](https://travis-ci.org/prasanaworld/puppeteer-screen-recorder.svg?branch=main)](https://travis-ci.org/prasanaworld/puppeteer-screen-recorder)

![GitHub package.json version](https://img.shields.io/github/package-json/v/prasanaworld/puppeteer-screen-recorder)
![GitHub top language](https://img.shields.io/github/languages/top/prasanaworld/puppeteer-screen-recorder)
![npm](https://img.shields.io/npm/dt/puppeteer-screen-recorder)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/puppeteer-screen-recorder)

![GitHub forks](https://img.shields.io/github/forks/prasanaworld/puppeteer-screen-recorder?style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/prasanaworld/puppeteer-screen-recorder?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/prasanaworld/puppeteer-screen-recorder?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/prasanaworld?style=social)

<p style="background-color: green; padding: 10px; border-radius: 5px;"><b>Info:</b> Planning to support <a href="">playwright</a> as part of next release to support cross compatibility (puppeteer and playwright). 
</br>
<a href="https://github.com/prasanaworld/puppeteer-screen-recorder/issues/new">Add Feature Request</a>
</p>

## Key Feature

### 1. Follow Page Automatically

Automatically follows pages (multiple pages) which are opened at runtime, which will be part of video capturing. Also support options to disable the default flow.

### 2. No overhead over FF_MPEG library

FFMPEG library's installation and configuration are automatically managed by the library internally. Also offers options to configure with custom library path.

### 3. Native Implementation

This plugin works directly with native [chrome devtool protocol](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-startScreencast) to capture the video under the wood without any other thirdparty puppeteer plugins for screen capturing.

### 4. Adopted the Chromium principles

Adopted Chromium principles such as Speed, Security, Stability and Simplicity. It also ensures no frames are missed during video capturing and doesn't impact the performance, since its doesn't use any other puppeteer plugin internally.

## Getting Started

### Installation Guide

Using Npm

```sh
npm install puppeteer-screen-recorder
```

Using Yarn

```sh
yarn add puppeteer-screen-recorder
```

### API Description

**1. Import the plugin using ES6 or commonjs.**

```javascript
// ES6
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

// or commonjs
const PuppeteerScreenRecorder = require('puppeteer-screen-recorder');
```

**2. Setup the Configuration object.**

```javascript
const Config = {
  followNewTab: true,
  fps: 25,
  ffmpeg_Path: '<path of ffmpeg_path>' || null,
};
```

> - **followNewTab** : Boolean value which is indicate whether to follow the tab or not. Default value is true.

> - **fps**: Numeric value which denotes no.of Frames per second in which the video should be recorded. default value is 25.

> - **ffmpeg_Path**: String value pointing to the installation of [FFMPEG](https://ffmpeg.org/). Default is null (Automatically install the FFMPEG and use it).

**3. create a new instance of video recording**

```javascript
const recorder = PuppeteerScreenRecorder(page, Config); // Config is optional

// or

const recorder = PuppeteerScreenRecorder(page);
```

> - **page**: Puppeteer page object which needs to captured.
> - **config**: Config is an optional object.
>   Default value is `{ followNewTab: true, fps: 25, ffmpeg_Path: null }`

**4. Start Video capturing**

```javascript
const SavePath = './test/demo.mp4';
await recorder.start(savePath);
```

> **savePath**: string value indicating the directory on where to save the video. The path must also specify the name of the video with extension .mp4 (example - ./test/puppeteer-demo.mp4)

**5. Stop the video capturing.**

```javascript
await recorder.stop();
```

### Example

```javascript
const puppeteer = require('puppeteer');
const PuppeteerScreenRecorder = require('puppeteer-screen-recorder');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start('./report/video/simple.mp4'); // video must have .mp4 has an extension.
  await page.goto('https://example.com');

  await page.goto('https://test.com');
  await recorder.stop();
  await browser.close();
})();
```

## FAQ

Some of the frequently asked question about puppeteer screen recording are

**Q: Does it support Chrome in headless mode?**

---

Yes, it supports Both headless and headFul mode.

It records full length video, frame by frame even when Chrome runs in headless mode.

**Q: Does it use the window object?**

---

No, it's not tied to the window Object.

**Q: Does it follows pages which are opened at runtime**

---

Yes, it automatically follows pages which is created at runtime.

**Q: is there an option to disable video recording for new page created and record video only for the page object passed**

---

Yes, By setting the `options.followNewTab` to false, it record only video for the passed page object alone.

**Q: Does it support to record video at 60 fps**

---

Yes, video can be recorded at 60 fps. By setting `options.fps` to 60.

**Q:Does it use the window object?**

---

No, it doesn't use the window object.

**Q: Does it use FFMPEG internally?**

---

Yes, it uses FFMPEG with optimized options to speed up the video recording using stream from chrome devtool protocol.
