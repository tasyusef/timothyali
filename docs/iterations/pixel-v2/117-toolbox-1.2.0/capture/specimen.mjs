// specimen: the brand sheet with its default Helvetica roles and the live preview.
import { VIEWPORT, studioStorage, newTool, park } from './_shared.mjs'

export default {
  id: 'specimen',
  title: 'Site shot: Specimen brand sheet',
  viewport: VIEWPORT,
  storage: studioStorage,
  steps: [
    ...newTool('specimen'),
    { waitFor: 'img[alt="Type sheet preview"]' },
    { waitFor: { sel: 'input[aria-label="Style role"]', count: 3 } },
    park,
    { checkpoint: 'brand' },
  ],
}
