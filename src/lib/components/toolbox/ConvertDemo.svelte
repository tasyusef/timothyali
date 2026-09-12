<script lang="ts">
  // Convert: two posters in the stack, the formats, compression and longest edge in
  // the rail. The outputs are real: the browser encodes each poster at the chosen
  // settings the way the app does (canvas for PNG, JPEG and WebP) and the sizes and
  // percentages are measured. TIFF is the app's uncompressed writer (4 bytes a pixel)
  // and PDF is the JPEG placed on one page, both computed the same way.
  import Arrow from '$lib/components/Arrow.svelte';
  import { fileSize, delta } from './plan';
  type Fmt = 'png' | 'jpeg' | 'webp' | 'tiff' | 'pdf';
  const meta: Record<Fmt, { label: string; ext: string; quality: boolean; note: string }> = {
    png: { label: 'PNG', ext: 'png', quality: false, note: 'Lossless, keeps transparency' },
    jpeg: { label: 'JPEG', ext: 'jpg', quality: true, note: 'Small, no transparency' },
    webp: { label: 'WebP', ext: 'webp', quality: true, note: 'Small, keeps transparency' },
    tiff: { label: 'TIFF', ext: 'tiff', quality: false, note: 'Uncompressed, for print' },
    pdf: { label: 'PDF', ext: 'pdf', quality: true, note: 'One page, image placed at size' }
  };
  const all: Fmt[] = ['png', 'jpeg', 'webp', 'tiff', 'pdf'];
  const W = 1800, H = 2400;
  const edges: { label: string; value: number | null }[] = [{ label: 'Full size', value: null }, { label: '1500', value: 1500 }, { label: '1000', value: 1000 }, { label: '500', value: 500 }];
  type Src = { id: string; name: string; canvas: HTMLCanvasElement; bytes: number; thumb: string };
  let formats = $state<Record<Fmt, boolean>>({ png: false, jpeg: true, webp: true, tiff: false, pdf: false });
  let compression = $state(10);
  let maxEdge = $state<number | null>(null);
  let files = $state<Src[]>([]);
  let sizes = $state<Record<string, number | null>>({});
  let measuring = $state(false);
  const active = $derived(all.filter((f) => formats[f]));
  const usesQuality = $derived(active.some((f) => meta[f].quality));
  const outSize = $derived.by(() => { if (!maxEdge || maxEdge >= H) return { w: W, h: H }; const s = maxEdge / H; return { w: Math.round(W * s), h: maxEdge }; });

  // the two posters, drawn once: the shapes of the Palette example, at print size
  const draw = (id: string): HTMLCanvasElement => {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d')!;
    const rect = (x: number, y: number, w: number, h: number, f: string) => { g.fillStyle = f; g.fillRect(W * x, H * y, W * w, H * h); };
    const disc = (x: number, y: number, r: number, f: string) => { g.fillStyle = f; g.beginPath(); g.arc(W * x, H * y, W * r, 0, Math.PI * 2); g.fill(); };
    if (id === '01') { rect(0, 0, 1, 1, '#f4f1e7'); disc(0.62, 0.32, 0.34, '#ff683b'); disc(0.3, 0.58, 0.26, '#174c43'); rect(0.1, 0.78, 0.5, 0.1, '#f2d600'); }
    else { rect(0, 0, 1, 1, '#11110e'); for (let i = 0; i < 9; i++) rect(0.1 + i * 0.09, 0.1, 0.045, 0.5 + (i % 3) * 0.1, i % 2 ? '#f2d600' : '#f4f1e7'); disc(0.72, 0.8, 0.14, '#ff683b'); }
    return c;
  };
  const encode = (c: HTMLCanvasElement, type: string, q?: number) => new Promise<number>((res) => c.toBlob((b) => res(b?.size ?? 0), type, q));
  const scaled = (c: HTMLCanvasElement, w: number, h: number) => { if (w === c.width) return c; const s = document.createElement('canvas'); s.width = w; s.height = h; s.getContext('2d')!.drawImage(c, 0, 0, w, h); return s; };

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
      if (alive) files = list;
    })();
    return () => { alive = false; };
  });

  let gen = 0;
  $effect(() => {
    const srcs = files, fm = active, q = 1 - compression / 100, size = outSize;
    if (!srcs.length) return;
    const mine = ++gen;
    measuring = true;
    const timer = setTimeout(async () => {
      const next: Record<string, number | null> = {};
      for (const f of srcs) {
        const c = scaled(f.canvas, size.w, size.h);
        let jpeg: number | null = null;
        for (const fmt of fm) {
          let n: number;
          if (fmt === 'png') n = await encode(c, 'image/png');
          else if (fmt === 'tiff') n = 8 + size.w * size.h * 4 + 210;
          else { jpeg ??= await encode(c, 'image/jpeg', q); n = fmt === 'jpeg' ? jpeg : fmt === 'pdf' ? jpeg + 920 : await encode(c, 'image/webp', q); }
          if (gen !== mine) return;
          next[`${f.id}/${fmt}`] = n;
        }
      }
      sizes = next; measuring = false;
    }, 120);
    return () => clearTimeout(timer);
  });
  const total = $derived(files.reduce((n, f) => n + active.reduce((m, fmt) => m + (sizes[`${f.id}/${fmt}`] ?? 0), 0), 0));
