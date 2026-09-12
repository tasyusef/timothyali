<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import Code from '$lib/components/Code.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import Options from '$lib/components/toolbox/Options.svelte';
  import { last } from '$lib/toolbox';
  import { STEP } from '$lib/tokens';
  let { data } = $props();
  const t = $derived(data.tool);
  const next = $derived(data.next);
</script>
<svelte:head><title>{t.name} — Toolbox — Timothy Ali</title><meta name="description" content={t.summary} /></svelte:head>
<main class="inner-page tool" id="main" tabindex="-1">
  <section class="head">
    <QuietLink href="/toolbox/" label="Toolbox" dir="left" pad class="lbl" />
    <span class="lbl">[{t.n}] / {t.blurb}</span>
    <h1 class="display title"><Decode text={t.name} step={STEP} /></h1>
    <div class="intro">
      <p class="lead">{t.summary}</p>
      <dl class="meta">
        <div><dt class="lbl dim">In</dt><dd class="body">{t.input}</dd></div>
        <div><dt class="lbl dim">Out</dt><dd class="body">{t.outputs.join(', ')}</dd></div>
      </dl>
    </div>
  </section>

  <section class="shot"><Picture src={t.shot.src} alt={t.shot.alt} width={t.shot.w} height={t.shot.h} eager /></section>

  <section class="text"><h2 class="display-s">When to reach for it</h2><div class="paras"><p class="body">{t.whenToUse}</p></div></section>
  <section class="text"><h2 class="display-s">What lands on disk</h2><div class="paras"><p class="body">{t.produces}</p><ul class="outputs lbl">{#each t.outputs as o}<li>{o}</li>{/each}</ul></div></section>
  <section class="text">
    <h2 class="display-s">Without the window</h2>
    <div class="paras">
      <p class="body">The same tool from a terminal or an agent. Identical output either way, because the app and the command line run the same code.</p>
      <Code label="Example command" text={t.command} />
      <Options tool={t} heading={false} />
      <QuietLink href="/toolbox/agents/" label="The command line and MCP" pad class="lbl" />
    </div>
  </section>

  <section class="next">
    <Cta variant="row" href={`/toolbox/${next.slug}/`} class="lbl"><span>Next / [{next.n}]</span><span>{next.name} <Arrow /></span></Cta>
    <PageFoot note={`[${t.n}] / ${last}`} href="/toolbox/" label="All four tools" />
  </section>
</main>
<style>
.head{display:flex;flex-direction:column;gap:var(--s2);padding-top:var(--s4)}
.title{font-size:110px;line-height:112px;margin-top:var(--s2)}
.intro{display:grid;grid-template-columns:round(down,calc((100% - 32px) * 2 / 3),8px) 1fr;gap:var(--s4);margin-top:var(--s4);align-items:start}
.meta{display:flex;flex-direction:column;gap:var(--s2);margin:0;padding-top:var(--s1)}
.meta dt{margin-bottom:var(--s1)}.meta dd{margin:0}
.shot,.text,.next{padding-top:var(--s8)}
.text{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 2),8px) 1fr;gap:var(--s4);align-items:start}
.paras{display:flex;flex-direction:column;gap:var(--s3);min-width:0}
.outputs{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:var(--s1)}
.outputs li{padding:var(--s1);background:var(--fg);color:var(--paper)}
@media(max-width:1100px){.title{font-size:82.5px;line-height:88px}}
@media(max-width:900px){.title{font-size:55px;line-height:56px}.intro,.text{grid-template-columns:100%}}
@media(max-width:700px){.head{padding-top:var(--s3)}.title{font-size:41.25px;line-height:48px}.intro{margin-top:var(--s3);gap:var(--s3)}.shot,.text,.next{padding-top:var(--s6)}}
</style>
