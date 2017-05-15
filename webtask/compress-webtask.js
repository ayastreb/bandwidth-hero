'use strict'
const request = require('request')
const sharp = require('sharp')

const JPEG_QUALITY = 40

module.exports = (context, req, res) => {
  const imageUrl = req.query.url
  if (!imageUrl.match(/^https?:/i)) return res.status(400).end()

  const transformer = sharp().grayscale().toFormat('webp', {
    quality: JPEG_QUALITY,
    compressionLevel: 9,
    progressive: true
  })
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
