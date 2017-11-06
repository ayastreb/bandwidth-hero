# Bandwidth Hero Privacy Policy

"Bandwidth Hero" is a browser extension which reduces the amount of data consumed by browsing web pages.
It intercepts all images loading requests and converts those images to
low-resolution WebP or JPEG image via data compression service.

This extension is open-source, source code available at [GitHub](https://github.com/ayastreb/bandwidth-hero).

## Information Collection and Processing

When you use "Bandwidth Hero" browser extension it forwards all images loading
requests to the data compression service, including images from secure and
authenticated web pages (e.g. Facebook, Twitter etc).

By default this extension uses public data compression service URL:

`https://compressor.bandwidth-hero.com`

This data compression service does not store downloaded images.
It processes images on the fly, downloading them from original server and converting in memory.
Server access logs (e.g. image URL, user IP address) might be stored on the server.

This data compression service is **NOT** an anonymizing proxy &mdash; it downloads images on user's behalf,
passing cookies and user's IP address through to the origin host.

By using the public data compression service user agrees to <a href="https://bandwidth-hero.com/terms">Terms and Conditions of Use</a>.

It is possible for users to run their own instance of the data compression service on their own hardware/hosting.
If you would like to run your own compression service,
follow [installation instructions](https://github.com/ayastreb/bandwidth-hero-proxy/blob/master/README.md).
Once you have your own service instance running, you can change the URL in the extension popup
under the "Compression settings" tab.

## Information Sharing

"Bandwidth Hero" does not collect or share any user information with any 3rd parties.

## Security

"Bandwidth Hero" communicates with compression proxy server via secured connection (HTTPS).

## Contact

If you have any questions regarding privacy, please <a href="mailto:privacy@bandwidth-hero.com">contact</a> us.
