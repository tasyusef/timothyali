<script lang="ts">
  // Convert (ui-convert view.rs, tool-convert view.rs at 1.2.5): the images in a stack, each with
  // what it becomes per format; the formats, compression, longest edge and background in the
  // rail. The outputs are real: the browser encodes each poster at the chosen settings the way
  // the app does (canvas for PNG, JPEG and WebP) and the sizes and changes are measured. TIFF
  // is the app's uncompressed writer (4 bytes a pixel, 3 once a background fills it) and PDF
  // the JPEG placed on one page, both computed the same way.
  import { tick } from 'svelte';
  import DemoReadout from './DemoReadout.svelte';
  import DemoToolbar from './DemoToolbar.svelte';
  import DestinationRow from './DestinationRow.svelte';
  import Icon from './Icon.svelte';
  import { fileSize, changePercent, qualityFor, formatsLine, transparencyNote, totalsLine } from './plan';

  type Fmt = 'png' | 'jpeg' | 'webp' | 'tiff' | 'pdf';
  // the codecs' table (codec.rs FormatMeta)
  const META: Record<Fmt, { label: string; ext: string; quality: boolean; alpha: boolean; note: string }> = {
    png: { label: 'PNG', ext: 'png', quality: false, alpha: true, note: 'Lossless, keeps transparency' },
    jpeg: { label: 'JPEG', ext: 'jpg', quality: true, alpha: false, note: 'Small, no transparency' },
    webp: { label: 'WebP', ext: 'webp', quality: true, alpha: true, note: 'Small, keeps transparency' },
    tiff: { label: 'TIFF', ext: 'tiff', quality: false, alpha: true, note: 'Uncompressed, for print' },
    pdf: { label: 'PDF', ext: 'pdf', quality: true, alpha: false, note: 'One page, image placed at size' }
  };
  const ALL: Fmt[] = ['png', 'jpeg', 'webp', 'tiff', 'pdf'];
  const EDGES: { label: string; value: number | null }[] = [{ label: 'Full size', value: null }, { label: '3000', value: 3000 }, { label: '2000', value: 2000 }, { label: '1000', value: 1000 }, { label: '500', value: 500 }];
  const PRESETS = [{ label: 'White', value: '#ffffff' }, { label: 'Black', value: '#000000' }];
  const W = 1800, H = 2400;
  type Src = { id: string; name: string; canvas: HTMLCanvasElement; bytes: number; thumb: string };
  let formats = $state<Record<Fmt, boolean>>({ png: false, jpeg: true, webp: true, tiff: false, pdf: false });
  let compression = $state(10); // the slider opens on 10%, encoder quality 0.93 (DEFAULT_QUALITY)
  let maxEdge = $state<number | null>(null);
  let background = $state<string | null>(null);
  let customHex = $state('#7f7f7f');
  let sources = $state.raw<Src[]>([]); // both posters, drawn once
  let files = $state.raw<Src[]>([]);
  let sizes = $state<Record<string, number>>({});
  let measured = $state(false);
  const active = $derived(ALL.filter((f) => formats[f]));
  const usesQuality = $derived(active.some((f) => META[f].quality));
  const custom = $derived(background !== null && !PRESETS.some((p) => p.value === background));
  const note = $derived(active.every((f) => META[f].alpha) ? null : transparencyNote(active.filter((f) => !META[f].alpha).map((f) => META[f].label), background));
  // target_size: past the longest edge, both sides scale and round
  const outSize = $derived.by(() => { const long = Math.max(W, H); if (maxEdge === null || long <= maxEdge) return { w: W, h: H }; const s = maxEdge / long; return { w: Math.max(1, Math.round(W * s)), h: Math.max(1, Math.round(H * s)) }; });
  const stem = (name: string) => name.replace(/\.[^.]+$/, '');

  // the two posters, drawn once at print size: the first on its cream ground, the second cut
  // out on transparency, so the background setting has something to fill
  const draw = (id: string): HTMLCanvasElement => {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d')!;
    const rect = (x: number, y: number, w: number, h: number, f: string) => { g.fillStyle = f; g.fillRect(W * x, H * y, W * w, H * h); };
    const disc = (x: number, y: number, r: number, f: string) => { g.fillStyle = f; g.beginPath(); g.arc(W * x, H * y, W * r, 0, Math.PI * 2); g.fill(); };
    if (id === '01') { rect(0, 0, 1, 1, '#f4f1e7'); disc(0.62, 0.32, 0.34, '#ff683b'); disc(0.3, 0.58, 0.26, '#174c43'); rect(0.1, 0.78, 0.5, 0.1, '#f2d600'); }
    else { for (let i = 0; i < 9; i++) rect(0.1 + i * 0.09, 0.1, 0.045, 0.5 + (i % 3) * 0.1, i % 2 ? '#f2d600' : '#174c43'); disc(0.72, 0.8, 0.14, '#ff683b'); }
    return c;
  };
  const encode = (c: HTMLCanvasElement, type: string, q?: number) => new Promise<number>((res) => c.toBlob((b) => res(b?.size ?? 0), type, q));
  // the output's pixels: resized, then over the background when there is one, or over white for a format without alpha
  const render = (c: HTMLCanvasElement, w: number, h: number, fill: string | null) => {
    if (w === c.width && fill === null) return c;
    const o = document.createElement('canvas'); o.width = w; o.height = h;
    const g = o.getContext('2d')!;
    if (fill) { g.fillStyle = fill; g.fillRect(0, 0, w, h); }
    g.drawImage(c, 0, 0, w, h); return o;
  };

  $effect(() => {
    let alive = true;
    (async () => {
      const list: Src[] = [];
      for (const id of ['01', '02']) {
        const canvas = draw(id);
        const bytes = await encode(canvas, 'image/png');
        const t = document.createElement('canvas'); t.width = 96; t.height = 128; t.getContext('2d')!.drawImage(canvas, 0, 0, 96, 128);
        list.push({ id, name: `ACME_POSTER-${id}.png`, canvas, bytes, thumb: t.toDataURL() });
      }
      if (alive) { sources = list; files = list; }
    })();
    return () => { alive = false; };
  });

  let gen = 0;
  $effect(() => {
    const srcs = files, fm = active, q = qualityFor(compression), size = outSize, bg = background;
    if (!srcs.length) return;
    const mine = ++gen;
    measured = false;
    const timer = setTimeout(async () => {
      const next: Record<string, number> = {};
      for (const f of srcs) {
        const keep = render(f.canvas, size.w, size.h, bg), flat = bg ? keep : render(f.canvas, size.w, size.h, '#ffffff');
        let jpeg: number | null = null;
        for (const fmt of fm) {
          let n: number;
          if (fmt === 'png') n = await encode(keep, 'image/png');
          else if (fmt === 'tiff') n = 8 + size.w * size.h * (bg ? 3 : 4) + 210;
          else if (fmt === 'webp') n = await encode(keep, 'image/webp', q); // WebP alone no longer encodes a JPEG first (0214)
          else { jpeg ??= await encode(flat, 'image/jpeg', q); n = fmt === 'jpeg' ? jpeg : jpeg + 920; }
          if (gen !== mine) return;
          next[`${f.id}/${fmt}`] = n;
        }
      }
      sizes = next; measured = true;
    }, 120);
    return () => clearTimeout(timer);
  });
  const size = (f: Src, fmt: Fmt): number | null => (measured ? (sizes[`${f.id}/${fmt}`] ?? null) : null);
  const total = $derived(measured ? files.reduce((n, f) => n + active.reduce((m, fmt) => m + (sizes[`${f.id}/${fmt}`] ?? 0), 0), 0) : null);
  // the removed row took its button with it: focus the next row's, or Add images after the last (PX-128)
  let stage: HTMLElement | undefined = $state();
  async function remove(i: number) {
    files = files.filter((_, j) => j !== i); await tick();
    (stage?.querySelectorAll<HTMLElement>('.convert-row .x')[i] ?? stage?.querySelector<HTMLElement>('.stack-actions .btn'))?.focus();
  }
  async function removeAll() { files = []; await tick(); stage?.querySelector<HTMLElement>('.stack-actions .btn')?.focus(); }
