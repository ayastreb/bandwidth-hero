const placeholder             = chrome.extension.getURL('/res/images/placeholder.png');
const compressedImagesBaseUrl = 'bandwidth-hero.s3.amazonaws.com';
// TODO make skipped patterns configurable
const skipPatterns            = [
    compressedImagesBaseUrl,
    'syndication\.twitter\.com',
    'facebook\.com/(tr/|rsrc\.php|impression\.php)',
    'google-analytics',
    'favicon',
    '.*\.svg'
];

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        if (!details.url.match(RegExp(`(${skipPatterns.join('|')})`, 'i'))
            && details.url.match(/https?:\/\/.+/i)) {
            return {
                redirectUrl: placeholder
            };
        }
    },
    {
        urls:  ['<all_urls>'],
        types: ['image']
    },
    ['blocking']
);

chrome.webRequest.onHeadersReceived.addListener(
    details => {
        for (var i = 0; i < details.responseHeaders.length; i++) {
            if (/content-security-policy/i.test(details.responseHeaders[i].name)) {
                details.responseHeaders[i].value = details
                    .responseHeaders[i]
                    .value
                    .replace('img-src', `img-src ${compressedImagesBaseUrl}`);
            }
        }

        return {
            responseHeaders: details.responseHeaders
        };
    },
    {
        urls:  ['<all_urls>'],
        types: ['main_frame', 'sub_frame']
    },
    ['blocking', 'responseHeaders']
);
