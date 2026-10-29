<script lang="ts">
  // Specimen (ui-specimen view.rs, sheets type_sheet.rs at 1.2.5): the sheet on the stage; the
  // template, the styles (a role, its size in points, its family and style) and the edges in
  // the rail. The app draws the sheet on a canvas from installed fonts; here it is HTML in the
  // faces the site loads, laid out by the app's blocks: the title, then per role a label line
  // and the sample. A point is a pixel, as on the app's page; on a narrow stage the samples
  // take half or a quarter of their size, the labels keep theirs.
  import { tick } from 'svelte';
  import DemoReadout from './DemoReadout.svelte';
  import DemoToolbar from './DemoToolbar.svelte';
  import DestinationRow from './DestinationRow.svelte';
  import EdgeChoice from './EdgeChoice.svelte';
  import Icon from './Icon.svelte';

  // the families the site has, each style its face (PARC Pixel is capitals only)
  const FAMILIES: Record<string, Record<string, string>> = {
    'Jacquard 24': { Regular: 'var(--face-blackletter)' },
    'Jersey 15': { Regular: 'var(--face-text)' },
    'PARC Pixel': { Regular: 'var(--face-label)', Bold: 'var(--face-display)' },
    'Press Start 2P': { Regular: 'var(--face-mono)' }
  };
  const families = Object.keys(FAMILIES);
  const styles = (family: string) => Object.keys(FAMILIES[family] ?? {});
  const face = (family: string, style: string) => FAMILIES[family]?.[style] ?? 'var(--face-text)';
  const caps = (family: string) => family === 'PARC Pixel';
  interface Role { id: number; label: string; family: string; style: string; size: number }
  let nextId = 0;
  const role = (label: string, family: string, style: string, size: number): Role => ({ id: nextId++, label, family, style, size });
  let template: 'brand' | 'classic' = $state('brand');
  let title = $state('Typography');
  let sample = $state('Make something good.');
  // the app's three roles (40, 22, 13 pt in Helvetica), at the nearest sizes each face draws whole
  // pixels at (Jacquard 43n, PARC Bold 13.75n, Jersey 27n)
  let roles = $state<Role[]>([role('Display', 'Jacquard 24', 'Regular', 43), role('Heading', 'PARC Pixel', 'Bold', 27.5), role('Body', 'Jersey 15', 'Regular', 27)]);
  let classic = $state('Jacquard 24');
  let hard = $state(false);
  let width = $state(0), inner = $state(0);
  const s = $derived(width >= 400 ? 1 : width >= 200 ? 0.5 : 0.25);
  const px = (n: number) => `${n * s}px`;
  const lh = (n: number) => `${Math.round(n * s * 1.15)}px`;
  // a new family keeps the style it has when it can, else its Regular (snap_face)
  const setFamily = (r: Role, family: string) => { r.family = family; if (!styles(family).includes(r.style)) r.style = styles(family).includes('Regular') ? 'Regular' : styles(family)[0]; };
  const setSize = (r: Role, v: string) => { const n = Number(v); if (v.trim() !== '' && Number.isFinite(n) && n > 0) r.size = Math.min(n, 400); };
  // add_role: Style N, in the last style's face, at 16
  function addRole() { const last = roles.at(-1); roles.push(role(`Style ${roles.length + 1}`, last?.family ?? 'Jersey 15', last?.style ?? 'Regular', 16)); }
  // the removed row took the focused button with it: focus the next style's name, or Add style (PX-128)
  async function remove(i: number, e: MouseEvent) {
    const section = (e.currentTarget as HTMLElement).closest('.rail-section');
    roles.splice(i, 1); await tick();
    (section?.querySelectorAll<HTMLElement>('input.role')[i] ?? section?.querySelector<HTMLElement>('.start'))?.focus();
  }
  const SIZES = [9, 12, 18, 24, 36, 48];
