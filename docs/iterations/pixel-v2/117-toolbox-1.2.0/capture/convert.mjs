// convert: two posters measured as JPEG and WebP, as the 1.1 shot.
import { VIEWPORT, studioStorage, newTool, park, ASSETS } from './_shared.mjs'

const measured = { sel: '.toolbar [role=status]', textExcludes: '…' }
const chip = (text) => ({ sel: '.rail .chips button.chip', text })

export default {
  id: 'convert',
  title: 'Site shot: Convert, two posters measured',
  viewport: VIEWPORT,
  storage: studioStorage,
  steps: [
    ...newTool('convert'),
    { files: { click: { sel: 'button.cta', textIncludes: 'Browse' }, files: [ASSETS.poster2, ASSETS.poster3] } },
    { waitFor: { sel: '.stack-row', count: 2 } },
    { waitFor: { sel: '.stack-row .lbl', text: 'Reading…', gone: true }, timeout: 120000 },
    { click: chip('JPEG') },
    { click: chip('WebP') },
    { click: chip('PNG') },
    { waitFor: { sel: '.rail .chips button.chip[aria-pressed="false"]', text: 'PNG' } },
    { waitFor: measured, timeout: 240000 },
    park,
    { checkpoint: 'measured' },
  ],
}
