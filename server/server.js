'use strict'
const express = require('express')
const request = require('request')
const sharp = require('sharp')

const QUALITY = parseInt(process.env.JPEG_QUALITY) || 40
const PORT = process.env.PORT || 5000

process.on('uncaughtException', err => console.log(`process error: ${err}`))

const app = express()
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
app.get('/compress', compress)
app.get('/', compress)

function compress(req, res) {
  const imageUrl = req.query.url
  if (!imageUrl.match(/^https?:/i)) return res.status(400).end()

  const transformer = sharp().grayscale().toFormat('webp', { quality: QUALITY })
  transformer.on('error', err => console.log(`Error in ${imageUrl}: ${err}`))
  transformer.on('data', processedImage => {
    console.log(`Compressed: ${imageUrl}`)
    res.writeHead(200, {
      'Content-Type': 'image/webp',
      'Content-Length': processedImage.length
    })
  })

  request(imageUrl).pipe(transformer).pipe(res)
}
