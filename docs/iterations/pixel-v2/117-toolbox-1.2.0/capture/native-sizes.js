// Convert's measured sizes, as the 1.2.0 app measures them (PX-117).
//
// The browser stand-in measures Convert's outputs with WebKit's canvas encoders, which cannot
// encode WebP and differ from the app's native libjpeg-turbo and libwebp. This shim answers the
// stand-in's encodes of the two Less Noise posters with blobs of the byte counts the 1.2.0 CLI
// measured natively (`toolbox convert LESSNOISE_POSTERS-02.png LESSNOISE_POSTERS-03.png
// --formats jpeg webp --action inspect --json`, compression 10, full size), so the screen shows
// what the app shows for these files. Every other encode goes through unchanged.
// Loaded by a copy of the UI build's index.html for the convert capture only (../README.md).
;(() => {
  const SIZES = {
    'LESSNOISE_POSTERS-02': { 'image/jpeg': 382822, 'image/webp': 179774 },
    'LESSNOISE_POSTERS-03': { 'image/jpeg': 331100, 'image/webp': 134468 },
  }
  // the two posters are both 3601×5400; one pixel tells them apart (02 is green at 50%/20%, 03 white)
  const which = (canvas) => {
    if (canvas.width !== 3601 || canvas.height !== 5400) return null
    const [r] = canvas.getContext('2d').getImageData(1800, 1080, 1, 1).data
    return r < 128 ? 'LESSNOISE_POSTERS-02' : 'LESSNOISE_POSTERS-03'
  }
  const real = OffscreenCanvas.prototype.convertToBlob
  OffscreenCanvas.prototype.convertToBlob = function convertToBlob(options = {}) {
    const poster = which(this)
    const bytes = poster && SIZES[poster][options.type]
    if (bytes) return Promise.resolve(new Blob([new Uint8Array(bytes)], { type: options.type }))
    return real.call(this, options)
  }
})()
