# Bandwidth Hero Privacy Policy

"Bandwidth Hero" is a browser extension which saves the amount of data consumed by the page.
It intercepts all images loading requests and converts those images to
low-resolution WebP or JPEG image via compression proxy server.

This extension is open-source, source code available at [GitHub](https://github.com/ayastreb/bandwidth-hero).

## Information Collection and Processing

When you use "Bandwidth Hero" browser extension it forwards all images loading
requests to the compression proxy server, including images from secure and
authenticated web pages (e.g. Facebook, Twitter etc).
By default this extension uses following proxy server URL:

https://wt-e9c9a7a436fcd9273a7f8890849dae65-0.run.webtask.io/bandwidth-hero-proxy

The proxy server does not store downloaded images.
It processes images on the fly, downloading them from original server and converting in memory.
Server access logs (e.g. image URL) might be stored on the server.

It is possible for users to run their own instance of the proxy server on their own hardware/hosting.
If you would like to run your own proxy server and use it for compression,
follow [proxy installation instructions](https://github.com/ayastreb/bandwidth-hero-proxy/blob/master/README.md).
Once you have your own proxy server running, you can change the URL in the extension popup
under "Compression settings" tab.

## Information Sharing

"Bandwidth Hero" does not collect or share any user information with any 3rd parties.

## Security

"Bandwidth Hero" communicates with compression proxy server via secured connection (HTTPS).

## Contact

If you have any questions regarding privacy, please contact me via email at anatoliy.yastreb@gmail.com
