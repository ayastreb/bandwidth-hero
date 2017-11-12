<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/GNA5BNmoDRUjxvuDQsxXY3kW/ayastreb/bandwidth-hero'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/GNA5BNmoDRUjxvuDQsxXY3kW/ayastreb/bandwidth-hero.svg' />
</a>

![Bandwidth Hero](https://raw.githubusercontent.com/ayastreb/bandwidth-hero/master/src/assets/logo.png)

[![Build Status](https://travis-ci.org/ayastreb/bandwidth-hero.svg?branch=master)](https://travis-ci.org/ayastreb/bandwidth-hero)
[![Code Climate](https://codeclimate.com/github/ayastreb/bandwidth-hero/badges/gpa.svg)](https://codeclimate.com/github/ayastreb/bandwidth-hero)

Bandwidth Hero is an open-source browser extension which reduces the amount of data consumed when you browse
web pages by compressing all images on the page.
It uses [data compression service](https://github.com/ayastreb/bandwidth-hero-proxy) to convert images to low-resolution [WebP](https://developers.google.com/speed/webp/) or JPEG images.

## How It Works?

![Workflow](https://raw.githubusercontent.com/ayastreb/bandwidth-hero/master/how-it-works.png)

1. When active, Bandwidth Hero intercepts all images loading requests
2. It sends each image URL to the data compression service
3. Compression service downloads the original image
4. Once image is downloaded it is then converted to low-resolution [WebP](https://developers.google.com/speed/webp/)/JPEG image.
5. Compression service returns processed image to the browser

## Privacy Consideration

Please note that compression service does not store the images anywhere, it processes them on the fly.
However if you want to be 100% sure you can run your own service instance.

Please refer to [data compression service docs](https://github.com/ayastreb/bandwidth-hero-proxy)
for detailed instructions on how to run your own service.

Once you have your own instance running, just update the URL under "Compression settings" in the extension popup.

## Installation

[![Get Extension](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_340x96.png)](https://chrome.google.com/webstore/detail/bandwidth-hero/mmhippoadkhcflebgghophicgldbahdb?hl=en-US)

[![Get Firefox Addon](https://raw.githubusercontent.com/ayastreb/bandwidth-hero/master/ff-addon-badge.png)](https://addons.mozilla.org/en-US/firefox/addon/bandwidth-hero/)

## Credits

daredevil logo by Daniel Pineda from the Noun Project
