const skipUrls = [
    'bandwidth-hero.s3.amazonaws.com',
    'syndication.twitter.com',
    'facebook.com/(tr/|rsrc.php|impression.php)',
    'google-analytics',
    'favicon',
    '.*\.svg'
];
const socketUri = 'wss://lit-inlet-44494.herokuapp.com/';
const placeholder = chrome.extension.getURL('/res/images/placeholder.png');
var socket = new WebSocket(socketUri);
var connected = false;

socket.onopen = () => connected = true;
socket.onclose = () => connected = false;
socket.onmessage = rawMessage => {
    if (rawMessage == 'ping') return;

    const message = JSON.parse(rawMessage.data);
    setTimeout(() => chrome.tabs.sendMessage(message.tabId, message), 1000);
};

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        if (details.url.match(RegExp(`(${skipUrls.join('|')})`, 'i'))) return;
        if (details.url.match(/https?:\/\/.+/i)) {
            if (!connected) {
                socket = new WebSocket(socketUri);
            }
            socket.send(JSON.stringify({
                tabId: details.tabId,
                url: details.url
            }));

            return {
                redirectUrl: placeholder
            };
        }
    },
    {
        urls: ["<all_urls>"],
        types: ["image"]
    },
    ["blocking"]
);
