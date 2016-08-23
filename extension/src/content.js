// TODO make server uri configurable
const serverUri = 'wss://lit-inlet-44494.herokuapp.com/';
var socket;
var nodesByUrl  = {};
var pendingUrls = [];
var observer    = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(processNode));
});

document.body.childNodes.forEach(processNode);
observer.observe(document.body, {childList: true, subtree: true});

/**
 * Check if node is a DOM element and is visible.
 * Try to find image URL in the element and add it to the processing queue.
 * Traverse all node children recursively.
 *
 * @param Node node to process
 */
function processNode(node) {
    if (node.nodeType == Node.ELEMENT_NODE && node.offsetParent !== null) {
        if (node.nodeName == 'IMG' && node.hasAttribute('src')) {
            requestImageCompression(node.src, node);
        } else {
            var url = window
                .getComputedStyle(node)
                .backgroundImage
                .match(/url\(['"]+(.*)['"]+\)/i);
            if (url && url.length) {
                requestImageCompression(url[1], node);
            }
        }

        // TODO handle iframes

        if (node.hasChildNodes()) {
            node.childNodes.forEach(processNode);
        }
    }
}

/**
 * Add image URL to the processing queue and
 * keep reference to the node it belongs to,
 * so that we can update this node when we receive
 * compressed image back from server.
 *
 * @param String imageUrl original image URL
 * @param Node   node     node, to which image belongs
 */
function requestImageCompression(imageUrl, node) {
    if (nodesByUrl[imageUrl]) return;

    nodesByUrl[imageUrl] = node;
    pendingUrls.push(imageUrl);
    processPendingUrls();
}

/**
 * Connect to compressing server if it's not connected yet,
 * and send all queued image URLs to the server.
 */
function processPendingUrls() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        if (!socket || socket.readyState !== WebSocket.CONNECTING) connect();
        return;
    }

    while (pendingUrls.length > 0) {
        socket.send(pendingUrls.pop());
    }
}

/**
 * Receive response from the server, which should have following format:
 * {
 *   "original": "<original_image_url>",
 *   "compressed": "<compressed_image_url>"
 * }
 *
 * Look up node corresponding to the original image and update it.
 *
 * @param String response JSON as a string
 */
function processResponse(response) {
    const data = JSON.parse(response.data);
    const node = nodesByUrl[data.original];
    if (node !== undefined) {
        if (node.nodeName == 'IMG') {
            node.src = data.compressed;
        } else {
            node.style.backgroundImage = `url('${data.compressed}')`;
        }
    }
}

/**
 * Connect to server via WebSocket and assign event handlers.
 */
function connect() {
    socket = new WebSocket(serverUri);

    socket.onopen    = processPendingUrls;
    socket.onmessage = processResponse;
}
