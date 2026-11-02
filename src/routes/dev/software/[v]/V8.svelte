<script lang="ts">
  // 8. Strips: every product gets a full-bleed head like a case study's, its name knocked out of
  // its own scene, with its facts in a short row under it. The page reads as a stack of studies.
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { items, meta, LEAD } from './lab';
  import { sceneGrain } from '$lib/tokens';
  import { theme } from '$lib/motion.svelte';
  import { hasStudyScene } from '$lib/studyScenes';
</script>
<main id="main" tabindex="-1">
  <Band class="top" mode="scene" shot="rise" seed={5} avoid=".top h1 > span" clear=".top .lead">
    <h1><span class="blackletter display-xl"><Decode text="software." /></span></h1>
    <p class="lead">{LEAD}</p>
  </Band>
  {#each items as p, i (p.slug)}
    <Band as="section" class="head" mode="scene" shot="strip" sceneSpan="box" mountains={hasStudyScene(p.slug) ? '' : 'a'} study={hasStudyScene(p.slug) ? p.slug : ''} seed={30 + i} feather={8 / sceneGrain(theme.light)} avoid=".head .nm > span">
      <a class="nm" href={p.href}><span class="blackletter">{p.slug}.</span></a>
    </Band>
    <section class="row"><p class="lbl dim">{meta(p)}</p><p class="body">{p.line}</p><div class="links">{#each p.links as l (l.href)}<QuietLink href={l.href} label={l.label} />{/each}</div></section>
  {/each}
</main>
<style>
main :global(.top){padding:var(--s8) var(--gutter);min-height:420px;display:flex;flex-direction:column;justify-content:flex-end;gap:var(--s3)}
main :global(.head){height:320px;display:flex;align-items:flex-end;padding:0 var(--gutter) var(--s3)}
.nm{color:inherit}.nm span{font-size:172px;line-height:176px}
@media(hover:hover){.nm:hover{color:var(--accent-text)}}
.row{display:grid;grid-template-columns:1fr 2fr 1fr;gap:var(--s4);padding-top:var(--s3);padding-bottom:var(--s6);align-items:baseline}
.row p{margin:0}
.links{display:flex;flex-direction:column;gap:var(--s1)}
@media(max-width:1100px){.nm span{font-size:129px;line-height:136px}}
@media(max-width:900px){.row{grid-template-columns:1fr}main :global(.head){height:220px}}
@media(max-width:700px){.nm span{font-size:86px;line-height:88px}}
</style>
