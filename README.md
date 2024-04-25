# <img alt="puppeteer screen recorder logo" width="128px" src="https://github.com/prasanaworld/puppeteer-screen-recorder/blob/main/asserts/puppeteer-screen-recorder.png" /> puppeteer-screen-recorder

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

<a href="https://github.com/prasanaworld/puppeteer-screen-recorder/issues/new">Add Feature Request</a>

</p>

## Recording video/audio from video conferencing calls
If you’re looking to use this repo to retrieve video or audio streams from meeting platforms like Zoom, Google Meet, Microsoft Teams, consider checking out [Recall.ai](https://www.recall.ai/?utm_source=github&utm_medium=sponsorship&utm_campaign=puppeteer-screen-recorder), an API for meeting recording.

## Be a Sponsor
Puppeteer-screen-recorder isn't backed by a company, so the future of this project depends on you. Become a sponsor or a backer - help the open source community. 

#### **For Companies and Businesses**
By becoming a Github Sponsor, your company and brand will be recognized as a one that gives back to the open source tools that run your business and one that respects your developers time and your customers' experience.

#### **For Developers**
By helping your company become a Github Sponsor, you will not only feel great about giving back to the open source tools that run your business run, If you believe your company could become a sponsor, then please reach out!

  + [open-collective](https://opencollective.com/puppeteer-screen-recorder)
  + [Paypal](https://paypal.me/prasanaworld)
  + [Bitcoin - 3NdGW6wKVFgxa1X5XxRDNHqMWAhGNSrA5A](3NdGW6wKVFgxa1X5XxRDNHqMWAhGNSrA5A)

## Key Feature

### 1. Follow Page Automatically

Automatically follows pages (multiple pages) which are opened at runtime, which will be part of video capturing. Also support options to disable the default flow.

### 2. No overhead over FF_MPEG library

FFMPEG library's installation and configuration are automatically managed by the library internally. Also offers options to configure with custom library path.

### 3. Native Implementation

This plugin works directly with native [chrome devtool protocol](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-startScreencast) to capture the video under the wood without any other thirdparty puppeteer plugins for screen capturing.

### 4. Adopted the Chromium principles

Adopted Chromium principles such as Speed, Security, Stability and Simplicity. It also ensures no frames are missed during video capturing and doesn't impact the performance, since its doesn't use any other puppeteer plugin internally.

### 5. Supports multiple video format and stream

Supports multiple video format like AVI, MP4, MOV and WEBM. Enable support for writable or duplex stream for process the output streaming .

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
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
```

**2. Setup the Configuration object.**

```javascript
const Config = {
  followNewTab: true,
  fps: 25,
  ffmpeg_Path: '<path of ffmpeg_path>' || null,
  videoFrame: {
    width: 1024,
    height: 768,
  },
  videoCrf: 18,
  videoCodec: 'libx264',
  videoPreset: 'ultrafast',
  videoBitrate: 1000,
  autopad: {
    color: 'black' | '#35A5FF',
  },
  aspectRatio: '4:3',
};
```

> - **followNewTab** : Boolean value which is indicate whether to follow the tab or not. Default value is true.

> - **fps**: Numeric value which denotes no.of Frames per second in which the video should be recorded. default value is 25.

> - **ffmpeg_Path**: String value pointing to the installation of [FFMPEG](https://ffmpeg.org/). Default is null (Automatically install the FFMPEG and use it).

> - **videoFrame**: An object which is to specify the width and height of the capturing video frame. Default to browser viewport size.

> - **aspectRatio**: Specify the aspect ratio of the video. Default value is `4:3`.

> - **autopad**: Specify whether autopad option is used and its color. Default to autopad deactivation mode.

> - **recordDurationLimit**: Numerical value specify duration (in seconds) to record the video. By default video is recorded till stop method is invoked`. (Note: It's mandatory to invoke Stop() method even if this value is set)

**3. create a new instance of video recording**

```javascript
const recorder = new PuppeteerScreenRecorder(page, Config); // Config is optional

// or

const recorder = new PuppeteerScreenRecorder(page);
```

> - **page**: Puppeteer page object which needs to captured.
> - **config**: Config is an optional object.
>   Default value is `{ followNewTab: true, fps: 25, ffmpeg_Path: null }`

**4. Start Video capturing**

**Option 1 - Start video capturing and save as file**

```javascript
const SavePath = './test/demo.mp4';
await recorder.start(savePath);
```

**Option 2 - Start Video capturing using stream**

```javascript
const pipeStream = new PassThrough();
await recorder.startStream(pipeStream);
```

> **pass**: Any writeable stream that will be an output for the stream recorder. Video is recorded and streamed with .mp4 extension.

> **savePath**: string value indicating the directory on where to save the video. The path must also specify the name of the video with extension .mp4 (example - ./test/puppeteer-demo.mp4). Starting from v2, support added for extensions mp4, avi, mov and webm.

**5. Stop the video capturing.**

```javascript
await recorder.stop();
```

### Example

```javascript
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start('./report/video/simple.mp4'); // supports extension - mp4, avi, webm and mov
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

**Q: Does it support multiple extension?**

---

Yes, Starting from version 2.0, support multiple extension like AVI, MP4, MOV and WEBM.

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

**Q: Does it support Webm?**

---

Webm format is supported.

**Q: Is it possible to output the stream for further processing/enhancing?**

---

Yes. By passing writable stream/duplex stream to `startStream` method.

**Q: Can I limit the time of recording, like to stop after 2 minutes?**

---

By specifying the time to record (in seconds) using `option.recordDurationLimit`

**Q: Does it support audio recording?**

---

No, it doesn't audio recording.

**Q: Does it support GIF format, any plan to support in fur?**

---

No, it wont support GIF. since Gif is considered as a image format.