</script>
<div class="readout lbl"><span class="path">~/Toolbox/Convert</span><span>{files.length} files</span></div>
<div class="split">
  <div class="stage">
    <div class="stack">
      {#each files as f (f.id)}
        <div class="stack-row">
          <div class="pic artboard plate-light"><img src={f.thumb} alt="" width="96" height="128" /></div>
          <div class="text"><span class="body">{f.name}</span><span class="lbl dim">PNG / {W}×{H} / {fileSize(f.bytes)}{#if outSize.w !== W} / resized to {outSize.w}×{outSize.h}{/if}</span></div>
          <div class="figures">{#each active as fmt (fmt)}{@const n = sizes[`${f.id}/${fmt}`] ?? null}<div class="figure"><span class="body">.{meta[fmt].ext}</span><span class="lbl dim">{n === null ? '—' : fileSize(n)}</span><span class="lbl dim">{n === null ? '' : delta(f.bytes, n)}</span></div>{/each}</div>
        </div>
      {/each}
      {#if !files.length}<span class="lbl dim">Reading…</span>{/if}
    </div>
  </div>
  <div class="rail">
    <section class="rail-section" style="gap:var(--s1)">
      <div class="rail-head lbl dim"><span>Formats</span></div>
      <div class="chips lbl">{#each all as f (f)}<button type="button" class="chip" aria-pressed={formats[f]} title={meta[f].note} onclick={() => { if (formats[f] && active.length === 1) return; formats[f] = !formats[f]; }}>{meta[f].label}</button>{/each}</div>
    </section>
    {#if usesQuality}
      <section class="rail-section" style="gap:var(--s1)">
        <div class="rail-head lbl dim"><span>Compression</span></div>
        <div style="display:flex;align-items:center;gap:var(--s2)"><input type="range" min="0" max="100" step="5" aria-label="Compression" bind:value={compression} style="flex:1" /><span class="lbl" style="width:48px;text-align:right">{compression}%</span></div>
      </section>
    {/if}
    <section class="rail-section" style="gap:var(--s1)">
      <div class="rail-head lbl dim"><span>Longest edge</span></div>
      <div class="chips lbl">{#each edges as e (e.label)}<button type="button" class="chip" aria-pressed={maxEdge === e.value} onclick={() => (maxEdge = e.value)}>{e.label}</button>{/each}</div>
    </section>
    <section class="rail-section">
      <div class="rail-head lbl dim"><span>Destination</span></div>
      <button type="button" class="btn body" style="width:100%;justify-content:space-between" disabled><span class="nowrap">Choose where to save…</span><Arrow /></button>
    </section>
  </div>
</div>
<div class="toolbar lbl">
  <button type="button" class="btn lbl" disabled><Arrow dir="left" />Back</button>
  <span class="dim">{files.length * active.length} files / {fileSize(total)}{measuring ? '…' : ''}</span>
  <button type="button" class="cta lbl" disabled title="Export happens in the app">Convert<Arrow /></button>
</div>
