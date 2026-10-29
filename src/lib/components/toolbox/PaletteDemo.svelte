<script lang="ts">
  // Palette (ui-palette tool_view.rs, artwork.rs, output_preview.rs at 1.2.5): the artwork, or
  // the swatch sheet, on the stage with the colours found in it; the colours, outputs, edges and
  // files in the rail; each file previewable in place of the stage. The CSS, SCSS and tokens
  // text and the ASE size are the app's own exporters (`plan.ts`); the swatch sheet is the app's
  // page (sheets swatch_card.rs) drawn as SVG at its own coordinates.
  import { tick } from 'svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import DemoReadout from './DemoReadout.svelte';
  import DemoToolbar from './DemoToolbar.svelte';
  import DestinationRow from './DestinationRow.svelte';
  import CheckRow from './CheckRow.svelte';
  import EdgeChoice from './EdgeChoice.svelte';
  import Icon from './Icon.svelte';
  import SwatchDot from './SwatchDot.svelte';
  import { css, scss, tokensJSON, aseBytes, hexToOklchString, cmyk, normalizedHex, paletteSize, plural, type PaletteEntry } from './plan';

  interface Entry extends PaletteEntry { id: number; pantone: string }
  // the poster's own colours, which is what the app finds in it
  const FOUND = ['#174c43', '#ff683b', '#f2d600', '#f4f1e7'];
  let nextId = 0;
  const entry = (name: string, hex: string): Entry => ({ id: nextId++, name, hex, pantone: '' });
  let name = $state('Acme');
  let colors = $state<Entry[]>(FOUND.map((hex, i) => entry(`Color ${i + 1}`, hex)));
  let out = $state({ css: true, tokens: true, ase: true, sheet: true });
  let hard = $state(false);
  let sheet = $state(false); // the stage's switch: the artwork, or the swatch sheet
  let preview: string | null = $state(null);
  let openId: number | null = $state(null); // one colour's details at a time
  const MAX = 6; // the rail stays one screen of colours here; the app has no cap
  const token = $derived(name.trim() === '' ? 'Palette' : name.trim().replace(/\s+/g, '_'));
  const title = $derived(name.trim() === '' ? 'Palette' : name);
  const files = $derived.by(() => {
    const list: string[] = [];
    if (out.css) list.push(`${token}.css`, `${token}.scss`);
    if (out.tokens) list.push(`${token}.tokens.json`);
    if (out.ase) list.push(`${token}.ase`);
    if (out.sheet) list.push(`${token}_Swatches.pdf`, `${token}_Swatches.png`);
    return list;
  });
  // the preview is held by kind, not by filename, so renaming keeps it open (output_key)
  const kind = (f: string) => f.slice(token.length);
  const active = $derived(preview && files.some((f) => kind(f) === preview) ? preview : null);
  const activeFile = $derived(active ? token + active : '');
  const text = $derived(active === '.css' ? css(colors) : active === '.scss' ? scss(colors) : active === '.tokens.json' ? tokensJSON(colors) : null);
  const KINDS: Record<string, string> = { '.css': 'CSS custom properties', '.scss': 'SCSS variables', '.tokens.json': 'Design tokens', '.ase': 'Adobe swatch exchange', '_Swatches.pdf': 'Swatch sheet for print', '_Swatches.png': 'Swatch sheet image' };
  const label = (c: Entry, i: number) => c.name || `color ${i + 1}`;
  const has = (hex: string) => colors.some((c) => c.hex === hex);
  const missing = $derived(FOUND.some((hex) => !has(hex)));
  // a new colour's name: Color N for the next place, unless taken, then the lowest free one
  function freeName() { const taken = (n: string) => colors.some((c) => c.name === n); const next = `Color ${colors.length + 1}`; if (!taken(next)) return next; let n = 1; while (taken(`Color ${n}`)) n++; return `Color ${n}`; }
  const add = (hex: string) => { if (!has(hex) && colors.length < MAX) colors.push(entry(freeName(), hex)); };
  const addColor = () => { if (colors.length < MAX) colors.push(entry(freeName(), '#000000')); };
  const setHex = (i: number, v: string) => { const h = normalizedHex(v); if (h) colors[i].hex = h; };
  // the removed row took the focused button with it: focus the next color's hex, or Add color after the last (PX-128)
  async function remove(i: number, e: MouseEvent) {
    const section = (e.currentTarget as HTMLElement).closest('.rail-section');
    if (openId === colors[i].id) openId = null;
    colors.splice(i, 1); await tick();
    (section?.querySelectorAll<HTMLElement>('input.hex')[i] ?? section?.querySelector<HTMLElement>('.start'))?.focus();
  }
  // closing the preview takes its button away: focus goes back to the file it showed
  let rail: HTMLElement | undefined = $state();
  async function close() { const k = active; preview = null; await tick(); rail?.querySelector<HTMLElement>(`[data-kind="${k}"]`)?.focus(); }
  // the sheet's page (swatch_card.rs): 640 wide, a title, then a 128 × 76 chip and its lines per colour
  const page = $derived({ height: 96 + Math.max(colors.length, 1) * 104 + 56 });
  const lines = (c: Entry) => [`HEX ${c.hex.toUpperCase()}`, `OKLCH ${hexToOklchString(c.hex).slice(6, -1)}`, `CMYK ${cmyk(c.hex).map((v) => Math.round(v * 100)).join('-')}`, ...(c.pantone.trim() ? [c.pantone.trim()] : [])];
