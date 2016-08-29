# Bandwidth Hero

Bandwidth Hero is a Chrome extension which compresses images on the page to save bandwidth.

## How It Works?

![Workflow](https://raw.githubusercontent.com/ayastreb/bandwidth-hero/master/docs/workflow.png)

1. When active, Bandwidth Hero replaces all images on the page with a placeholder and observes document changes.
2. It sends each image URL to the compression proxy server, hosted at Heroku.
3. Proxy server downloads the original image and compresses it.
4. When image is compressed, proxy server uploads it to specified Amazon S3 bucket for storage.
5. Proxy server returns compressed image URL to Bandwidth Hero.
6. Bandwidth Hero finds corresponding element on the page an updates its image source with compressed one.
7. Browser loads compressed image from Amazon S3 bucket.

## Installation

[![Get Extension](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_340x96.png)](https://chrome.google.com/webstore/detail/bandwidth-hero/mmhippoadkhcflebgghophicgldbahdb?hl=en-US)

## Credits

daredevil logo by Daniel Pineda from the Noun Project