</script>
<DemoReadout route={['Specimen']} />
<div class="split">
  <div class="stage specimen-stage">
    <div class="mat sheet-mat"><div class="artboard plate-light sheet" class:hard bind:clientWidth={width} style:--k={s} style:height={inner ? `${Math.ceil(inner / 8) * 8}px` : undefined}><div class="sheet-in" bind:offsetHeight={inner}>
      {#if template === 'brand'}
        <b class="title">{title}</b>
        {#each roles as r (r.id)}
          <span class="meta">{r.label.toUpperCase()}  ·  {r.family} {r.style}  ·  {Math.round(r.size)}PT</span>
          <p class="sample" style:font-family={face(r.family, r.style)} style:font-size={px(r.size)} style:line-height={lh(r.size)} class:caps={caps(r.family)}>{sample}</p>
        {/each}
      {:else}
        {@const primary = styles(classic)[0]}
        <b class="title">{classic}</b>
        <span class="meta">CHARACTERS</span>
        <p class="sample" style:font-family={face(classic, primary)} style:font-size={px(18)} style:line-height={lh(18)} class:caps={caps(classic)}>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789  .,;:!?&amp;@#%()[]–—</p>
        {#if styles(classic).length > 1}
          <span class="meta">WEIGHTS</span>
          <div class="weights">{#each styles(classic) as st (st)}<p class="sample" style:font-family={face(classic, st)} style:font-size={px(16)} style:line-height={lh(16)} class:caps={caps(classic)}>{st}</p>{/each}</div>
        {/if}
        <span class="meta">SIZES</span>
        <div class="ladder">{#each SIZES as n (n)}<p class="sample" style:font-family={face(classic, primary)} style:font-size={px(n)} style:line-height={lh(n)} class:caps={caps(classic)}>{n}  Aa Bb Cc 0123</p>{/each}</div>
      {/if}
    </div></div></div>
  </div>
  <div class="rail">
    <section class="rail-section tight">
      <div class="rail-head lbl dim"><span>Template</span></div>
      <div class="chips fill lbl" role="group" aria-label="Template"><button type="button" class="chip" aria-pressed={template === 'brand'} onclick={() => (template = 'brand')}>Brand sheet</button><button type="button" class="chip" aria-pressed={template === 'classic'} onclick={() => (template = 'classic')}>Specimen</button></div>
      {#if template === 'brand'}
        <input class="field-plain body title-field" placeholder="Title" aria-label="Sheet title" bind:value={title} maxlength="24" />
        <input class="field body" placeholder="Sample text" aria-label="Sample text" bind:value={sample} maxlength="48" />
      {:else}
        <span class="select title-field"><select class="field body" aria-label="Font family" bind:value={classic}>{#each families as f (f)}<option value={f}>{f}</option>{/each}</select></span>
      {/if}
    </section>
    {#if template === 'brand'}
      <section class="rail-section styles">
        <div class="rail-head lbl dim"><span>Styles</span><span>{roles.length}</span></div>
        {#each roles as r, i (r.id)}
          <div class="reveal-scope role-block">
            <div class="style-row">
              <input class="field-plain body role" placeholder="Role" aria-label="Style role" bind:value={r.label} maxlength="16" />
              <button type="button" class="btn-icon reveal-item" title="Remove style" aria-label={`Remove ${r.label}`} onclick={(e) => remove(i, e)}><Icon name="xmark" /></button>
              <input class="field body size" inputmode="decimal" aria-label="Size in points" value={r.size} oninput={(e) => setSize(r, e.currentTarget.value)} onchange={(e) => (e.currentTarget.value = String(r.size))} />
              <span class="lbl dim unit">pt</span>
            </div>
            <div class="face-row">
              <span class="select"><select class="field body" aria-label="Font family" value={r.family} onchange={(e) => setFamily(r, e.currentTarget.value)}>{#each families as f (f)}<option value={f}>{f}</option>{/each}</select></span>
              <span class="select"><select class="field body" aria-label="Font style" bind:value={r.style}>{#each styles(r.family) as st (st)}<option value={st}>{st}</option>{/each}</select></span>
            </div>
          </div>
        {/each}
        <div class="add"><button type="button" class="btn lbl start" onclick={addRole}><Icon name="plus" />Add style</button></div>
      </section>
    {/if}
    <EdgeChoice {hard} onchange={(v) => (hard = v)} fill />
    <DestinationRow><span class="lbl dim">PDF / PNG</span></DestinationRow>
  </div>
</div>
<DemoToolbar status="Exports run in the desktop app." />
<style>
/* the sheet (type_sheet.rs): a white page; the title and the labels in the app's Helvetica, the
   samples in the chosen face; the margin and gaps are the app's (56 on its 640 page, so 40 on
   this narrower one; 40 after the title, 36 after a sample) at the samples' scale. Hard edges draw it all without smoothing. */
.specimen-stage{align-items:center}
.sheet-mat{width:100%;max-width:672px}
.sheet{width:100%;min-height:352px;color:#121212;-webkit-font-smoothing:antialiased}
.sheet-in{padding:max(var(--s2),calc(40px * var(--k)));display:flex;flex-direction:column;align-items:flex-start} /* the page grows by 8s, so the rail under it stays on the unit */
.sheet.hard{-webkit-font-smoothing:none}
.title{font:700 20px/24px var(--face-sheet);margin-bottom:max(var(--s2),calc(40px * var(--k)))}
.meta{font:400 9px/12px var(--face-sheet);letter-spacing:1.2px;color:#737373;white-space:pre-wrap;margin-bottom:var(--s1)}
.sample{margin:0 0 calc(36px * var(--k));max-width:100%;overflow-wrap:break-word}
.weights .sample{margin-bottom:calc(8px * var(--k))}.weights{margin-bottom:calc(28px * var(--k))}
.ladder .sample{margin-bottom:calc(12px * var(--k))}
.caps{text-transform:uppercase}
.title-field{margin-top:var(--s1)}
/* a style (view.rs RoleRow): its role, the size in points, then its family and style */
.styles{gap:var(--s2)}
.role-block{display:flex;flex-direction:column;gap:var(--s1)}
.style-row{display:flex;align-items:center;gap:var(--s1)}.style-row .role{flex:1;min-width:0}
.style-row .size{width:64px;flex:none;text-align:right}.unit{width:24px;text-align:right;flex:none}
.face-row{display:flex;gap:var(--s1)}.face-row .select{flex:1}
.add{align-self:flex-start}
@media(max-width:700px){.sheet{min-height:0}}
</style>
