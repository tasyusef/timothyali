# Phone crops (0206): a tighter cut of a desktop screenshot, served at <=700px through Picture's
# `phone` source, so the UI it shows can be read at phone width. Regions are fractions of the
# source (x0, y0, x1, y1). Output is PNG beside the source as <name>-phone.png, at most 1200px wide.
# Run: python3 tools/images/phone-crops.py, then node tools/images/derive.mjs for the WebP ladder.
import os
from PIL import Image
CROPS = {
  'static/work/sonde/cover.png':        (0.26, 0.22, 0.80, 0.76),
  'static/work/pocketwatch/cover.png':  (0.26, 0.22, 0.80, 0.76),
  'static/work/toolbox/cover.png':      (0.26, 0.22, 0.80, 0.76),
  'static/toolbox/lockup.png':          (0.72, 0.13, 1.00, 0.82),
  'static/toolbox/palette.png':         (0.70, 0.13, 1.00, 0.85),
  'static/toolbox/specimen.png':        (0.135, 0.14, 0.60, 0.75),
  'static/toolbox/convert.png':         (0.32, 0.13, 0.665, 0.44),
  'static/toolbox/home.png':            (0.00, 0.13, 0.56, 0.55),
  'static/work/pocketwatch/app-dashboard.png':   (0.685, 0.02, 0.985, 0.54),
  'static/work/pocketwatch/app-accounts.png':    (0.06, 0.01, 0.41, 0.64),
  'static/work/pocketwatch/app-investments.png': (0.07, 0.06, 0.43, 0.63),
  'static/work/pocketwatch/app-budget.png':      (0.07, 0.02, 0.43, 0.69),
  # First Ledger's guide slides: the content band of each 16:9 slide
  'static/work/firstledger/guide-01.png': (0.25, 0.30, 0.75, 0.70),
  'static/work/firstledger/guide-04.png': (0.22, 0.30, 0.78, 0.72),
  'static/work/firstledger/guide-03.png': (0.20, 0.15, 0.80, 0.85),
  'static/work/firstledger/guide-05.png': (0.20, 0.30, 0.80, 0.75),
  'static/work/firstledger/guide-10.png': (0.24, 0.24, 0.76, 0.86),
  'static/work/firstledger/guide-02.png': (0.08, 0.25, 0.92, 0.90),
  'static/work/firstledger/guide-07.png': (0.12, 0.30, 0.88, 0.75),
  'static/work/firstledger/guide-08.png': (0.22, 0.30, 0.78, 0.75),
}
for src, (x0, y0, x1, y1) in CROPS.items():
    hi = src.replace('.png', '@2x.jpg')
    im = Image.open(hi if os.path.exists(hi) else src)
    W, H = im.size
    box = (round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H))
    c = im.crop(box)
    if c.width > 1200: c = c.resize((1200, round(c.height * 1200 / c.width)), Image.LANCZOS)
    out = src.replace('.png', '-phone.png'); c.save(out, optimize=True)
    print(out, c.size)
