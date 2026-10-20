<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import ToolDemo from '$lib/components/toolbox/ToolDemo.svelte';
  import { APP, tools, builds, RELEASES } from '$lib/toolbox';
  import { STEP } from '$lib/tokens';
  let selected = $state('lockup');
  const active = $derived(tools.find(t => t.slug === selected) ?? tools[0]);
  const promises: Record<string, string> = {
    lockup: 'Package your logos.', palette: 'Export your palette.',
    specimen: 'Make a type sheet.', convert: 'Convert and resize.'
  };
  // A phone cannot install a desktop app (0206): on a touch screen the download section says so
  // and offers to send the page on, through the share sheet or the clipboard.
  let sent = $state('');
  async function sendOn() {
    const url = `${location.origin}/toolbox/#download`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Toolbox', url }); return; }
      await navigator.clipboard.writeText(url); sent = 'Link copied';
    } catch { return; }
    setTimeout(() => (sent = ''), 2400);
  }
</script>
<main class="toolbox-landing" id="main" tabindex="-1">
  <Band class="toolbox-hero" mode="bands" seed={7} density={0.7} flip shade hug pad={0} feather={12} depth={0.85} clearFeather={3} avoid=".hero-copy h1 .decode > [aria-hidden]:not(.cursor)" clear=".hero-copy .lead, .hero-actions > *">
    <div class="hero-copy">
      <h1 class="blackletter display-xl" data-ink="toolbox."><Decode text="toolbox." step={STEP} /></h1>
      <p class="lead">Prepare your files<br />for handoff.</p>
    </div>
    <div class="hero-actions"><Cta href="#tools">Explore the tools <Arrow /></Cta></div>
  </Band>

  <section class="showcase" id="tools" aria-labelledby="tools-title">
    <div class="section-head"><h2 id="tools-title" class="display">Four tools.<br />One app.</h2><p class="body">Package logos, export palettes, make type sheets, and convert images. Try each tool below.</p></div>
    <div class="tool-picker" role="group" aria-label="Choose a tool to preview">
      {#each tools as t}<button type="button" aria-pressed={selected === t.slug} aria-controls="tool-preview" onclick={() => selected = t.slug}><span class="lbl">{t.n}</span><span class="display-s">{t.name}</span></button>{/each}
    </div>
    <div class="tool-showcase" id="tool-preview">
      <div class="tool-story" aria-live="polite">
        <h3 class="display-s">{promises[active.slug]}</h3>
        <p class="body">{active.summary}</p>
        <QuietLink href={`/toolbox/${active.slug}/`} label={`${active.name} guide`} pad />
      </div>
      <div class="demo-wrap"><ToolDemo tool={selected} /></div>
    </div>
    <noscript><p class="body">Explore each tool: {#each tools as t}<a href={`/toolbox/${t.slug}/`}>{t.name}</a>{' '}{/each}</p></noscript>
  </section>

  <section class="machine panel" aria-labelledby="machine-title">
    <div><h2 id="machine-title" class="display">Automate<br />your exports.</h2></div>
    <div class="machine-copy"><p class="body">Use the same tools from your terminal or an AI assistant through MCP. Inspect files, preview exports, and reopen saved work without opening the app.</p><div class="command-plate"><code class="body">toolbox --mcp<Cursor size="line" /></code></div><QuietLink href="/toolbox/agents/" label="CLI & MCP docs" pad /></div>
  </section>

  <section class="release" id="download" aria-labelledby="download-title">
    <div class="release-heading"><span class="lbl dim">v{APP.version}</span><h2 id="download-title" class="blackletter">Download.</h2></div>
    <div class="release-copy">
      <p class="body">Choose the build for your computer below. The releases page includes SHA-256 checksums to verify the downloaded file.</p>
      <div class="on-phone panel"><p class="body">Toolbox runs on macOS and Linux. Open this page on your computer to install it.</p><Cta variant="row" type="button" class="send" onclick={sendOn}><span>{sent || 'Send the link to your computer'}</span><Arrow /></Cta></div>
      <ul class="downloads">
        {#each builds as b}
          <li><span class="lbl dim">{b.os}</span><span class="files">{#each b.files as f}<a class="body" href={f.href}>{f.label}</a>{/each}</span><span class="lbl dim note phone-read">{b.note}</span></li>
        {/each}
      </ul>
      <QuietLink href={RELEASES} label="All files and checksums" />
    </div>
  </section>
  <section class="end"><PageFoot note="" href="/contact/" label="Get in touch" /></section>
</main>
<style>
.toolbox-landing :global(.toolbox-hero){padding:var(--s4) var(--gutter) var(--s8)}
/* no label row above the name, no platform tag beside the action, no eyebrows or plates (0194) */
.hero-copy{margin-top:var(--s2);width:fit-content;max-width:100%}.hero-copy .lead{margin-top:var(--s2)}
.hero-actions{display:flex;align-items:center;gap:var(--s4);flex-wrap:wrap;margin-top:var(--s4)}
.showcase{padding-top:var(--s8);padding-bottom:var(--s8);scroll-margin-top:var(--s8)}
.section-head{display:grid;grid-template-columns:1fr 1fr;gap:var(--s4);align-items:end;margin-bottom:var(--s6)}.section-head .body{max-width:34ch}
.tool-picker{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--s1);margin-bottom:var(--s4)}
.tool-picker button{padding:27px 16px 21px;display:flex;flex-direction:column;align-items:flex-start;position:relative;gap:var(--s2);background:var(--surface-card);text-align:left;min-width:0}
.tool-picker button[aria-pressed=true]{background:var(--accent);color:var(--on-accent)}@media(hover:hover){.tool-picker button:hover{background:var(--fg);color:var(--paper)}}.tool-picker button:active{background:var(--accent);color:var(--on-accent)} /* press (0099) */
.tool-picker .display-s{font-size:27.5px;line-height:32px}
.tool-showcase{display:grid;grid-template-columns:round(down,calc((100% - 64px) / 3),8px) minmax(0,1fr);gap:var(--s8);align-items:start}
.tool-story{padding-top:var(--s4);display:flex;flex-direction:column;gap:var(--s3)}.tool-story h3{max-width:16ch}
.tool-story :global(.quiet-link){align-self:flex-start;margin-top:var(--s1)}
.demo-wrap{min-width:0;padding:var(--s1);background:var(--surface-card)}
.machine{display:grid;grid-template-columns:1fr 1fr;gap:var(--s8);padding-top:var(--s8);padding-bottom:var(--s8)}
.machine h2{margin-top:0}.machine-copy{display:flex;flex-direction:column;gap:var(--s3)}

.machine :global(.quiet-link){align-self:flex-start}
.release{padding-top:var(--s8);padding-bottom:var(--s4);display:grid;grid-template-columns:1fr 1fr;gap:var(--s8)}
.release h2{font-size:129px;line-height:136px;margin-top:var(--s2)}.release-copy{display:flex;flex-direction:column;align-items:flex-start;gap:var(--s3)}.downloads{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--s2);align-self:stretch}
.downloads li{display:grid;grid-template-columns:96px minmax(0,1fr);gap:0 var(--s2);align-items:baseline}
.downloads .files{display:flex;gap:var(--s3);flex-wrap:wrap}
.downloads .files a{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px}
@media(hover:hover){.downloads .files a:hover{color:var(--accent-text)}}
.downloads .note{grid-column:2}
.on-phone{display:none;flex-direction:column;align-items:flex-start;gap:var(--s2);padding:var(--s2)}
.on-phone .body{margin:0;max-width:38ch}
.on-phone :global(.send){padding:var(--pad-m);margin:0 calc(-1 * var(--s2)) calc(-1 * var(--s2));width:auto;align-self:stretch;flex-wrap:nowrap}
@media(pointer:coarse) and (max-width:1100px){.on-phone{display:flex}.downloads .files a{padding:6px 0}} /* 44px to a finger (0206) */
.end :global(.page-foot){margin-top:var(--s4);margin-bottom:var(--s4)}
noscript a{text-decoration:underline}
@media(max-width:1100px){.tool-showcase{grid-template-columns:round(down,calc((100% - 32px) / 3),8px) minmax(0,1fr);gap:var(--s4)}.tool-story h3{font-size:27.5px;line-height:32px}.release h2{font-size:86px;line-height:88px}}
/* the display-xl ladder (type.css), except that the hero holds 258 down to 901px (“toolbox.” is 822 at 258) */
@media(min-width:901px) and (max-width:1100px){.hero-copy h1{font-size:258px;line-height:264px}}
@media(max-width:900px){.tool-showcase{grid-template-columns:minmax(0,1fr)}.tool-story{display:grid;grid-template-columns:1fr 1fr;padding-top:0;gap:var(--s2) var(--s4)}.tool-story h3{grid-row:1/3}.tool-story :global(.quiet-link){grid-column:2;margin-top:0}.machine,.release{gap:var(--s4)}.machine h2{font-size:41.25px;line-height:48px}}
@media(max-width:700px){
 .toolbox-landing :global(.toolbox-hero){padding-top:var(--s3);padding-bottom:var(--s6)}
 .hero-copy{margin-top:var(--s1)}.hero-actions{gap:var(--s3);margin-top:var(--s3)}
 .section-head{grid-template-columns:1fr;gap:var(--s3);margin-bottom:var(--s4)}.showcase{padding-top:var(--s6);padding-bottom:var(--s6)}
 .tool-picker{grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:var(--s3)}.tool-picker button{padding:17px 16px 15px;gap:var(--s1)}.tool-picker .display-s{font-family:var(--face-label);font-size:12.5px;line-height:16px}
 .tool-story{display:flex;gap:var(--s2)}.tool-story h3{max-width:100%}.tool-story :global(.quiet-link){margin-top:var(--s1)}.tool-showcase{gap:var(--s3)}
 .machine,.release{grid-template-columns:minmax(0,1fr);padding-top:var(--s6);padding-bottom:var(--s6)}.end :global(.page-foot){margin-top:0}
}
@media(max-width:420px){.machine h2{font-size:27.5px;line-height:32px}.release h2{font-size:43px;line-height:48px}} /* “Download.” takes the next whole-cell step to fit a 320px phone. */
</style>
