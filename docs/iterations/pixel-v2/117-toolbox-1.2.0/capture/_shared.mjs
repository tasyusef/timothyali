// Shared setup for the 1.2.0 website screenshots (PX-117). These scenarios run in the Toolbox
// app repo's hidden WebKit harness (parity/ui/run.mjs, alpha-0 never-key windows), against a
// trunk build of crates/ui served by parity/ui/serve-dist.mjs. They live here, not in the app
// repo, and import its seed helpers by path. See ../README.md for the command.
import { seed, project, palette, conversion, specimen, lockup, exportEntry, thumbnail, TODAY, YESTERDAY, LAST_WEEK, LAST_YEAR } from '/Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/app/parity/ui/lib/seed.mjs'

export const ASSETS = {
  // PARC's stacked logo (Timothy's pick for 1.2.0; the 1.1 shot showed the Pocketwatch mark, hidden
  // since 0219); the posters are the ones the 1.1 screenshots showed
  logo: '/Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/parc/brand/PARC_BOGO-02.svg',
  poster1: '/Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/archive/gridform/brand/LESSNOISE_POSTERS-01.png',
  poster2: '/Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/archive/gridform/brand/LESSNOISE_POSTERS-02.png',
  poster3: '/Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/archive/gridform/brand/LESSNOISE_POSTERS-03.png',
}

// The website's screens: 1440×872 at 2× (2880×1744), dark, motion on (the app's default), and
// the port-only Edges section shown, as in the shipped app.
export const VIEWPORT = { width: 1440, height: 872, dpr: 2 }

const LESS = ['#166349', '#EF542D', '#EFCC16', '#198EA8']
const ACME = ['#D32F05', '#003A5D', '#F5B700']

// A studio with four projects and a little saved work in each, so the projects home and the
// sidebar look lived in.
const P1 = 'A1C0FFEE-0000-4000-8000-000000000001'
const P2 = 'B1C0FFEE-0000-4000-8000-000000000002'
const P3 = 'C1C0FFEE-0000-4000-8000-000000000003'
const P4 = 'D1C0FFEE-0000-4000-8000-000000000004'
const lessEntries = [
  { name: 'Forest', hex: '#166349', cmyk: [85, 20, 75, 35], pantone: '' },
  { name: 'Signal', hex: '#EF542D', cmyk: [0, 80, 90, 0], pantone: '' },
  { name: 'Sun', hex: '#EFCC16', cmyk: [5, 15, 95, 0], pantone: '' },
  { name: 'Lake', hex: '#198EA8', cmyk: [80, 25, 25, 0], pantone: '' },
]
export const studioStorage = {
  ...seed({
    project: [
      project(P1, 'Less Noise', '/web/Work/Less Noise', TODAY),
      project(P2, 'Acme', '/web/Clients/Acme', YESTERDAY),
      project(P3, 'Cobalt Studio', '/web/Clients/Cobalt', LAST_WEEK),
      project(P4, 'Birch & Co', null, LAST_YEAR),
    ],
    palette: [
      [palette('pal-1', 'Less Noise colors', P1, TODAY, lessEntries), thumbnail(LESS)],
      [palette('pal-2', 'Acme colors', P2, YESTERDAY), thumbnail(ACME)],
    ],
    convert: [
      [conversion('cnv-1', 'LESSNOISE_POSTERS-02.png', P1, TODAY), thumbnail(['#FFFFFF', ...LESS, '#FFFFFF'])],
      [conversion('cnv-2', 'team-photo.jpg', P2, LAST_WEEK), thumbnail(['#6B5A4B', '#C9B8A3', '#3E4A55'])],
    ],
    specimen: [
      [specimen('spc-1', 'Acme type', P2, YESTERDAY), thumbnail(['#FFFFFF', '#111111', '#FFFFFF'])],
      [specimen('spc-2', 'Cobalt type', P3, LAST_WEEK), thumbnail(['#FFFFFF', '#111111'])],
    ],
    lockup: [
      [lockup('lck-1', 'Acme logo', P2, YESTERDAY), thumbnail(['#FFFFFF', '#D32F05', '#FFFFFF'])],
      [lockup('lck-2', 'Cobalt mark', P3, LAST_WEEK), thumbnail(['#FFFFFF', '#1F3FBF', '#FFFFFF'])],
    ],
    export: [
      exportEntry('exp-1', P1, 'palette', 'pal-1', 'Less Noise colors', '/web/Work/Less Noise/Palette/Less Noise colors', TODAY),
      exportEntry('exp-2', P1, 'convert', 'cnv-1', 'LESSNOISE_POSTERS-02.png', '/web/Work/Less Noise/Converted', TODAY),
      exportEntry('exp-3', P2, 'lockup', 'lck-1', 'Acme logo', '/web/Clients/Acme/Acme logo Logo Library', YESTERDAY),
      exportEntry('exp-4', P3, 'specimen', 'spc-2', 'Cobalt type', '/web/Clients/Cobalt/Cobalt type', LAST_WEEK),
    ],
  }),
  'toolbox-motion': 'on',
  'toolbox-port-only': 'on',
}

/** A tool's editor, fresh (TOOLBOX_NEW), as parity/ui/lib/steps.mjs `newTool`. */
export const newTool = (tool) => [{ navigate: `/?TOOLBOX_TOOL=${tool}&TOOLBOX_NEW=1` }]

/** Park the pointer over the readout strip, away from anything with a hover state. */
export const park = { mouse: { x: 1200, y: 30 } }
