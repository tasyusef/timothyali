<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import Code from '$lib/components/Code.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import Options from '$lib/components/toolbox/Options.svelte';
  import { STEP } from '$lib/tokens';
  let { data } = $props();
  const t = $derived(data.tool);
  const next = $derived(data.next);
</script>
<main class="inner-page tool" id="main" tabindex="-1">
  <section class="head">
    <h1 class="display title"><Decode text={t.name} step={STEP} /></h1>
    <div class="intro">
      <p class="lead">{t.summary}</p>
      <dl class="meta">
        <div><dt class="lbl dim">In</dt><dd class="body">{t.input}</dd></div>
        <div><dt class="lbl dim">Out</dt><dd class="body">{t.outputs.join(', ')}</dd></div>
        <!-- the page had no way to the app (0206) -->
        <div><dt class="lbl dim">Get it</dt><dd><QuietLink href="/toolbox/#download" label="Download for macOS or Linux" class="body" /></dd></div>
      </dl>
    </div>
  </section>

  <section class="shot"><Picture src={t.shot.src} alt={t.shot.alt} width={t.shot.w} height={t.shot.h} phone={t.shot.phone} eager /></section>

  <section class="text"><h2 class="display-s">When to use it</h2><div class="paras"><p class="body">{t.whenToUse}</p></div></section>
  <section class="text"><h2 class="display-s">Exported files</h2><div class="paras"><p class="body">{t.produces}</p></div></section>
  <section class="text stack" id="cli">
    <h2 class="display-s">CLI & MCP</h2>
    <div class="paras">
      <p class="body">Set up the toolbox command using the linked guide, then run this example with your own inputs. The options below work with both the CLI and MCP.</p>
      <Code label="Example command" text={t.command} />
      <Options tool={t} />
      <QuietLink href="/toolbox/agents/" label="CLI & MCP setup" pad class="lbl" />
    </div>
  </section>

  <section class="next">
    <Cta variant="row" href={`/toolbox/${next.slug}/`} class="lbl"><span>Next / [{next.n}]</span><span>{next.name} <Arrow /></span></Cta>
    <PageFoot note="" href="/toolbox/" label="All four tools" />
  </section>
</main>
<style>
.head{display:flex;flex-direction:column;gap:var(--s2);padding-top:var(--s4)}
.title{font-size:110px;line-height:112px} /* the back link and the number line are gone (0194) */
.shot,.text,.next{padding-top:var(--s8)}
.text{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 2),8px) 1fr;gap:var(--s4);align-items:start}
.text{scroll-margin-top:var(--s12)} /* #cli, linked from the CLI & MCP page's options (0199), clears the sticky header */
/* CLI & MCP in one column (0205), as on the CLI & MCP page (0200): the explanation, then the
   command and the options at full width, so nothing sits beside an empty column */
.text.stack{display:flex;flex-direction:column;gap:var(--s3)}.stack .paras>.body{max-width:64ch}
.paras{display:flex;flex-direction:column;gap:var(--s3);min-width:0}
@media(max-width:1100px){.title{font-size:82.5px;line-height:88px}}
@media(max-width:900px){.title{font-size:55px;line-height:56px}.text{grid-template-columns:100%}}
@media(max-width:700px){.head{padding-top:var(--s3)}.title{font-size:41.25px;line-height:48px}.intro{margin-top:var(--s3);gap:var(--s3)}.shot,.text,.next{padding-top:var(--s6)}}
</style>