</script>
{#snippet swatchSheet()}
  <svg class="artboard sheet" class:hard viewBox={`0 0 640 ${page.height}`} shape-rendering={hard ? 'crispEdges' : 'auto'} role="img" aria-label={`Swatch sheet for ${title}`}>
    <rect width="640" height={page.height} fill="#fff" />
    <text x="56" y="74" class="t">{title}</text>
    {#each colors as c, i (c.id)}
      <rect x="56" y={96 + i * 104} width="128" height="76" rx="6" fill={c.hex} stroke="rgba(0,0,0,.12)" stroke-width=".5" />
      <text x="212" y={96 + i * 104 + 16} class="n">{c.name || c.hex}</text>
      {#each lines(c) as line, j (j)}<text x="212" y={96 + i * 104 + 36 + j * 16} class="l">{line}</text>{/each}
    {/each}
  </svg>
{/snippet}
{#snippet stageSwitch()}
  <div class="stage-switch chips lbl" role="group" aria-label="Stage"><button type="button" class="chip" aria-pressed={!sheet} onclick={() => (sheet = false)}>Artwork</button><button type="button" class="chip" aria-pressed={sheet} onclick={() => (sheet = true)}>Swatch sheet</button></div>
{/snippet}
{#snippet addArtwork()}
  <div class="reel-row"><span class="grow"></span><button type="button" class="btn lbl" disabled title="Adding artwork runs in the desktop app"><Icon name="plus" />Add artwork</button></div>
{/snippet}
<DemoReadout route={['Palette']} />
<div class="split">
  {#if active}
    <div class="stage">
      <div class="preview-head"><span class="body nowrap">{activeFile}</span><span class="lbl dim nowrap">{KINDS[active]}</span><span class="grow"></span><button type="button" class="btn-icon" title="Close preview" aria-label="Close preview" onclick={close}><Icon name="xmark" /></button></div>
      <div class="mat preview">
        {#if text !== null}
          <pre class="body">{text}</pre>
        {:else if active === '.ase'}
          <div class="ase"><span class="lbl dim">{plural(colors.length, 'color')} · {paletteSize(aseBytes(colors))}</span><div class="ase-swatches">{#each colors as c (c.id)}<div class="ase-swatch"><SwatchDot hex={c.hex} size={96} /><span class="body nowrap">{c.name}</span><span class="lbl dim">{c.hex.toUpperCase()}</span></div>{/each}</div></div>
        {:else}
          <div class="sheet-scroll">{@render swatchSheet()}</div>
        {/if}
      </div>
    </div>
  {:else if sheet}
    <div class="stage sheet-stage">
      {@render stageSwitch()}
      <div class="mat">{@render swatchSheet()}</div>
      {@render addArtwork()}
    </div>
  {:else}
    <div class="stage">
      {@render stageSwitch()}
      <div class="mat art">
        <div class="viewport">
          <div class="poster" role="img" aria-label="Example artwork: a poster in green, orange, yellow and cream"><i style="left:12%;top:8%;width:30%;height:30%;background:#174c43"></i><i style="left:42%;top:8%;width:46%;height:46%;background:#ff683b"></i><i style="left:12%;top:38%;width:30%;height:16%;background:#ff683b"></i><i style="left:12%;top:62%;width:24%;height:22%;background:#f2d600"></i><i style="left:64%;top:62%;width:24%;height:22%;background:#174c43"></i><span class="body">less noise.</span></div>
        </div>
        <div class="found-row">
          <span class="lbl dim">Found</span>
          <span class="found">{#each FOUND as hex (hex)}<button type="button" class="btn-icon" title={`Add ${hex.toUpperCase()}`} aria-label={`Add ${hex.toUpperCase()}`} onclick={() => add(hex)}><SwatchDot {hex} size={16} /></button>{/each}</span>
          {#if missing}<button type="button" class="btn lbl" disabled={colors.length >= MAX} onclick={() => FOUND.forEach(add)}><Icon name="plus" />Add all</button>{/if}
        </div>
      </div>
      {@render addArtwork()}
    </div>
  {/if}
  <div class="rail" bind:this={rail}>
    <section class="rail-section">
      <div class="rail-head lbl dim"><span>Palette</span></div>
      <input class="field-plain body" placeholder="Name" aria-label="Palette name" bind:value={name} maxlength="24" />
    </section>
    <section class="rail-section">
      <div class="rail-head lbl dim"><span>Colors</span><span>{colors.length}</span></div>
      {#each colors as c, i (c.id)}
        {@const open = openId === c.id}
        <div class="reveal-scope">
          <div class="color-row">
            <input type="color" class="color-well" value={c.hex} aria-label={`Pick ${label(c, i)}`} onchange={(e) => setHex(i, e.currentTarget.value)} />
            <input class="field body hex" aria-label={`Hex for ${label(c, i)}`} value={c.hex.toUpperCase()} onchange={(e) => { setHex(i, e.currentTarget.value); e.currentTarget.value = colors[i].hex.toUpperCase(); }} />
            <input class="field-plain body name" placeholder="Name" aria-label={`Name for ${label(c, i)}`} bind:value={c.name} maxlength="16" />
            {#if !open && c.pantone.trim()}<span class="lbl dim nowrap pms" title={`Pantone ${c.pantone}`}>{c.pantone}</span>{/if}
            <button type="button" class="btn-icon reveal-item" title="Remove color" aria-label={`Remove ${label(c, i)}`} onclick={(e) => remove(i, e)}><Icon name="xmark" /></button>
            <button type="button" class="btn-icon" class:dim={!open} title="Details" aria-expanded={open} aria-label={`${open ? 'Hide' : 'Show'} OKLCH, CMYK and Pantone for ${label(c, i)}`} onclick={() => (openId = open ? null : c.id)}><Icon name={open ? 'chevronUp' : 'chevronDown'} /></button>
          </div>
          {#if open}
            <div class="details">
              <input class="field body" readonly aria-label={`OKLCH for ${label(c, i)}`} value={hexToOklchString(c.hex)} />
              <div class="cmyk">{#each cmyk(c.hex) as v, k (k)}<label><span class="lbl dim">{'CMYK'[k]}</span><input class="field body" readonly inputmode="numeric" aria-label={`${'CMYK'[k]} percent`} value={Math.round(v * 100)} /></label>{/each}</div>
              <input class="field body" placeholder="Pantone (optional)" aria-label={`Pantone for ${label(c, i)}`} bind:value={c.pantone} maxlength="24" />
            </div>
          {/if}
        </div>
      {/each}
      {#if colors.length < MAX}<div class="add"><button type="button" class="btn lbl start" onclick={addColor}><Icon name="plus" />Add color</button></div>{/if}
    </section>
    <section class="rail-section">
      <div class="rail-head lbl dim"><span>Outputs</span></div>
      <CheckRow name="CSS / SCSS" on={out.css} onchange={(v) => (out.css = v)}><span>CSS / SCSS</span><span class="grow"></span><span class="dim">variables</span></CheckRow>
      <CheckRow name="Tokens" on={out.tokens} onchange={(v) => (out.tokens = v)}><span>Tokens</span><span class="grow"></span><span class="dim">JSON</span></CheckRow>
      <CheckRow name="ASE" on={out.ase} onchange={(v) => (out.ase = v)}><span>ASE</span><span class="grow"></span><span class="dim">Adobe swatches</span></CheckRow>
      <CheckRow name="Swatch sheet" on={out.sheet} onchange={(v) => (out.sheet = v)}><span>Swatch sheet</span><span class="grow"></span><span class="dim">PDF / PNG</span></CheckRow>
    </section>
    {#if out.sheet}<EdgeChoice {hard} onchange={(v) => (hard = v)} note="Applies to the swatch sheet." />{/if}
    {#if files.length}
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Files</span><span>{files.length}</span></div>
        {#each files as f (f)}<button type="button" class="file-row" data-kind={kind(f)} title={`Preview ${f}`} aria-pressed={active === kind(f)} onclick={() => (preview = active === kind(f) ? null : kind(f))}><span class="body name">{#each f.split('_') as part, j (j)}{#if j}_<wbr />{/if}{part}{/each}</span><span class="go"><Arrow /></span></button>{/each}
      </section>
    {/if}
    <DestinationRow />
  </div>
</div>
<DemoToolbar status="Exports run in the desktop app." />
<style>
/* the artwork on the stage (artwork.rs): the picture on the ground in the mat, the colours found
   in it along the mat's foot */
.art{flex:1;display:flex;flex-direction:column;gap:var(--s2);min-height:0}
.viewport{flex:1;display:flex;align-items:center;justify-content:center;padding:var(--s2);background:var(--paper);min-height:352px}
.poster{position:relative;width:240px;height:320px;overflow:hidden;background:#f4f1e7}.poster i{position:absolute;display:block}.poster span{position:absolute;left:var(--s3);bottom:var(--s2);color:#174c43}
.found{display:flex;flex-wrap:wrap;gap:var(--s1)}
/* the sheet (swatch_card.rs): Helvetica on white; Hard edges draw it without smoothing */
.sheet{display:block;width:100%;height:auto;font-family:var(--face-sheet);-webkit-font-smoothing:auto}
.sheet.hard{-webkit-font-smoothing:none;text-rendering:optimizeSpeed}
.sheet .t{font-size:20px;font-weight:700;fill:rgb(18 18 18)}.sheet .n{font-size:13px;font-weight:700;fill:rgb(18 18 18)}.sheet .l{font-size:11px;fill:rgb(115 115 115)}
/* a file in place of the stage (output_preview.rs) */
.preview-head{display:flex;align-items:center;gap:var(--s2);min-width:0}
.preview{flex:1;display:flex;min-height:352px;overflow:hidden}
.preview pre{flex:1;padding:var(--s2);background:var(--paper);overflow:auto}
.ase{flex:1;display:flex;flex-direction:column;gap:var(--s2);padding:var(--s2);background:var(--paper);overflow:auto}
.ase-swatches{display:flex;flex-wrap:wrap;gap:var(--s2)}.ase-swatch{display:flex;flex-direction:column;gap:var(--s1);width:96px}
.sheet-scroll{flex:1;display:flex;overflow:auto}.sheet-scroll .sheet{margin:auto;max-width:100%}
/* a colour (ui-kit color_row.rs): well, hex, name, then its tools; the details indent a cell */
.color-row{display:flex;align-items:center;gap:var(--s1);min-height:var(--s4)}
.color-row .hex{width:120px;flex:none}.color-row .name{flex:1;min-width:0}.pms{max-width:80px}
.details{display:flex;flex-direction:column;gap:var(--s1);padding:0 0 var(--s1) var(--s4)}
.cmyk{display:flex;gap:var(--s1);align-items:center}.cmyk label{display:flex;align-items:center;gap:var(--s1);flex:1;min-width:0}.cmyk input{text-align:right}
.add{padding-top:var(--s1);align-self:flex-start}
@media(max-width:700px){.viewport,.preview{min-height:0}.poster{width:192px;height:256px}.preview pre{white-space:pre-wrap;overflow-wrap:anywhere}} /* the CSS wraps, not clipped at oklch(37 (0206) */
/* on the smallest phones the name takes its own line under the hex, so neither is cut to a sliver */
@media(max-width:420px){.color-row{flex-wrap:wrap}.color-row .name{order:9;flex:1 0 calc(100% - var(--s4));margin-left:var(--s4)}.color-row .hex{flex:1;width:auto;min-width:0}}
</style>
