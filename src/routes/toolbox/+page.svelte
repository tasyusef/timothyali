<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import ToolDemo from '$lib/components/toolbox/ToolDemo.svelte';
  import { APP, tools, builds } from '$lib/toolbox';
  import { STEP } from '$lib/tokens';
  let selected = $state('lockup');
  const active = $derived(tools.find(t => t.slug === selected) ?? tools[0]);
  const promises: Record<string, string> = {
    lockup: 'One logo. Ready for everywhere.', palette: 'From colour to a system.',
    specimen: 'Meet your type.', convert: 'The right file for the job.'
  };
</script>
<svelte:head><title>Toolbox — Timothy Ali</title><meta name="description" content={APP.description} /></svelte:head>
<main class="toolbox-landing" id="main" tabindex="-1">
  <Band class="toolbox-hero" mode="bands" seed={7} density={0.7} flip shade avoid=".hero-copy, .hero-top, .hero-actions">
    <div class="hero-top lbl"><span>By Timothy Ali</span><span>App / CLI / MCP</span></div>
    <div class="hero-copy">
      <h1 class="blackletter"><Decode text="toolbox." step={STEP} /></h1>
      <p class="lead">Make the work.<br />Let Toolbox finish the files.</p>
    </div>
    <div class="hero-actions"><Cta href="#tools" class="lbl">Explore the tools <Arrow /></Cta><span class="lbl">macOS · Windows · Linux</span></div>
  </Band>

  <section class="showcase" id="tools" aria-labelledby="tools-title">
    <div class="section-head"><h2 id="tools-title" class="display">Four tools.<br />One app.</h2><p class="body">Logo packages, colour systems, type specimens and image conversion. Pick a tool. See what comes out.</p></div>
    <div class="tool-picker" role="group" aria-label="Choose a tool to preview">
      {#each tools as t}<button type="button" aria-pressed={selected === t.slug} aria-controls="tool-preview" onclick={() => selected = t.slug}><span class="lbl">{t.n}</span><span class="display-s">{t.name}</span></button>{/each}
    </div>
    <div class="tool-showcase" id="tool-preview">
      <div class="tool-story" aria-live="polite">
        <span class="lbl tool-number">[{active.n}] / {active.name}</span>
        <h3 class="display-s">{promises[active.slug]}</h3>
        <p class="body">{active.summary}</p>
        <div class="formats lbl">{#each active.outputs as output}<span>{output}</span>{/each}</div>
        <QuietLink href={`/toolbox/${active.slug}/`} label={`About ${active.name}`} class="lbl" pad />
      </div>
      <div class="demo-wrap"><ToolDemo tool={selected} /><p class="demo-note lbl dim">Exporting happens in the app.</p></div>
    </div>
    <noscript><p class="body">Explore each tool: {#each tools as t}<a href={`/toolbox/${t.slug}/`}>{t.name}</a>{' '}{/each}</p></noscript>
  </section>

  <section class="machine" aria-labelledby="machine-title">
    <div><span class="lbl">For you. And your agents.</span><h2 id="machine-title" class="display">Same tools.<br />Your workflow.</h2></div>
    <div class="machine-copy"><p class="body">Use the app, run a command, or connect over MCP. Each route runs the same tools and produces the same files.</p><div class="command"><span class="lbl dim">Terminal</span><code class="body">toolbox --mcp<Cursor /></code></div><QuietLink href="/toolbox/agents/" label="CLI & MCP docs" class="lbl" pad /></div>
  </section>

  <section class="release" id="download" aria-labelledby="download-title">
    <div class="release-heading"><span class="lbl">Release {APP.version}</span><h2 id="download-title" class="blackletter">Almost yours.</h2></div>
    <div class="release-copy"><span class="status lbl">{APP.status}</span><p class="body">The first release is finished and waiting on code signing. When the builds are signed, they’ll land here.</p><div class="platforms lbl">{#each builds as b}<span title={`${b.note} · ${b.formats}`}>{b.os}</span>{/each}</div></div>
  </section>
  <section class="end"><PageFoot note="Toolbox / by Timothy Ali" href="/contact/" label="Get in touch" /></section>
</main>
<style>
.toolbox-landing :global(.toolbox-hero){padding:var(--s4) var(--gutter) var(--s8);overflow:hidden}
.hero-top{display:flex;justify-content:space-between;gap:var(--s2)}
.hero-copy{margin-top:var(--s6);width:fit-content;max-width:100%}.hero-copy h1{font-size:258px;line-height:264px}.hero-copy .lead{margin-top:var(--s2)}
.hero-actions{display:flex;align-items:center;gap:var(--s4);flex-wrap:wrap;margin-top:var(--s4)}
.showcase{padding-top:var(--s8);padding-bottom:var(--s8);scroll-margin-top:var(--s8)}
.section-head{display:grid;grid-template-columns:1fr 1fr;gap:var(--s4);align-items:end;margin-bottom:var(--s6)}.section-head .body{max-width:34ch}
.tool-picker{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--s1);margin-bottom:var(--s4)}
.tool-picker button{padding:27px 16px 21px;display:flex;flex-direction:column;align-items:flex-start;position:relative;gap:var(--s2);background:var(--surface-card);text-align:left;min-width:0}
.tool-picker button[aria-pressed=true]{background:var(--accent);color:var(--on-accent)}.tool-picker button:hover{background:var(--fg);color:var(--paper)}
.tool-picker .display-s{font-size:27.5px;line-height:32px}
.tool-showcase{display:grid;grid-template-columns:round(down,calc((100% - 64px) / 3),8px) minmax(0,1fr);gap:var(--s8);align-items:start}
.tool-story{padding-top:var(--s4);display:flex;flex-direction:column;gap:var(--s3)}.tool-story h3{max-width:16ch}.tool-number{color:var(--accent-text)}
.formats{display:flex;flex-wrap:wrap;gap:var(--s1) var(--s2);opacity:var(--dim)}
.tool-story :global(.quiet-link){align-self:flex-start;margin-top:var(--s1)}
.demo-wrap{min-width:0;padding:var(--s1);background:var(--surface-card)}.demo-note{padding-top:var(--s2);line-height:24px}
.machine{display:grid;grid-template-columns:1fr 1fr;gap:var(--s8);padding-top:var(--s8);padding-bottom:var(--s8);background:var(--fg);color:var(--paper)}
.machine h2{margin-top:var(--s3)}.machine-copy{display:flex;flex-direction:column;gap:var(--s3)}
.command{padding:var(--s3);background:var(--paper);color:var(--fg);display:flex;flex-direction:column;gap:var(--s2)}.command code{font-family:var(--face-text)}.command :global(.cursor){height:24px;vertical-align:top}
.machine :global(.quiet-link){align-self:flex-start}.machine :global(.quiet-link:hover){color:inherit;text-decoration:underline}
.release{padding-top:var(--s8);padding-bottom:var(--s4);display:grid;grid-template-columns:1fr 1fr;gap:var(--s8)}
.release h2{font-size:129px;line-height:136px;margin-top:var(--s2)}.release-copy{display:flex;flex-direction:column;align-items:flex-start;gap:var(--s3)}.status{padding:9px 14px 7px 16px;background:var(--accent);color:var(--on-accent)}.platforms{display:flex;gap:var(--s3);flex-wrap:wrap}
.end :global(.page-foot){margin-top:var(--s4);margin-bottom:var(--s4)}
noscript a{text-decoration:underline}
@media(max-width:1100px){.tool-showcase{grid-template-columns:round(down,calc((100% - 32px) / 3),8px) minmax(0,1fr);gap:var(--s4)}.tool-story h3{font-size:27.5px;line-height:32px}.release h2{font-size:86px;line-height:88px}}
@media(max-width:900px){.hero-copy h1{font-size:172px;line-height:176px} /* “toolbox.” is 822 at 258 */.tool-showcase{grid-template-columns:minmax(0,1fr);gap:var(--s4)}.tool-story{display:grid;grid-template-columns:1fr 1fr;padding-top:0;gap:var(--s2) var(--s4)}.tool-number{grid-column:1/-1}.tool-story h3{grid-row:2/4}.tool-story :global(.quiet-link){grid-column:2;margin-top:0}.machine,.release{gap:var(--s4)}.machine h2{font-size:41.25px;line-height:48px}}
@media(max-width:700px){
 .toolbox-landing :global(.toolbox-hero){padding-top:var(--s3);padding-bottom:var(--s6)}.hero-top{font-size:12.5px;line-height:16px}.hero-top>span:last-child{display:none}
 .hero-copy{margin-top:var(--s4)}.hero-copy h1{font-size:129px;line-height:136px}.hero-copy .lead{font-size:27px;line-height:32px}.hero-actions{gap:var(--s3);margin-top:var(--s3)}
 .section-head{grid-template-columns:1fr;gap:var(--s3);margin-bottom:var(--s4)}.showcase{padding-top:var(--s6);padding-bottom:var(--s6)}
 .tool-picker{grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:var(--s3)}.tool-picker button{padding:17px 16px 15px;gap:var(--s1)}.tool-picker .display-s{font-family:var(--face-label);font-size:12.5px;line-height:16px}
 .tool-story{display:flex;gap:var(--s2)}.tool-story h3{max-width:100%}.tool-story :global(.quiet-link){margin-top:var(--s1)}.tool-showcase{gap:var(--s3)}
 .machine,.release{grid-template-columns:minmax(0,1fr);padding-top:var(--s6);padding-bottom:var(--s6);gap:var(--s4)}.machine h2{font-size:41.25px;line-height:48px}.release h2{font-size:86px;line-height:88px}.command{padding:var(--s2)}.demo-note{font-size:12.5px;line-height:24px}.end :global(.page-foot){margin-top:0}
}
@media(max-width:420px){.machine h2{font-size:27.5px;line-height:32px}.hero-copy h1{font-size:86px;line-height:88px}}
</style>
