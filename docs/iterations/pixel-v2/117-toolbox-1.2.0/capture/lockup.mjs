// lockup: PARC's stacked logo on the outputs step (formats, treatments, sizes, Edges, colors).
import { VIEWPORT, studioStorage, newTool, park, ASSETS } from './_shared.mjs'

export default {
  id: 'lockup',
  title: 'Site shot: Lockup outputs',
  viewport: VIEWPORT,
  storage: studioStorage,
  steps: [
    ...newTool('lockup'),
    { waitFor: { sel: 'h2.display-s', text: 'Drop your logo SVGs' } },
    { files: { click: { sel: 'button.cta', textIncludes: 'Browse' }, files: [ASSETS.logo] } },
    { waitFor: { sel: '.tile', count: 1 } },
    { click: { sel: '.toolbar button.cta', textIncludes: 'Continue' } },
    { waitFor: { sel: '[role=group][aria-label="Edges"]' } },
    park,
    { checkpoint: 'outputs' },
  ],
}
