"""Add the seven glyphs the site needs to PARC Pixel Regular and Bold (decision 0078).
Source: ../timothyali/static/parc/PARC_Pixel{,-Bold}.woff2 (untouched). Output: static/fonts/.
Each glyph is drawn on the weight's own grid: Regular = 160-unit cells, 1-cell strokes, 1-cell
side gap; Bold = 800/11-unit cells, 3-cell strokes, 2-cell side gap. Rectangles only, like the
originals. Run with a venv that has fonttools + brotli:  python tools/fonts/extend-parc-pixel.py
"""
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen

SRC = '../timothyali/static/parc/'
OUT = 'static/fonts/'

def rects_to_glyph(pen_rects, glyphset):
    pen = TTGlyphPen(glyphset)
    for (x0, y0, x1, y1) in pen_rects:
        pen.moveTo((x0, y0)); pen.lineTo((x1, y0)); pen.lineTo((x1, y1)); pen.lineTo((x0, y1)); pen.closePath()
    return pen.glyph()

def build(name, c, stroke_cells, gap_cells):
    f = TTFont(SRC + name + '.woff2')
    u = lambda n: int(round(n * c))          # cells → font units on this weight's grid
    s = stroke_cells                          # stroke in cells
    g = gap_cells
    mid_lo = u(2) if s == 1 else u(4)         # the hyphen's height on each grid (320–480 / 291–509)
    mid_hi = mid_lo + u(s)
    top = 800
    glyphs = {
        'bracketleft':    ([(0, 0, u(s), top), (0, top - u(s), u(2 * s) if s == 1 else u(5), top), (0, 0, u(2 * s) if s == 1 else u(5), u(s))], (u(2 * s) if s == 1 else u(5)) + u(g)),
        'bracketright':   ([((u(2 * s) if s == 1 else u(5)) - u(s), 0, u(2 * s) if s == 1 else u(5), top), (0, top - u(s), u(2 * s) if s == 1 else u(5), top), (0, 0, u(2 * s) if s == 1 else u(5), u(s))], (u(2 * s) if s == 1 else u(5)) + u(g)),
        'periodcentered': ([(0, mid_lo, u(s), mid_hi)], u(s) + u(g)),
        'endash':         ([(0, mid_lo, u(4) if s == 1 else u(9), mid_hi)], (u(4) if s == 1 else u(9)) + u(g)),
        'emdash':         ([(0, mid_lo, u(6) if s == 1 else u(13), mid_hi)], (u(6) if s == 1 else u(13)) + u(g)),
    }
    # quoteright: the straight apostrophe's shape, reused
    cmap = f.getBestCmap(); gs = f.getGlyphSet(); hm = f['hmtx'].metrics
    qs = cmap[ord("'")]
    glyf = f['glyf']
    # multiply: five blocks on the diagonals, centred on the cap
    if s == 1:
        blocks = [(0, u(3)), (u(2), u(3)), (u(1), u(2)), (0, u(1)), (u(2), u(1))]; bw = u(1); adv = u(3) + u(g)
        mult = [(x, y, x + bw, y + bw) for x, y in blocks]
    else:
        bw = u(3); step = u(2)
        blocks = [(0, u(7)), (u(6), u(7)), (u(3), u(4)), (0, u(1)), (u(6), u(1))]
        adv = u(9) + u(g)
        mult = [(x, y, x + bw, y + bw) for x, y in blocks]
    glyphs['multiply'] = (mult, adv)

    order = f.getGlyphOrder()
    codes = {'bracketleft': 0x5B, 'bracketright': 0x5D, 'periodcentered': 0xB7, 'endash': 0x2013, 'emdash': 0x2014, 'multiply': 0xD7, 'quoteright': 0x2019}
    for gname, (rects, adv) in glyphs.items():
        glyf[gname] = rects_to_glyph(rects, gs); hm[gname] = (adv, 0)  # glyf appends to the order itself
    # quoteright = copy of quotesingle
    import copy
    glyf['quoteright'] = copy.deepcopy(glyf[qs]); hm['quoteright'] = hm[qs]
    order = list(glyf.glyphOrder); f.setGlyphOrder(order)
    for gname in list(glyphs) + ['quoteright']: glyf[gname].recalcBounds(glyf)
    for table in f['cmap'].tables:
        if table.isUnicode():
            for gname, code in codes.items(): table.cmap[code] = gname
    f['maxp'].recalc(f)
    if 'post' in f and f['post'].formatType == 2.0:
        f['post'].extraNames = []; f['post'].mapping = {}
    # one family name per weight, because each weight sits on its own pixel grid (Regular 6.25 cells/em, Bold 13.75)
    f['name'].setName('PARC Pixel Bold Web' if 'Bold' in name else 'PARC Pixel Web', 1, 3, 1, 0x409)
    f.flavor = 'woff2'
    f.save(OUT + name.replace('PARC_Pixel', 'parc-pixel').lower() + '.woff2')
    print('wrote', name, 'glyphs', len(order), {k: v[1] for k, v in glyphs.items()})


