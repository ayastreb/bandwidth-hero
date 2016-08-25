const fs    = require('fs');
const sharp = require('sharp');

sharp('web_heart_animation.png')
    //.grayscale()
    //.format('png')
    .grayscale()
    .normalize()
    .quality(40)
    .progressive()
    .toFormat('jpeg')
    .toFile('grayscale.png', err => console.log(err));
