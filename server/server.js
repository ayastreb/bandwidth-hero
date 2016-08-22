'use strict';
const SocketServer = require('ws').Server;
const express      = require('express');
const request      = require('request');
const crypto       = require('crypto');
const sharp        = require('sharp');
const path         = require('path');
const url          = require('url');
const aws          = require('aws-sdk');
const fs           = require('fs');

const S3_BUCKET = process.env.S3_BUCKET || 'bandwidth-hero';
const JPEG_QLT  = process.env.JPEG_QUALITY || 40;
const PORT      = process.env.PORT || 5000;

const server = express()
    .use((req, res) => res.end('Bandwidth Hero Server'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({server});

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => processImage(ws, JSON.parse(message)));
    ws.on('close', () => console.log('Client disconnected'));
});

function processImage(socket, message) {
    const imageUrl = url.parse(message.url);
    if (!imageUrl) return;

    const key = generateS3FileKey(imageUrl);
    const s3 = new aws.S3({params: {Bucket: S3_BUCKET, Key: key}});

    s3.headObject(err => {
        if (!err) {
            console.log(`From cache: ${message.url}`);
            respond(`https://${S3_BUCKET}.s3.amazonaws.com/${key}`);
        } else if (err.code == 'NotFound') {
            var failed = false;
            const transformer = prepareImageTransformer();
            const stream = request(message.url).pipe(transformer);

            transformer.on('error', err => {
                console.log(`Error in ${message.url}:`);
                console.log(err);
                failed = true;
            });

            s3.upload({Body: stream}, (err, data) => {
                if (!err && !failed) {
                    console.log(`Compressed: ${message.url}`);
                    respond(data.Location);
                }
            });
        }
    });

    function respond(compressedImageUrl) {
        socket.send(JSON.stringify({
            tabId: message.tabId,
            original: message.url,
            compressed: compressedImageUrl
        }));
    }
}

function generateS3FileKey(imageUrl) {
    const dir = crypto
        .createHash('sha1')
        .update(imageUrl.host)
        .digest('hex');
    const filename = crypto
        .createHash('sha1')
        .update(path.basename(imageUrl.pathname))
        .digest('hex');
    const extension = path.extname(imageUrl.pathname);

    return `${dir}/${filename}${extension}`;
}

function prepareImageTransformer() {
    return sharp()
        .grayscale()
        .normalise()
        .quality(JPEG_QLT)
        .progressive()
        .toFormat('jpeg');
}
