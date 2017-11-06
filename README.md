# What is Bandwidth Hero?

It's an open-source browser extension which compresses images on the page to save data.
It uses [compression proxy](https://github.com/ayastreb/bandwidth-hero-proxy) to convert all images to greyscale [WebP](https://developers.google.com/speed/webp/) or JPEG images.

## How It Works?

![Workflow](https://raw.githubusercontent.com/ayastreb/bandwidth-hero/master/how-it-works.png)

1. When active, Bandwidth Hero intercepts all images loading requests
2. It sends each image URL to the compression proxy server
3. Proxy server downloads the original image
4. Once image is downloaded it is then converted to greyscale [WebP](https://developers.google.com/speed/webp/)/JPEG image.
5. Proxy server returns compressed image to the browser

## Privacy Consideration

Please note that proxy server does not store the images anywhere, it compresses them on the fly.
However if you want to be 100% sure you can run your own proxy server instance.

Please refer to [compression proxy docs](https://github.com/ayastreb/bandwidth-hero-proxy)
for detailed instructions on how to run your own proxy.

Once you have your own instance running, just update the URL under "Compression settings" in the extension popup.

## Credits

daredevil logo by Daniel Pineda from the Noun Project
