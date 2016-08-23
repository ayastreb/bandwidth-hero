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

    ws.on('message', processImage);
    ws.on('close', () => console.log('Client disconnected'));

    function processImage(imageUrl) {
        const parsedUrl = url.parse(imageUrl);
        if (!parsedUrl || !parsedUrl.protocol.match(/https?:/i)) return;

        const key      = generateS3FileKey(parsedUrl);
        const amazonS3 = new aws.S3({params: {Bucket: S3_BUCKET, Key: key}});

        amazonS3.headObject(err => {
            if (!err) {
                respond(`https://${S3_BUCKET}.s3.amazonaws.com/${key}`);
            } else if (err.code == 'NotFound') {
                var failed        = false;
                const transformer = prepareImageTransformer();

                transformer.on('error', err => {
                    console.log(`Error compressing ${imageUrl}:`);
                    console.log(err);
                    failed = true;
                });

                amazonS3.upload(
                    {Body: request(imageUrl).pipe(transformer)},
                    (err, data) => {
                        if (!err && !failed) respond(data.Location);
                    }
                );
            }
        });

        function respond(compressedImageUrl) {
            console.log(`Processed ${imageUrl} => ${compressedImageUrl}`);
            ws.send(JSON.stringify({
                original:   imageUrl,
                compressed: compressedImageUrl
            }));
        }
    }
});

function generateS3FileKey(imageUrl) {
    const folder    = crypto
        .createHash('sha1')
        .update(imageUrl.host)
        .digest('hex');
    const filename  = crypto
        .createHash('sha1')
        .update(path.basename(imageUrl.path))
        .digest('hex');
    const extension = path.extname(imageUrl.pathname);

    return `${folder}/${filename}${extension}`;
}

function prepareImageTransformer() {
    return sharp()
        .grayscale()
        .normalise()
        .quality(JPEG_QLT)
        .progressive()
        .toFormat('jpeg');
}
