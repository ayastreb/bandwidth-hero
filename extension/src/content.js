// TODO make server uri configurable
const serverUri = 'wss://lit-inlet-44494.herokuapp.com/';
const baseUrl   = document.createElement('a');
baseUrl.href    = document.URL;
let socket;
let nodesByUrl  = {};
let pendingUrls = [];
let observer    = new MutationObserver(mutations => {
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
    if (node.nodeType == Node.ELEMENT_NODE) {
        if (node.nodeName == 'IMG') {
            const imageUrl = node.getAttribute('src') || node.getAttribute('data-src');
            requestImageCompression(imageUrl, node);
        } else {
            const styleUrl = node.hasAttribute('data-style')
                ? node.getAttribute('data-style')
                : window.getComputedStyle(node).backgroundImage;
            const urlMatch = styleUrl.match(/url\((.*)\)/i);
            if (urlMatch && urlMatch.length) {
                const imageUrl = urlMatch[1].replace(/["']/g, '', urlMatch[1]);
                requestImageCompression(imageUrl, node);
            }
        }

        if (node.hasChildNodes()) {
            node.childNodes.forEach(processNode);
        }
    }
}

/**
 * Add image URL to the processing queue and
 * keep reference of all nodes displaying this image,
 * so that we can update those nodes when we receive
 * compressed image back from server.
 *
 * @param String imageUrl original image URL
 * @param Node   node     node displaying the image
 */
function requestImageCompression(imageUrl, node) {
    if (node.hasAttribute('data-original-image') || !imageUrl) return;
    if (imageUrl.test(/\.svg/i)) return;
    if (imageUrl.startsWith('//')) {
        imageUrl = `${baseUrl.protocol}${imageUrl}`;
    } else if (imageUrl.startsWith('/')) {
        imageUrl = `${baseUrl.protocol}//${baseUrl.host}${imageUrl}`;
    }
    if (!nodesByUrl[imageUrl]) {
        nodesByUrl[imageUrl] = [];
        pendingUrls.push(imageUrl);
    }
    nodesByUrl[imageUrl].push(node);
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
    const data  = JSON.parse(response.data);
    const nodes = nodesByUrl[data.original];
    if (nodes && nodes.length) {
        while (nodes.length > 0) {
            const node = nodes.pop();
            node.setAttribute('data-original-image', data.original);
            if (node.nodeName == 'IMG') {
                node.src = data.compressed;
            } else {
                node.style.backgroundImage = `url('${data.compressed}')`;
            }
        }
        delete nodesByUrl[data.original];
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
