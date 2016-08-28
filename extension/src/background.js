'use strict';
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

chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest,
    {
        urls:  ['<all_urls>'],
        types: ['image']
    },
    ['blocking']
);

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived,
    {
        urls:  ['<all_urls>'],
        types: ['main_frame', 'sub_frame']
    },
    ['blocking', 'responseHeaders']
);

chrome.extension.onMessage.addListener(onMessage);

/**
 * Redirect images to default placeholder to prevent full image loading.
 *
 * @param {Object} details
 * @returns {Object} object
 */
function onBeforeRequest(details) {
    if (!details.url.match(RegExp(`(${skipPatterns.join('|')})`, 'i'))
        && details.url.match(/https?:\/\/.+/i)) {
        return {
            redirectUrl: placeholder
        };
    }
}

/**
 * Patch Content-Security-Policy header to allow compressed images loading.
 *
 * @param {Object} details
 * @returns {Object} patched headeers
 */
function onHeadersReceived(details) {
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
}

/**
 * Handle incoming messages from extension/popup.
 *
 * @param {Object} request
 */
function onMessage(request) {
    const actionHandlers = {
        'setActiveIcon':  () => {
            chrome.browserAction.setIcon({
                path: 'res/images/icon-128-active.png'
            });
        },
        'setDefaultIcon': () => {
            chrome.browserAction.setIcon({
                path: 'res/images/icon-128.png'
            });
        }
    }

    if (request.action in actionHandlers) {
        actionHandlers[request.action]();
    }
}
