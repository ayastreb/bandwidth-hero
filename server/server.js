'use strict'
const express = require('express')
const request = require('request')
const sharp = require('sharp')
const path = require('path')
const url = require('url')

const JPEG_QLT = parseInt(process.env.JPEG_QUALITY) || 40
const PORT = process.env.PORT || 5000

process.on('uncaughtException', err => console.log(`process error: ${err}`))

const app = express()
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

app.get('/compress', (req, res) => {
  const imageUrl = req.query.url
  const parsedUrl = url.parse(imageUrl)
  if (!imageUrl.match(/^https?:/i) || !parsedUrl) return res.status(400).end()

  let transformer = prepareImageTransformer(parsedUrl)
  transformer.on('error', err => {
    console.log(`Error compressing ${imageUrl}: ${err}`)
  })

  request(imageUrl)
    .pipe(transformer)
    .pipe(res)
    .on('finish', () => console.log(`Compressed: ${imageUrl}`))
    .on('error', () => console.log(`Error in: ${imageUrl}`))
})

/**
 * Prepare Sharp image transformer.
 *
 * @param Url parsedUrl parsed image URL object
 * @see http://sharp.readthedocs.io/en/stable/api/
 */
function prepareImageTransformer (parsedUrl) {
  const ext = path.extname(parsedUrl.pathname)
  if (ext === '.png' || ext === '.gif') {
    return sharp()
      .grayscale()
      .normalize()
      .toFormat('png')
  } else {
    return sharp()
      .grayscale()
      .normalize()
      .quality(JPEG_QLT)
      .progressive()
      .toFormat('jpeg')
  }
}
