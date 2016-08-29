'use strict';

const defaults = {
    enabled:           true,
    serverUrl:         'wss://bandwidth-hero.herokuapp.com/',
    compressedBaseUrl: 'bandwidth-hero.s3.amazonaws.com'
};

/**
 * Set default settings when extension is installed.
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set(defaults);
});

chrome.storage.sync.get(runBackground);

function runBackground(settings) {
    settings     = Object.assign({}, defaults, settings);
    let enabled = settings.enabled;

    if (!enabled) {
        chrome.browserAction.setIcon({path: 'res/images/icon-128-disabled.png'});
    }

    chrome.extension.onMessage.addListener(handleMessage);
    chrome.webRequest.onBeforeRequest.addListener(replaceImagesWithPlaceholder,
        {
            urls:  ['<all_urls>'],
            types: ['image']
        },
        ['blocking']
    );
    chrome.webRequest.onHeadersReceived.addListener(patchContentSecurityPolicy,
        {
            urls:  ['<all_urls>'],
            types: ['main_frame', 'sub_frame']
        },
        ['blocking', 'responseHeaders']
    );
    return;

    /**
     * Handle incoming messages from extension/popup.
     *
     * @param {Object} request
     */
    function handleMessage(request) {
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
            },
            'enable':         () => {
                enabled = true;
                chrome.browserAction.setIcon({
                    path: 'res/images/icon-128.png'
                });
            },
            'disable':        () => {
                enabled = false;
                chrome.browserAction.setIcon({
                    path: 'res/images/icon-128-disabled.png'
                });
            }
        }

        if (request.action in actionHandlers) {
            actionHandlers[request.action]();
        }
    }

    /**
     * Redirect images to default placeholder to prevent full image loading.
     *
     * @param {Object} details
     * @returns {Object} object
     */
    function replaceImagesWithPlaceholder(details) {
        const allowPatterns = [
            settings.compressedBaseUrl,
            'favicon',
            '.*\.svg'
        ];
        if (enabled
            && !details.url.match(RegExp(`(${allowPatterns.join('|')})`, 'i'))
            && details.url.match(/https?:\/\/.+/i)) {
            return {
                redirectUrl: chrome.extension.getURL('/res/images/placeholder.png')
            };
        }
    }

    /**
     * Patch Content-Security-Policy header to allow compressed images loading.
     *
     * @param {Object} details
     * @returns {Object} patched headeers
     */
    function patchContentSecurityPolicy(details) {
        for (var i = 0; i < details.responseHeaders.length; i++) {
            if (/content-security-policy/i.test(details.responseHeaders[i].name)) {
                details.responseHeaders[i].value = details
                    .responseHeaders[i]
                    .value
                    .replace('img-src', `img-src ${settings.compressedBaseUrl}`);
            }
        }

        return {
            responseHeaders: details.responseHeaders
        };
    }
}
