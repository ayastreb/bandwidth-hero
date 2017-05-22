![Bandwidth Hero](https://raw.githubusercontent.com/ayastreb/bandwidth-hero/master/docs/logo.png)
[![Build Status](https://travis-ci.org/ayastreb/bandwidth-hero.svg?branch=master)](https://travis-ci.org/ayastreb/bandwidth-hero)
[![Code Climate](https://codeclimate.com/github/ayastreb/bandwidth-hero/badges/gpa.svg)](https://codeclimate.com/github/ayastreb/bandwidth-hero)

Bandwidth Hero is a Chrome extension which compresses images on the page to save bandwidth.

## How It Works?

![Workflow](https://raw.githubusercontent.com/ayastreb/bandwidth-hero/master/docs/workflow-v2.png)

1. When active, Bandwidth Hero intercepts all images loading requests
2. It sends each image URL to the compression proxy server, hosted at Heroku
3. Proxy server downloads the original image
4. Once image is downloaded it is then compressed to black and white
5. Proxy server returns compressed image to the browser

## Privacy Consideration

Please note that proxy server does not store the images anywhere, it compresses them on the fly.
However if you want to be 100% sure you can run your own proxy server instance.

Please refer to [Server Docs](https://github.com/ayastreb/bandwidth-hero/tree/master/server) 
for detailed instructions on how to run your own proxy.

## Installation

[![Get Extension](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_340x96.png)](https://chrome.google.com/webstore/detail/bandwidth-hero/mmhippoadkhcflebgghophicgldbahdb?hl=en-US)

## Known Issues

* Glitches on GMail & GoogleMaps

## Credits

daredevil logo by Daniel Pineda from the Noun Project
