chrome.webRequest.onBeforeRequest.addListener(
    imagesHandler,
    {
        urls: ["<all_urls>"],
        types: ["image"]
    },
    ["blocking"]
);

function imagesHandler(details) {
    return {
        redirectUrl: chrome.extension.getURL('/res/images/placeholder.png')
    };
}
