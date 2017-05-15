# Bandwidth Hero Compress Webtask

This is a [webtask](https://webtask.io/) which compresses given image to
greyscale [WebP](https://developers.google.com/speed/webp/) image.

It uses [Request](https://github.com/request/request) to pipe original image
through [Sharp](https://github.com/lovell/sharp).

## Deployment

* Clone Bandwidth Hero repository:

  ```
  git clone https://github.com/ayastreb/bandwidth-hero.git
  ```

* Go to webtask directory:

  ```
  cd bandwidth-hero/webtask
  ```

* Install [Webtask CLI](https://webtask.io/cli):

  ```
  npm install wt-cli -g

  wt init __your_email__
  ```

* Create new webtask:

  ```
  wt create compress-webtask.js
  ```
