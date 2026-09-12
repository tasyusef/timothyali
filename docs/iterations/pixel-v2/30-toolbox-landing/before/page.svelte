<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import Code from '$lib/components/Code.svelte';
  import IndexRow from '$lib/components/IndexRow.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { APP, home, tools, last, builds } from '$lib/toolbox';
  import { STEP } from '$lib/tokens';
  const commands = ["toolbox                            # what tools exist", "toolbox palette '#F2D600' --out .  # run one", 'toolbox --mcp                      # serve the lot'].join('\n');
  const facts: [string, string[]][] = [['Platform', APP.platforms], ['Interfaces', APP.interfaces], ['Status', [APP.status]], ['Release', [APP.version]]];
</script>
<svelte:head><title>Toolbox — Timothy Ali</title><meta name="description" content={APP.description} /></svelte:head>
<main class="inner-page" id="main" tabindex="-1">
  <section>
    <header class="toolbox-header">
      <h1 class="page-head"><span class="blackletter display-xl"><Decode text="toolbox." step={STEP} /></span></h1>
      <IndexRow label="Tool index" value={`01–${last}`} layout="column" accent />
    </header>
    <div class="intro">
      <p class="lead">{APP.description}</p>
      <dl class="facts">
        {#each facts as [label, values]}<div><dt class="lbl dim">{label}</dt>{#each values as v}<dd class="body">{v}</dd>{/each}</div>{/each}
      </dl>
    </div>
  </section>

  <section class="app-shot"><Picture src={home.src} alt={home.alt} width={home.w} height={home.h} eager /></section>

  <section class="tool-index" aria-labelledby="tools-title">
    <IndexRow label="The tools" value={`01–${last}`} />
    <h2 id="tools-title" class="sr-only">The tools</h2>
    <div class="rows">
      {#each tools as t}
        <a id={t.slug} class="row" href={`/toolbox/${t.slug}/`}>
          <div class="frame"><Picture src={t.shot.src} alt={t.shot.alt} width={t.shot.w} height={t.shot.h} /></div>
          <div class="row-body">
            <span class="lbl">[{t.n}] / {t.blurb}</span>
            <h3 class="display">{t.name}</h3>
            <p class="body">{t.summary}</p>
            <Cta variant="quiet" class="lbl">About {t.name} <Arrow /></Cta>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section class="text" aria-labelledby="machine-title">
    <h2 id="machine-title" class="display-s">Without the window</h2>
    <div class="paras">
      <p class="body">The same binary answers a command line and serves MCP. A job and a click take the identical code path, so the files a script gets are the files the app would have produced.</p>
      <Code label="Three commands" text={commands} />
      <QuietLink href="/toolbox/agents/" label="The command line and MCP" pad class="lbl" />
    </div>
  </section>

  <section class="text" aria-labelledby="download-title">
    <h2 id="download-title" class="display-s">Download</h2>
    <div class="paras">
      <p class="body">The first release is finished and waiting on code signing. Builds for all three platforms come from one source; when they are signed, they land here.</p>
      <ul class="builds">
        {#each builds as b}<li><span class="display-s">{b.os}</span><span class="body dim">{b.note}</span><span class="lbl">{b.formats}</span></li>{/each}
      </ul>
    </div>
  </section>

  <section><PageFoot note={`End of index / ${last}`} href="/contact/" label="Tell me what you’re building" /></section>
</main>
<style>
.toolbox-header{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--s4);padding:var(--s2) 0 var(--s6)}
.page-head{display:flex;flex-direction:column;gap:var(--s2);min-width:0}
.intro{display:grid;grid-template-columns:round(down,calc((100% - 32px) * 2 / 3),8px) 1fr;gap:var(--s4);align-items:start}
.intro .lead{max-width:24ch}
.facts{display:flex;flex-direction:column;gap:var(--s2);margin:0;padding-top:var(--s1)}
.facts dt{margin-bottom:var(--s1)}.facts dd{margin:0}
.app-shot{padding-top:var(--s8)}
.tool-index{padding-top:var(--s8)}
.row-body h3{min-width:0}
.text{padding-top:var(--s8);display:grid;grid-template-columns:round(down,calc((100% - 32px) / 2),8px) 1fr;gap:var(--s4);align-items:start}
.paras{display:flex;flex-direction:column;gap:var(--s3);min-width:0}
.builds{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--s2)}
.builds li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0 var(--s2);align-items:baseline}
.builds .body{grid-column:1}
.builds .lbl{grid-column:2;grid-row:1;padding-top:var(--s1)}
@media(max-width:1100px){.row-body h3{font-size:41.25px;line-height:48px}}
@media(max-width:900px){.intro,.text{grid-template-columns:100%}}
@media(max-width:700px){
  .toolbox-header{flex-direction:column;align-items:stretch;gap:var(--s2);padding:var(--s1) 0 var(--s4)}
  .intro{gap:var(--s3)}
  .app-shot,.tool-index,.text{padding-top:var(--s6)}
}
@media(max-width:420px){.row-body h3{font-size:27.5px;line-height:32px}}
</style>
