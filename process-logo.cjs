const Jimp = require('jimp');

async function processLogo() {
  try {
    const image = await Jimp.read('./public/OfficialLogo.jpeg');
    const lightImage = image.clone();
    const darkImage = image.clone();

    const width = image.bitmap.width;
    const height = image.bitmap.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const hex = image.getPixelColor(x, y);
        const rgba = Jimp.intToRGBA(hex);
        
        const r = rgba.r;
        const g = rgba.g;
        const b = rgba.b;
        
        // Brightness (0-255)
        const brightness = (r + g + b) / 3;
        
        // Is this pixel distinctly blue? Logo blue is ~(50, 130, 240)
        const isBlue = b > r + 40 && b > 100;

        // AGGRESSIVE threshold: anything near-white (>200 brightness) and NOT blue = background
        if (brightness > 200 && !isBlue) {
          // Background pixel — fully transparent
          lightImage.setPixelColor(Jimp.rgbaToInt(255, 255, 255, 0), x, y);
          darkImage.setPixelColor(Jimp.rgbaToInt(255, 255, 255, 0), x, y);
        } else if (isBlue) {
          // Blue logo element — keep for both themes
          // alpha based on saturation (closer to pure blue = more opaque)
          const alpha = Math.min(255, Math.round(255 - (brightness * 0.5)));
          lightImage.setPixelColor(Jimp.rgbaToInt(r, g, b, alpha), x, y);
          darkImage.setPixelColor(Jimp.rgbaToInt(r, g, b, alpha), x, y);
        } else {
          // Dark/black logo text
          // Alpha: darker pixels are more opaque
          const alpha = Math.min(255, Math.round(255 - brightness));
          
          // Light mode: black text (keep original RGB, vary alpha)
          lightImage.setPixelColor(Jimp.rgbaToInt(r, g, b, alpha), x, y);
          
          // Dark mode: invert to white text
          const inv = 255 - Math.round(brightness);
          darkImage.setPixelColor(Jimp.rgbaToInt(255, 255, 255, alpha), x, y);
        }
      }
    }

    await lightImage.writeAsync('./public/logo-light.png');
    await darkImage.writeAsync('./public/logo-dark.png');
    console.log('Logos generated successfully.');
  } catch (err) {
    console.error(err);
  }
}

processLogo();
