// palette: a poster imported as artwork, its suggested colours in a strip, the outputs and files.
import { VIEWPORT, studioStorage, newTool, park, ASSETS } from './_shared.mjs'

export default {
  id: 'palette',
  title: 'Site shot: Palette with artwork',
  viewport: VIEWPORT,
  storage: studioStorage,
  steps: [
    ...newTool('palette'),
    { files: { click: { sel: 'button.cta', textIncludes: 'Browse' }, files: [ASSETS.poster1] } },
    { waitFor: { sel: 'img[alt="Dropped artwork for color picking"]' } },
    { waitFor: { sel: 'button.btn-icon[title^="Add #"]' } },
    park,
    { checkpoint: 'artwork' },
  ],
}
