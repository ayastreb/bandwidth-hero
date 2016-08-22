const socketUri = 'wss://lit-inlet-44494.herokuapp.com/';
var socket;
var connected = false;
var elementsByUrl = {};
var pendingUrls = [];
var observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(traverse));
});

connect(socketUri);
document.body.childNodes.forEach(traverse);
observer.observe(document.body, {childList: true, subtree: true});

function connect(socketUri) {
    socket = new WebSocket(socketUri);

    socket.onopen = () => {
        connected = true;
        processPendingUrls();
    };

    socket.onclose = () => {
        connected = false;
        setTimeout(() => connect(socketUri), 1000);
    };

    socket.onmessage = rawMessage => {
        const message = JSON.parse(rawMessage.data);
        if (elementsByUrl[message.original]) {
            const node = elementsByUrl[message.original];
            if (node.nodeName == 'IMG') {
                node.src = message.compressed;
            } else {
                node.style.backgroundImage = `url('${message.compressed}')`;
            }
        }
    };
}

function traverse(node) {
    if (node.nodeType == Node.ELEMENT_NODE && node.offsetParent !== null) {
        if (node.nodeName == 'IMG' && node.hasAttribute('src')) {
            replaceImage(node, node.src);
        } else {
            var backgroundImage = window.getComputedStyle(node).backgroundImage;
            var url = backgroundImage.match(/url\(['"]+(.*)['"]+\)/i);
            if (url && url.length) {
                replaceImage(node, url[1]);
            }
        }

        // TODO handle iframes

        if (node.hasChildNodes()) {
            node.childNodes.forEach(traverse);
        }
    }
}

function replaceImage(node, imageUrl) {
    if (elementsByUrl[imageUrl]) return;

    elementsByUrl[imageUrl] = node;
    pendingUrls.push(imageUrl);
    processPendingUrls();
}

function processPendingUrls() {
    if (!connected) return;

    while (pendingUrls.length > 0) {
        socket.send(pendingUrls.pop());
    }
}
