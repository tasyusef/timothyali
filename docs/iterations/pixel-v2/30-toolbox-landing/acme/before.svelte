<script lang="ts">
  import AppToggle from './AppToggle.svelte';
  import PlateToggle from './PlateToggle.svelte';
  import SwatchDot from './SwatchDot.svelte';
  let { tool = 'lockup' }: { tool: string } = $props();
  let dark = $state(false);
  let mono = $state(false);
  let palette = $state(0);
  let family = $state('Jacquard 24');
  let sample = $state('Make something good.');
  let format = $state('webp');
  let compact = $state(true);
  const palettes = [
    { name: 'Signal', colors: ['#F2D600', '#11110E', '#F4F4F0'] },
    { name: 'Studio', colors: ['#FF683B', '#342A67', '#F7E8D4'] },
    { name: 'Field', colors: ['#BBDD96', '#174C43', '#F4F1E7'] }
  ];
  const chosen = $derived(palettes[palette]);
  const css = $derived(`:root {\n${chosen.colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`);
</script>
<div class="demo" aria-label={`${tool} interactive example`}>
  <div class="demo-bar lbl"><span>Example / {tool}</span><span class="live">Live preview</span></div>
  {#if tool === 'lockup'}
    <div class="stage logo-stage" class:dark style:color={mono ? (dark ? '#f4f4f0' : '#11110e') : (dark ? '#f2d600' : '#174c43')}>
      <div class="logo" aria-label="Example logo: Acorn"><svg viewBox="0 0 96 96" aria-hidden="true"><path fill="currentColor" d="M48 8c-8 0-12 8-12 16H20v16h-8v8h72v-8h-8V24H52c0-4 0-8 4-8V8zM20 56v8c0 16 12 24 28 32 16-8 28-16 28-32v-8z"/></svg><span>acorn.</span></div>
      <span class="lbl art-note">One mark. Every treatment.</span>
    </div>
    <div class="options"><PlateToggle {dark} onchange={v => dark = v} /><AppToggle on={mono} onchange={v => mono = v}>Black & white</AppToggle></div>
    <div class="output lbl"><span>Acorn / {mono ? 'Mono' : 'Color'}</span><span>SVG · PNG · PDF</span></div>
  {:else if tool === 'palette'}
    <div class="stage palette-stage">
      <div class="swatches">{#each chosen.colors as hex}<div style:background={hex}><span class="lbl" style:color={hex === '#11110E' || hex === '#342A67' || hex === '#174C43' ? '#fff' : '#11110e'}>{hex}</span></div>{/each}</div>
      <pre class="body">{css}</pre>
    </div>
    <div class="options presets" role="group" aria-label="Example palette">{#each palettes as p, i}<button type="button" class="lbl preset" aria-pressed={palette === i} onclick={() => palette = i}><SwatchDot hex={p.colors[0]} />{p.name}</button>{/each}</div>
    <div class="output lbl"><span>{chosen.name} / colors.css</span><span>03 colors</span></div>
  {:else if tool === 'specimen'}
    <div class="stage specimen-stage" style:font-family={`'${family}', serif`}>
      <div class="specimen-letter" aria-hidden="true">Aa</div><p class="specimen-copy">{sample || 'Make something good.'}</p><p class="alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789</p>
    </div>
    <div class="options specimen-options"><label class="lbl">Typeface<select bind:value={family}><option>Jacquard 24</option><option>Jersey 15</option></select></label><label class="lbl">Your line<input bind:value={sample} maxlength="24" /></label></div>
    <div class="output lbl"><span>Type specimen</span><span>PDF · PNG</span></div>
  {:else}
    <div class="stage convert-stage">
      <div class="poster" class:compact><div class="poster-orbit" aria-hidden="true"></div><span class="poster-type">Less.<br />But better.</span><span class="lbl">Example artwork / 01</span></div>
      <div class="dimensions lbl">{compact ? '800 × 1000' : '1600 × 2000'}<br />{format.toUpperCase()}</div>
    </div>
    <div class="options"><div role="group" aria-label="Output format" class="formats">{#each ['webp', 'png', 'jpeg'] as f}<button type="button" class="lbl preset" aria-pressed={format === f} onclick={() => format = f}>{f}</button>{/each}</div><AppToggle on={compact} onchange={v => compact = v}>Half size</AppToggle></div>
    <div class="output lbl"><span>poster.{format}</span><span>Resize preview</span></div>
  {/if}
</div>
<style>
/* Presentation components copied from Toolbox's ui/; scoped adaptations here
   keep the app's controls isolated from the website's global row/card classes. */
.demo{background:var(--paper);color:var(--fg);min-width:0}
.demo-bar,.output{display:flex;justify-content:space-between;gap:var(--s2);padding:var(--s2) var(--s3);flex-wrap:wrap}
.demo-bar{background:var(--fg);color:var(--paper)}.live::before{content:'■';margin-right:var(--s1)}
.stage{height:352px;overflow:hidden;position:relative;background:#f4f4f0;color:#11110e}
.logo-stage{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:var(--s4)}.logo-stage.dark{background:#11110e}
.logo{width:400px;transform:translateY(-4px);display:flex;align-items:center;gap:var(--s3)}.logo svg{width:112px;height:112px;transform:translateY(-4px)}.logo span{font:129px/136px var(--face-blackletter)}
.art-note{position:absolute;bottom:var(--s3);max-width:100%;padding:0 var(--s2);text-align:center}
.options{padding:var(--s2) var(--s3);display:flex;gap:var(--s3);align-items:center;min-height:80px;flex-wrap:wrap}
.options :global(.switch){display:flex;align-items:center;gap:var(--s2);min-height:48px;cursor:pointer;margin-left:auto}
.options :global(.switch .row){display:flex;align-items:center;gap:var(--s1)}
.options :global(.state){color:var(--accent-text)}
.options :global(.switch input:focus-visible~.state){outline:2px solid var(--fg);outline-offset:4px}
.options :global(.swatch-chip){width:32px;height:32px;outline:2px solid var(--fg);outline-offset:0;flex:none}
.options :global(.swatch-chip.on){outline-offset:4px}
.options :global(.swatch-chip:focus-visible){outline:4px solid var(--accent-text);outline-offset:4px}
.options :global(.plate-light){background:#f4f4f0}.options :global(.plate-dark){background:#11110e}
.options :global(.swatch){display:inline-block;flex:none}
.output{background:var(--surface-card);min-height:48px}
.swatches{height:128px;display:grid;grid-template-columns:repeat(2,round(down,calc(100% / 3),8px)) minmax(0,1fr)}.swatches>div{display:flex;align-items:flex-end;padding:var(--s2)}
.palette-stage pre{margin:0;padding:var(--s3);white-space:pre-wrap;font-size:27px;line-height:32px}
.preset{padding:var(--s2);display:inline-flex;align-items:center;gap:var(--s1);min-height:48px}.preset[aria-pressed=true]{background:var(--accent);color:var(--on-accent)}.preset:hover{background:var(--fg);color:var(--paper)}
.presets{gap:var(--s1)}.formats{display:flex}
.specimen-stage{padding:var(--s3) var(--s4)}.specimen-letter{font-size:129px;line-height:136px}.specimen-copy{font-size:43px;line-height:48px;overflow-wrap:anywhere}.alphabet{font-family:var(--face-text);font-size:27px;line-height:32px;margin-top:var(--s2)}
.specimen-stage[style*="Jersey"] .specimen-letter{font-size:108px}.specimen-stage[style*="Jersey"] .specimen-copy{font-size:54px;line-height:56px}
.specimen-options{align-items:start}.specimen-options label{display:flex;flex-direction:column;gap:var(--s1);flex:1;min-width:0}
select,input{font:27px/32px var(--face-text);background:var(--paper);color:var(--fg);border:0;border-bottom:2px solid var(--fg);border-radius:0;padding:var(--s1);min-width:0;width:100%;height:48px}
.convert-stage{display:flex;justify-content:center;align-items:center;background:#e8e6dd;gap:var(--s4)}
.poster{position:relative;width:224px;height:280px;background:#342a67;color:#f7e8d4;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:var(--s2)}
.poster.compact{width:192px;height:240px}.poster-type{font:54px/48px var(--face-text);position:relative;background:#342a67;width:fit-content}.poster>.lbl{position:relative;margin-top:var(--s2);font-size:12.5px}
.poster-orbit{position:absolute;width:224px;height:224px;background:#ff683b;border-radius:50%;top:-80px;right:-64px;box-shadow:-40px 40px 0 #bbdd96}
.dimensions{line-height:32px}
@media(max-width:700px){.stage{height:320px}.options{padding:var(--s2);gap:var(--s2)}.demo-bar,.output{padding:var(--s2)}.logo{width:256px;gap:var(--s2)}.logo svg{width:64px;height:64px}.logo span{font-size:86px;line-height:88px}.options :global(.switch){margin-left:0;width:100%;justify-content:space-between}.specimen-options{flex-direction:column}.specimen-options label{width:100%}.swatches>div{padding:var(--s1)}.specimen-stage{padding:var(--s2)}.specimen-copy{font-size:43px;line-height:48px}.alphabet{display:none}.specimen-stage[style*="Jersey"] .alphabet{font-family:var(--face-text);font-size:27px;line-height:32px}.specimen-stage[style*="Jersey"] .specimen-copy{font-size:27px;line-height:32px}.convert-stage{gap:var(--s2)}.poster{width:160px;height:200px}.poster.compact{width:128px;height:160px}.poster-type{font-size:27px;line-height:32px}.poster>.lbl{display:none}.dimensions{font-size:12.5px;line-height:24px}}
</style>
