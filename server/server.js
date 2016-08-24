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

    /**
     * Generate unique hash key for image based on host and path,
     * check if this file already exist in S3 bucket with HEAD request,
     * if it does not exist yet - compress image and upload to S3,
     * otherwise just respond with compressed image URL.
     *
     * @param String imageUrl original image URL
     */
    function processImage(imageUrl) {
        console.log(`Received message: ${imageUrl}`);
        const parsedUrl = url.parse(imageUrl);
        if (!parsedUrl || !parsedUrl.protocol.match(/https?:/i)) return;

        const key      = generateUniqueFileKey(parsedUrl);
        const amazonS3 = new aws.S3({params: {Bucket: S3_BUCKET, Key: key}});

        amazonS3.headObject(err => {
            if (!err) {
                respond(`https://${S3_BUCKET}.s3.amazonaws.com/${key}`);
            } else if (err.code == 'NotFound') {
                let failed        = false;
                const transformer = prepareImageTransformer(parsedUrl);

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

ws.on('error', err => {
    console.log(`WebSocket error: ${err}`);
})

/**
 * Generate unique key based on image URL.
 * It consist of folder, filename and extension.
 * Folder is SHA-1 hashed host (e.g. pbs.twimg.com becomes da7f52ba4bc88b4b9f10918c6b82da182147b979),
 * and filename is SHA-1 hashed URL path.
 * Extension is taken from URL without changes.
 *
 * @param Url parsedUrl parsed image URL object
 * @returns String unique key
 */
function generateUniqueFileKey(parsedUrl) {
    const folder    = crypto
        .createHash('sha1')
        .update(parsedUrl.host)
        .digest('hex');
    const filename  = crypto
        .createHash('sha1')
        .update(path.basename(parsedUrl.path))
        .digest('hex');
    const extension = path.extname(parsedUrl.pathname);

    return `${folder}/${filename}${extension}`;
}

/**
 * Prepare Sharp image transformer.
 *
 * @param Url parsedUrl parsed image URL object
 * @see http://sharp.readthedocs.io/en/stable/api/
 */
function prepareImageTransformer(parsedUrl) {
    const format = path.extname(parsedUrl.pathname) == 'png' ? 'png' : 'jpeg';
    return sharp()
        .toColorspace('b-w')
        .normalise()
        .quality(JPEG_QLT)
        .progressive()
        .toFormat(format);
}
