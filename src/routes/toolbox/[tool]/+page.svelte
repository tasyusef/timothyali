<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Code from '$lib/components/Code.svelte';
  import NextFoot from '$lib/components/NextFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import Options from '$lib/components/toolbox/Options.svelte';
  import { STEP } from '$lib/tokens';
  let { data } = $props();
  const t = $derived(data.tool);
  const next = $derived(data.next);
</script>
<main class="inner-page tool" id="main" tabindex="-1">
  <section class="head">
    <h1 class="display-title"><Decode text={t.name} step={STEP} /></h1>
    <div class="intro">
      <p class="lead">{t.summary}</p>
      <dl class="meta">
        <div><dt class="lbl dim">In</dt><dd class="body">{t.input}</dd></div>
        <div><dt class="lbl dim">Out</dt><dd class="body">{t.outputs.join(', ')}</dd></div>
        <!-- the page had no way to the app (0206) -->
        <div><dt class="lbl dim">Get it</dt><dd><QuietLink href="/toolbox/#download" label="Download for macOS or Linux" text="body" /></dd></div>
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
      <QuietLink href="/toolbox/agents/" label="CLI & MCP setup" pad />
    </div>
  </section>

  <section class="next">
    <NextFoot href={`/toolbox/${next.slug}/`} n={next.n} title={next.name} back="/toolbox/" backLabel="All four tools" />
  </section>
</main>
<style>
.shot,.text,.next{padding-top:var(--s8)}
.text{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 2),8px) 1fr;gap:var(--s4);align-items:start}
.text{scroll-margin-top:var(--s12)} /* #cli, linked from the CLI & MCP page's options (0199), clears the sticky header */
/* CLI & MCP in one column (0205), as on the CLI & MCP page (0200): the explanation, then the
   command and the options at full width, so nothing sits beside an empty column */
.text.stack{display:flex;flex-direction:column;gap:var(--s3)}.stack .paras>.body{max-width:64ch}
@media(max-width:900px){.text{grid-template-columns:100%}}
@media(max-width:700px){.shot,.text,.next{padding-top:var(--s6)}}
</style>
