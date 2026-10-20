<script lang="ts">
  import { below } from '$lib/tokens';
  import { pad } from '$lib/format';
  import DemoReadout from './DemoReadout.svelte';
  import DemoToolbar from './DemoToolbar.svelte';
  import DestinationRow from './DestinationRow.svelte';
  // Specimen: the sheet on the left, the template and the styles in the rail. The app
  // draws its sheet on a canvas from installed fonts; here the sheet is HTML set in the
  // four faces the site loads, each role at a size from the cell table so it is crisp.
  type Face = { id: string; label: string; family: string; caps?: boolean; sizes: [string, string, string] };
  // the ladder per face: xl / l / m, all whole cells (Jacquard 43/em, Jersey 27, PARC Bold 13.75, Press Start 8)
  const faces: Face[] = [
    { id: 'jacquard', label: 'Jacquard 24', family: 'var(--face-blackletter)', sizes: ['129px/136px', '86px/88px', '43px/48px'] },
    { id: 'jersey', label: 'Jersey 15', family: 'var(--face-text)', sizes: ['108px/112px', '54px/56px', '27px/32px'] },
    { id: 'parc', label: 'PARC Pixel Bold', family: 'var(--face-display)', caps: true, sizes: ['82.5px/88px', '41.25px/48px', '27.5px/32px'] },
    { id: 'press', label: 'Press Start 2P', family: 'var(--face-mono)', sizes: ['64px/64px', '32px/40px', '16px/24px'] }
  ];
  const byId = (id: string) => faces.find((f) => f.id === id) ?? faces[0];
  let template: 'brand' | 'classic' = $state('brand');
  let title = $state('Typography');
  let sample = $state('Make something good.');
  let roles = $state([{ label: 'Display', face: 'jacquard', step: 1 }, { label: 'Heading', face: 'parc', step: 2 }, { label: 'Body', face: 'jersey', step: 2 }]);
  let classic = $state('jacquard');
  // below 420 every sample takes the next size down and the classic sheet shows its smallest
  // sample only: at 86 and 129px a sample broke mid-word and the sheet ran three screens (0206)
  let narrow = $state(false);
  $effect(() => { const m = matchMedia(below('xs')); const set = () => (narrow = m.matches); set(); m.addEventListener('change', set); return () => m.removeEventListener('change', set); });
  const at = (step: number) => Math.min(2, step + (narrow ? 1 : 0));
  const px = (f: Face, step: number) => f.sizes[at(step)].split('/')[0];
  const line = $derived(sample.trim() === '' ? 'The quick brown fox jumps over the lazy dog' : sample);
</script>
<DemoReadout path="Specimen" count={template === 'brand' ? `${roles.length} styles` : byId(classic).label} />
<div class="split">
  <div class="stage">
    <div class="mat"><div class="artboard plate-light sheet">
      {#if template === 'brand'}
        <b class="title">{title || 'Typography'}</b>
        {#each roles as r (r.label)}{@const f = byId(r.face)}
          <div class="role"><span class="meta">{r.label.toUpperCase()}  ·  {f.label}  ·  {px(f, r.step)}</span><p style:font={`${f.sizes[at(r.step)]} ${f.family}`} style:text-transform={f.caps ? 'uppercase' : 'none'}>{line}</p></div>
        {/each}
      {:else}{@const f = byId(classic)}
        <b class="title">{f.label}</b>
        <div class="role"><span class="meta">CHARACTERS</span><p style:font={`${f.sizes[2]} ${f.family}`} style:text-transform={f.caps ? 'uppercase' : 'none'}>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 .,;:!?&amp;@#%()[]</p></div>
        <div class="role"><span class="meta">SIZES</span>{#each narrow ? [2] : [2, 1, 0] as step (step)}<p style:font={`${f.sizes[step]} ${f.family}`} style:text-transform={f.caps ? 'uppercase' : 'none'}>{line}</p>{/each}</div>
      {/if}
    </div></div>
  </div>
  <div class="rail">
    <section class="rail-section tight">
      <div class="rail-head lbl dim"><span>Template</span></div>
      <div class="chips fill lbl" role="group" aria-label="Template"><button type="button" class="chip" aria-pressed={template === 'brand'} onclick={() => (template = 'brand')}>Brand sheet</button><button type="button" class="chip" aria-pressed={template === 'classic'} onclick={() => (template = 'classic')}>Specimen</button></div>
      {#if template === 'brand'}<input class="field-plain body" placeholder="Title" aria-label="Sheet title" bind:value={title} maxlength="24" />{/if}
      <input class="field body" placeholder="Sample line" aria-label="Sample line" bind:value={sample} maxlength="48" />
    </section>
    {#if template === 'brand'}
      <section class="rail-section tight">
        <div class="rail-head lbl dim"><span>Styles</span><span>{pad(roles.length)}</span></div>
        {#each roles as r (r.label)}
          <div class="style-row">
            <span class="body">{r.label}</span><span class="lbl dim">{px(byId(r.face), r.step)}</span>
            <span class="select"><select class="field body" aria-label={`${r.label} typeface`} bind:value={r.face}>{#each faces as f (f.id)}<option value={f.id}>{f.label}</option>{/each}</select></span>
            <span class="chips lbl" role="group" aria-label={`${r.label} size`}>{#each ['L', 'M', 'S'] as s, i (s)}<button type="button" class="chip" aria-pressed={r.step === i} onclick={() => (r.step = i)}>{s}</button>{/each}</span>
          </div>
        {/each}
      </section>
    {:else}
      <section class="rail-section tight">
        <div class="rail-head lbl dim"><span>Family</span></div>
        <span class="select"><select class="field body" aria-label="Family" bind:value={classic}>{#each faces as f (f.id)}<option value={f.id}>{f.label}</option>{/each}</select></span>
      </section>
    {/if}
    <DestinationRow />
  </div>
</div>
<DemoToolbar><span class="dim">2 files</span></DemoToolbar>
<style>
/* the sheet: a white page; its labels are the app's Helvetica, the samples the chosen face */
.sheet{width:100%;min-height:352px;padding:var(--s3);display:flex;flex-direction:column;gap:var(--s3);color:#121212}
.title{font:700 20px/24px var(--face-sheet);-webkit-font-smoothing:auto}
.role{display:flex;flex-direction:column;gap:var(--s1)}.role p{margin:0;overflow-wrap:break-word}
.meta{font:400 9px/16px var(--face-sheet);letter-spacing:1.2px;color:#737373;-webkit-font-smoothing:auto;white-space:pre}
.style-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:var(--s1) var(--s2);align-items:center;padding:var(--s1) 0}
.style-row .select{grid-column:1}.style-row .chips{grid-column:2;flex-wrap:nowrap}
@media(max-width:700px){.sheet{padding:var(--s2);min-height:0}}
</style>
