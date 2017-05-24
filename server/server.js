'use strict'
const express = require('express')
const request = require('request')
const sharp = require('sharp')

const PORT = process.env.PORT
const QUALITY = 40

process.on('uncaughtException', err => console.log(`process error: ${err}`))

const app = express()
if (PORT > 0) {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`))
}

app.get('/', (req, res) => {
  const imageUrl = req.query.url
  if (!imageUrl.match(/^https?:/i)) return res.status(400).end()

  let originalFileSize = 0
  const transformer = sharp().grayscale().toFormat('webp', { quality: QUALITY })
  transformer.on('error', err => console.log(`Error in ${imageUrl}: ${err}`))
  transformer.on('data', processedImage => {
    console.log(`Compressed: ${imageUrl}`)
    res.writeHead(200, {
      'Content-Type': 'image/webp',
      'Content-Length': processedImage.length,
      'X-Original-Size': originalFileSize,
      'X-Bytes-Saved': originalFileSize - processedImage.length
    })
  })

  request
    .get(imageUrl)
    .on(
      'response',
      response => (originalFileSize = response.headers['content-length'])
    )
    .pipe(transformer)
    .pipe(res)
})

module.exports = app