</script>
<DemoReadout route={['Convert']} />
<div class="split">
  <div class="stage" bind:this={stage}>
    <div class="stack">
      {#each files as f, i (f.id)}
        {@const resized = outSize.w !== W}
        <div class="stack-row convert-row reveal-scope">
          <div class="pic artboard plate-light"><img src={f.thumb} alt="" width="96" height="128" /></div>
          <div class="text">
            <span class="body">{f.name}</span>
            <span class="lbl dim">PNG&nbsp;· {W}×{H}&nbsp;· {fileSize(f.bytes)}</span>
            {#if resized}<span class="lbl dim">resized to {outSize.w}×{outSize.h}</span>{/if}
            <div class="outs lbl">
              {#each active as fmt (fmt)}
                {@const n = size(f, fmt)}{@const change = n === null ? null : changePercent(f.bytes, n)}
                <div class="out" title={`${stem(f.name)}.${META[fmt].ext}`}><span class="dim">{META[fmt].label}</span><span class="num">{n === null ? '—' : fileSize(n)}</span><span class="num" class:alert={change?.grew} class:dim={!change?.grew}>{change?.text ?? ''}</span></div>
              {/each}
            </div>
            <button type="button" class="btn-icon reveal-item x" title="Remove" aria-label={`Remove ${f.name}`} onclick={() => remove(i)}><Icon name="xmark" /></button>
          </div>
        </div>
      {/each}
      {#if !sources.length}<span class="lbl dim">Reading…</span>{/if}
      <div class="stack-actions">
        <button type="button" class="btn lbl" disabled={!sources.length || files.length === sources.length} title="Puts the example images back" onclick={() => (files = sources)}><Icon name="plus" />Add images</button>
        <button type="button" class="btn lbl" disabled={!files.length} onclick={removeAll}>Remove all</button>
      </div>
      {#if files.length}<p class="body dim convert-totals" role="status">{totalsLine(files.length, total, active.length)}</p>{/if}
    </div>
  </div>
  <div class="rail">
    <section class="rail-section tight">
      <div class="rail-head lbl dim"><span>Formats</span></div>
      <div class="chips lbl" role="group" aria-label="Formats">{#each ALL as f (f)}<button type="button" class="chip" aria-pressed={formats[f]} title={META[f].note} onclick={() => (formats[f] = !formats[f])}>{META[f].label}</button>{/each}</div>
      <p class="lbl note dim">{formatsLine(active.map((f) => META[f].note))}</p>
    </section>
    {#if usesQuality}
      <section class="rail-section tight">
        <div class="rail-head lbl dim"><span>Compression</span></div>
        <div class="range-row"><input type="range" min="0" max="100" step="5" aria-label="Compression" bind:value={compression} /><span class="lbl">{compression}%</span></div>
        <p class="lbl note dim">Applies to JPEG, WebP and PDF. PNG and TIFF are lossless.</p>
      </section>
    {/if}
    <section class="rail-section tight">
      <div class="rail-head lbl dim"><span>Longest edge</span></div>
      <div class="chips lbl" role="group" aria-label="Longest edge">{#each EDGES as e (e.label)}<button type="button" class="chip" aria-pressed={maxEdge === e.value} onclick={() => (maxEdge = e.value)}>{e.label}</button>{/each}</div>
    </section>
    <section class="rail-section tight">
      <div class="rail-head lbl dim"><span>Background</span></div>
      <div class="chips lbl bg" role="group" aria-label="Background">
        <button type="button" class="chip" aria-pressed={background === null} onclick={() => (background = null)}>Transparent</button>
        {#each PRESETS as p (p.value)}<button type="button" class="swatch-chip" style:background={p.value} aria-pressed={background === p.value} aria-label={`${p.label} background`} title={`${p.label} background`} onclick={() => (background = p.value)}></button>{/each}
        <input type="color" class="color-well swatch-chip" class:on={custom} aria-label="Custom background color" title="Custom background color" value={customHex} onchange={(e) => { customHex = e.currentTarget.value.toLowerCase(); background = customHex; }} />
      </div>
      {#if note}<p class="lbl note dim">{note}</p>{/if}
    </section>
    <DestinationRow />
  </div>
</div>
<DemoToolbar status="Conversions run in the desktop app." label="Convert…" />
<style>
/* the remove mark sits in the text block's corner, on its ground (design.css .convert-row .x) */
.convert-row .text{position:relative}
.convert-row .text>.body{padding-right:var(--s4)}
.convert-row .x{position:absolute;top:0;right:0}.convert-row .x:not(:hover):not(:focus-visible):not(:active){background:var(--paper)}
/* on a phone the picture steps down to 48, so the name breaks at its hyphen, not mid-word; at
   320 it goes, so the sizes keep their columns; a separator stays on the line it ends */
@media(max-width:420px){.stack-row.convert-row{grid-template-columns:48px minmax(0,1fr);gap:var(--s1)}.stack-row.convert-row .pic{width:48px;height:48px;padding:4px}}
@media(max-width:360px){.stack-row.convert-row{grid-template-columns:minmax(0,1fr)}.stack-row.convert-row .pic{display:none}}
.bg{align-items:center}
</style>
