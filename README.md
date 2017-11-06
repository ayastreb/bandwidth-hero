# What is Bandwidth Hero?

It's an open-source browser extension which reduces the amount of data consumed when you browse
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

## Credits

daredevil logo by Daniel Pineda from the Noun Project
