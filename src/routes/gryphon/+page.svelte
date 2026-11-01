<script lang="ts">
  // Gryphon, then Tome at #tome (PX-137): the Toolbox landing's hero, release block and panel,
  // with the app's own screens beside what each does. An assistant proposal: the route, Tome's
  // place and the copy await Timothy's word. Facts: the Gryphon and Tome READMEs ($lib/gryphon).
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import CopyButton from '$lib/components/CopyButton.svelte';
  import { VERSION, REPO, RELEASES, builds, points, TOME } from '$lib/gryphon';
  import { frameSizes } from '$lib/figure';
  import { STEP } from '$lib/tokens';
  // a screen takes two thirds of the frame beside its words, and the whole frame from 900 down
  const sizes = `(min-width: 901px) calc((100vw - 64px) * 2 / 3), ${frameSizes()}`;
  // A phone cannot install a desktop app (0206): as on Toolbox's page, a touch screen gets a note
  // and the page's link sent on, through the share sheet or the clipboard (PX-125, PX-128).
  let sent = $state(''), failed = $state(false);
  let clear: ReturnType<typeof setTimeout> | undefined;
  async function sendOn() {
    const url = `${location.origin}/gryphon/#download`;
    clearTimeout(clear); sent = ''; failed = false;
    if (navigator.share) {
      try { await navigator.share({ title: 'Gryphon', url }); return; }
      catch (e) { if ((e as DOMException)?.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url); sent = 'Link copied'; clear = setTimeout(() => (sent = ''), 4000); }
    catch { failed = true; }
  }
</script>
<main class="gryphon-landing" id="main" tabindex="-1">
  <Band class="gryphon-hero" mode="bands" seed={11} density={0.7} flip shade hug pad={0} feather={12} depth={0.85} clearFeather={3} avoid=".hero-copy h1 .decode > [aria-hidden]:not(.cursor)" clear=".hero-copy .lead, .hero-actions > *">
    <div class="hero-copy">
      <h1 class="blackletter display-xl" data-ink="gryphon."><Decode text="gryphon." step={STEP} /></h1>
      <p class="lead">WoW Forever addons,<br />straight from GitHub.</p>
    </div>
    <div class="hero-actions"><Cta href="#download">Download <Arrow /></Cta><QuietLink href="#tome" label="Tome, an addon" /></div>
  </Band>

  <section class="about" aria-labelledby="about-title">
    <div class="section-head"><h2 id="about-title" class="display">No account.<br />No ads.</h2><p class="body">Gryphon pulls each addon straight from its GitHub releases, so there’s no CurseForge or Overwolf in between. I made it for me and a few friends ahead of Forever’s launch on November 4.</p></div>
    <div class="points">
      {#each points as pt, i (pt.shot.src)}
        <div class="point">
          <div class="point-copy"><h3 class="display-s">{pt.title}</h3><p class="body">{pt.text}</p></div>
          <div class="screen"><Picture src={pt.shot.src} alt={pt.shot.alt} width={pt.shot.w} height={pt.shot.h} phone={pt.shot.phone} {sizes} eager={i === 0} /></div>
        </div>
      {/each}
    </div>
  </section>

  <section class="release" id="download" aria-labelledby="download-title">
    <div class="release-heading"><span class="lbl dim">v{VERSION}</span><h2 id="download-title" class="blackletter">Download.</h2></div>
    <div class="release-copy">
      <p class="body">Pick the download for your computer below. Open it and Gryphon finds the game on its own.</p>
      <div class="on-phone panel"><p class="body">Gryphon runs on macOS, Windows, and Linux. Open this page on your computer to install it.</p><Cta variant="row" type="button" class="send" onclick={sendOn}><span>{sent || 'Send the link to your computer'}</span><Arrow /></Cta><p class={failed ? 'body fail' : 'sr-only'} role="status">{failed ? 'Couldn’t copy the link. Open timothyali.com/gryphon on your computer.' : sent}</p></div>
      <ul class="downloads">
        {#each builds as b (b.os)}
          <li><span class="lbl dim">{b.os}</span><span class="files">{#each b.files as f (f.href)}<a class="body" href={f.href}><span class="sr-only">Download Gryphon for {b.os}, </span>{f.label}</a>{/each}</span><span class="read-s dim note">{b.note}</span></li>
        {/each}
      </ul>
      <QuietLink href={RELEASES} label="All files on GitHub" />
      <QuietLink href={REPO} label="Open source on GitHub" />
    </div>
  </section>

  <section class="tome panel" id="tome" aria-labelledby="tome-title">
    <div class="tome-heading"><span class="lbl dim">v{TOME.version}</span><h2 id="tome-title" class="blackletter">tome.</h2></div>
    <div class="tome-copy">
      <p class="body">Tome is an addon for WoW Forever. It puts one set of tabs on the windows you open most, so getting from one to another takes a click. It works in combat.</p>
      <ul class="tabs lbl" aria-label="The windows Tome puts its tabs on">{#each TOME.tabs as tab (tab)}<li>{tab}</li>{/each}</ul>
      <p class="body">Type /tome for its settings, or set a key for it under Options, Keybindings.</p>
      <p class="body">To install it, paste this on Gryphon’s GitHub screen:</p>
      <div class="command-plate copyable"><code class="body">{TOME.repo}<Cursor size="line" /></code><CopyButton text={TOME.repo} name={TOME.repo} /></div>
      <QuietLink href={TOME.releases} label="Or get the zip from GitHub" pad />
      <QuietLink href={TOME.source} label="Open source on GitHub" pad />
    </div>
  </section>
  <section class="end"><PageFoot note="" href="/contact/" label="Get in touch" /></section>
</main>
<style>
/* The hero, the section head, the release block and the panel are the Toolbox landing's (its
   +page.svelte); the points are its tool showcase with a screen in place of the diagram. */
.gryphon-landing :global(.gryphon-hero){padding:var(--s4) var(--gutter) var(--s8)}
.hero-copy{margin-top:var(--s2);width:fit-content;max-width:100%}.hero-copy .lead{margin-top:var(--s2)}
.hero-actions{display:flex;align-items:center;gap:var(--s4);flex-wrap:wrap;margin-top:var(--s4)}
.about{padding-top:var(--s8);padding-bottom:var(--s8)}
.section-head{display:grid;grid-template-columns:1fr 1fr;gap:var(--s4);align-items:end;margin-bottom:var(--s8)}.section-head .body{max-width:36ch}
.points{display:flex;flex-direction:column;gap:var(--s8)}
.point{display:grid;grid-template-columns:round(down,calc((100% - 64px) / 3),8px) minmax(0,1fr);gap:var(--s8);align-items:start}
.point-copy{padding-top:var(--s4);display:flex;flex-direction:column;gap:var(--s3)}.point-copy h3{max-width:16ch}
.screen{min-width:0;padding:var(--s1);background:var(--surface-card)} /* the demo mat: the app's ink would otherwise meet the page's */
.release{padding-top:var(--s8);padding-bottom:var(--s8);display:grid;grid-template-columns:1fr 1fr;gap:var(--s8)}
.release h2,.tome h2{font-size:129px;line-height:136px;margin-top:var(--s2)}
.release-copy,.tome-copy{display:flex;flex-direction:column;align-items:flex-start;gap:var(--s3)}
.downloads{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--s2);align-self:stretch}
.downloads li{display:grid;grid-template-columns:96px minmax(0,1fr);gap:0 var(--s2);align-items:baseline}
.downloads .files{display:flex;gap:var(--s3);flex-wrap:wrap}
.downloads .files a{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px}
@media(hover:hover){.downloads .files a:hover{color:var(--accent-text)}}
.downloads .files a:active{background:var(--accent);color:var(--on-accent);box-shadow:0 0 0 var(--s1) var(--accent)} /* the press (0099) */
.downloads .note{grid-column:2}
.on-phone{display:none;flex-direction:column;align-items:flex-start;gap:var(--s2);padding:var(--s2)}
.on-phone .body{margin:0;max-width:30ch}
.on-phone :global(.send){padding:var(--pad-m);margin:0 calc(-1 * var(--s2)) calc(-1 * var(--s2));width:auto;align-self:stretch;flex-wrap:nowrap}
.on-phone :global(.send>span:first-child){flex:1 1 auto;min-width:0}
.on-phone .fail{overflow-wrap:anywhere}
@media(pointer:coarse) and (max-width:1100px){.on-phone{display:flex}.downloads .files a{padding:6px 0}} /* 44px to a finger (0206) */
.tome{display:grid;grid-template-columns:1fr 1fr;gap:var(--s8);padding-top:var(--s8);padding-bottom:var(--s8);scroll-margin-top:0}
.tome-copy .body{max-width:44ch}
/* the tabs as words, not a picture of the game: paper chips on the panel, the first one open */
.tabs{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:var(--s1)}
.tabs li{padding:var(--pad-s);background:var(--paper);color:var(--fg)}
.tabs li:first-child{background:var(--accent);color:var(--on-accent)}
.copyable{flex-direction:row;align-items:center;justify-content:space-between;gap:var(--s2);align-self:stretch} /* the repo and its copy on one line (PX-128) */
.tome-copy :global(.quiet-link){align-self:flex-start}
.end :global(.page-foot){margin-top:var(--s4);margin-bottom:var(--s4)}
@media(max-width:1100px){.point{grid-template-columns:round(down,calc((100% - 32px) / 3),8px) minmax(0,1fr);gap:var(--s4)}.point-copy h3{font-size:27.5px;line-height:32px}.release h2,.tome h2{font-size:86px;line-height:88px}}
/* the display-xl ladder (type.css), except that the hero holds 258 down to 901px, as Toolbox's does */
@media(min-width:901px) and (max-width:1100px){.hero-copy h1{font-size:258px;line-height:264px}}
@media(max-width:900px){.section-head{grid-template-columns:1fr;gap:var(--s3);margin-bottom:var(--s6)}.point{grid-template-columns:minmax(0,1fr)}.point-copy{display:grid;grid-template-columns:1fr 1fr;padding-top:0;gap:var(--s2) var(--s4)}.points{gap:var(--s6)}.release,.tome{gap:var(--s4)}}
@media(max-width:700px){
 .gryphon-landing :global(.gryphon-hero){padding-top:var(--s3);padding-bottom:var(--s6)}
 .hero-copy{margin-top:var(--s1)}.hero-actions{gap:var(--s3);margin-top:var(--s3)}
 .about{padding-top:var(--s6);padding-bottom:var(--s6)}
 .point-copy{display:flex;gap:var(--s2)}.point-copy h3{max-width:100%}.point{gap:var(--s3)}
 .release,.tome{grid-template-columns:minmax(0,1fr);padding-top:var(--s6);padding-bottom:var(--s6)}.end :global(.page-foot){margin-top:0}
}
@media(max-width:420px){.release h2,.tome h2{font-size:43px;line-height:48px}} /* the next whole-cell step, as Toolbox's “Download.” takes on a 320px phone */
</style>
