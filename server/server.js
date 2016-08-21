'use strict';
const express    = require('express'),
    SocketServer = require('ws').Server,
    request      = require('request'),
    sharp        = require('sharp'),
    path         = require('path'),
    uuid         = require('node-uuid'),
    url          = require('url'),
    aws          = require('aws-sdk'),
    fs           = require('fs');

const PORT      = process.env.PORT || 5000;
const S3_BUCKET = process.env.S3_BUCKET || 'bandwidth-hero';
const JPEG_QLT  = process.env.JPEG_QUALITY || 40;

const server = express()
    .use((req, res) => res.end('Bandwidth Hero Server'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({server});

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', rawMessage => processImage(JSON.parse(rawMessage), ws));
    ws.on('close', () => console.log('Client disconnected'));
});

function processImage(message, socket) {
    const imageUrl = url.parse(message.url);
    if (!imageUrl) return;

    const dir = imageUrl.host,
        filename = `${dir}/${uuid.v4()}${path.extname(imageUrl.pathname)}`,
        s3 = new aws.S3({
            params: {
                Bucket: S3_BUCKET,
                Key: filename
            }
        }),
        transformer = sharp()
            .grayscale()
            .normalise()
            .quality(JPEG_QLT)
            .progressive()
            .toFormat('jpeg'),
        stream = request(message.url).pipe(transformer);
    transformer.on('error', err => console.log(`Error in ${message.url} : ${err}`));

    s3.upload({Body: stream}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Compressed ${message.url} to ${JPEG_QLT}% JPEG.`);
            socket.send(JSON.stringify({
                tabId: message.tabId,
                original: message.url,
                compressed: data.Location
            }));
        }
    });
}