def redraw_ampersand(name, c, stroke_cells, cap_cells, shift=1, stub_cells=None):
    """The ampersand is the weight's own 3, mirrored, with a stub one stroke tall coming out of
    the top and the bottom on the centre column — not a line through it (Timothy, 2026-09-09:
    "just use the 3 glyph and flip it" … "just make it come out the top and bottom. not all the way through")."""
    import os
    from fontTools.pens.recordingPen import DecomposingRecordingPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.pens.reverseContourPen import ReverseContourPen
    path = OUT + name.replace('PARC_Pixel', 'parc-pixel').lower() + '.woff2'
    f = TTFont(path if os.path.exists(path) else SRC + name + '.woff2')
    u = lambda n: int(round(n * c))
    glyf = f['glyf']; gs = f.getGlyphSet(); hm = f['hmtx'].metrics; cmap = f.getBestCmap()
    three = cmap[ord('3')]; amp = cmap[ord('&')]
    g3 = glyf[three]; g3.recalcBounds(glyf); w = g3.xMax  # the 3 starts at x=0 in every cut
    pen = TTGlyphPen(gs)
    gs[three].draw(TransformPen(ReverseContourPen(pen), (-1, 0, 0, 1, w, 0)))  # mirror across the glyph's own width
    t = u(stroke_cells); mid = u(round((w / c - stroke_cells) / 2) + shift)      # column offset from centre, per weight (Timothy, 2026-09-09)
    h = u(stub_cells) if stub_cells else t                                        # stub height, per weight
    for (x0, y0, x1, y1) in [(mid, -h, mid + t, 0), (mid, 800, mid + t, 800 + h)]:
        pen.moveTo((x0, y0)); pen.lineTo((x1, y0)); pen.lineTo((x1, y1)); pen.lineTo((x0, y1)); pen.closePath()
    glyf[amp] = pen.glyph(); glyf[amp].recalcBounds(glyf)
    hm[amp] = hm[three]
    f['maxp'].recalc(f)
    if 'post' in f and f['post'].formatType == 2.0: f['post'].extraNames = []; f['post'].mapping = {}
    if not os.path.exists(path): f['name'].setName(('PARC Pixel Mono Web' if 'Mono' in name else 'PARC Pixel Web'), 1, 3, 1, 0x409)
    f.flavor = 'woff2'; f.save(path); print('ampersand = mirrored 3 + stubs', name, 'width', w, 'centre', mid)


def regrid_bold(path):
    """The Bold is drawn on an 800/11-unit cell, which is not an integer, so its advances
    (945 = 13 cells) are rounded and at 55px a glyph advances 51.975px instead of 52. Rescale
    the em to 1100 units so the cell is exactly 80: every coordinate and advance snaps to the
    cell and the text boxes land on whole pixels at 41.25 / 55 / 82.5 / 110 (cells 3/4/6/8)."""
    from fontTools.ttLib.tables._g_l_y_f import Glyph
    f = TTFont(path); k = 1.1; cell = 80
    snap = lambda v: int(round(round(v * k / cell) * cell))
    glyf = f['glyf']; hm = f['hmtx'].metrics
    for gname in f.getGlyphOrder():
        g = glyf[gname]
        if g.numberOfContours > 0:
            g.coordinates = type(g.coordinates)([(snap(x), snap(y)) for x, y in g.coordinates])
        adv, lsb = hm[gname]; hm[gname] = (snap(adv), snap(lsb))
        g.recalcBounds(glyf)
    f['head'].unitsPerEm = 1100
    for tbl, attrs in [('hhea', ['ascent', 'descent', 'lineGap', 'advanceWidthMax', 'minLeftSideBearing', 'minRightSideBearing', 'xMaxExtent']),
                       ('OS/2', ['sTypoAscender', 'sTypoDescender', 'sTypoLineGap', 'usWinAscent', 'usWinDescent', 'sCapHeight', 'sxHeight', 'xAvgCharWidth'])]:
        t = f[tbl]
        for a in attrs:
            if hasattr(t, a): setattr(t, a, snap(getattr(t, a)))
    f['head'].xMin, f['head'].yMin, f['head'].xMax, f['head'].yMax = snap(f['head'].xMin), snap(f['head'].yMin), snap(f['head'].xMax), snap(f['head'].yMax)
    f['maxp'].recalc(f); f.flavor = 'woff2'; f.save(path); print('regridded', path, 'upem 1100, cell 80')

build('PARC_Pixel', 160, 1, 1)
build('PARC_Pixel-Bold', 800 / 11, 3, 2)
# the new ampersand, every weight (Light and the Mono cuts only get this change)
# Regular: stubs on the centre column; Bold: one cell right, stubs 2 cells tall instead of 3; Light: one cell right.
for name, c, stroke, cap, shift, stub in [('PARC_Pixel', 160, 1, 5, 0, None), ('PARC_Pixel-Bold', 800 / 11, 3, 11, 1, 2), ('PARC_Pixel-Light', 800 / 9, 1, 9, 1, None),
                                          ('PARC_Pixel-Mono', 160, 1, 5, 0, None), ('PARC_Pixel-Mono-Bold', 800 / 11, 3, 11, 1, 2), ('PARC_Pixel-Mono-Light', 800 / 9, 1, 9, 1, None)]:
    redraw_ampersand(name, c, stroke, cap, shift, stub)
for bold in ['parc-pixel-bold', 'parc-pixel-mono-bold']:
    regrid_bold(OUT + bold + '.woff2')
