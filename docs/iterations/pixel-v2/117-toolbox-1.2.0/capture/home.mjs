// home: the projects index, where 1.2.0 opens, with four projects.
import { VIEWPORT, studioStorage, park } from './_shared.mjs'

export default {
  id: 'home',
  title: 'Site shot: the projects home',
  viewport: VIEWPORT,
  storage: studioStorage,
  steps: [
    { navigate: '/?TOOLBOX_TOOL=home' },
    { waitFor: { sel: '.app-main .entries button.entry', count: 4 } },
    park,
    { checkpoint: 'home' },
  ],
}
