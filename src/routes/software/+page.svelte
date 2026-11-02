<script lang="ts">
  // Software (0245, layout 0246): the page is a desktop. The products are icons down the left over
  // the hero scene; one is open in a window (yellow title bar with its version, its screen, what it
  // is, what it does, its links) with the next two stacked behind it, and picking an icon brings
  // its window up. Without JavaScript every window shows, one under the other. Data: $lib/software.
  import Band from '$lib/components/Band.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import { products } from '$lib/software';
  import { TOME } from '$lib/gryphon';
  import { onMount } from 'svelte';

  let open = $state(products[0].slug);
  let moved = $state(false); // the first window just sits there; a picked one arrives
  let icons: HTMLElement;
  const behind = $derived(products.filter((p) => p.slug !== open).slice(0, 2));
  const meta = (p: (typeof products)[number]) => [p.kind, p.platforms.join(', '), p.version && `v${p.version}`].filter(Boolean).join(' / ');
  function pick(e: MouseEvent, slug: string) { e.preventDefault(); if (slug !== open) { moved = true; open = slug; } }
  const remeasure = (e: Event) => e.currentTarget?.dispatchEvent(new CustomEvent('field-measure', { bubbles: true }));
  // a link to /software/#tome opens Tome's window
  // and once the page has settled, the closed windows' screens load, so a switch never wipes in an empty frame
  let warm = $state(false);
  onMount(() => { const h = location.hash.slice(1); if (products.some((p) => p.slug === h)) open = h; const t = setTimeout(() => (warm = true), 1500); return () => clearTimeout(t); });
  // the window changes size, so the field measures its knockout again
  $effect(() => { void open; icons?.dispatchEvent(new CustomEvent('field-measure', { bubbles: true })); });
</script>
<main class="software-landing" id="main" tabindex="-1">
  <h1 class="sr-only">Software</h1>
  <Band class="desk" mode="scene" page="software" seed={10} avoid=".desk .icons a, .desk .win.open">
    <nav class="icons" aria-label="Apps and tools" bind:this={icons}>
      {#each products as p (p.slug)}
        <a href={`#${p.slug}`} class={p.palette} aria-current={open === p.slug ? 'true' : undefined} onclick={(e) => pick(e, p.slug)}><span class="glyph" aria-hidden="true">{#if 'mark' in p.icon}<svg viewBox="0 0 42 42" shape-rendering="crispEdges"><path d={p.icon.mark} fill="currentColor" /></svg>{:else}<span class="blackletter" data-ch={p.icon.letter}>{p.icon.letter}</span>{/if}</span><span class="lbl">{p.name}</span></a>
      {/each}
    </nav>
    <div class="stack" class:arrive={moved}>
      {#each behind as p, i (p.slug)}<div class="ghost panel" style:--i={i + 1} aria-hidden="true"><div class="title lbl"><span>{p.name}</span></div></div>{/each}
      {#each products as p (p.slug)}
        <article class={['win panel', p.palette]} class:open={open === p.slug} id={p.slug} aria-labelledby={`${p.slug}-name`} onanimationend={remeasure}>
          <h2 class="title lbl"><a id={`${p.slug}-name`} href={p.href}>{p.name}</a><span>{p.version ? `v${p.version}` : 'Live'}</span></h2>
          <div class="screen">
            {#if p.shot}<Picture src={p.shot.src} alt={p.shot.alt} width={p.shot.w} height={p.shot.h} eager={warm || p.slug === products[0].slug} sizes="(max-width: 700px) 100vw, 880px" />
            {:else if p.slug === 'tome'}<ul class="tabs lbl" aria-label="Tome’s tabs">{#each TOME.tabs as tab (tab)}<li>{tab}</li>{/each}</ul>{/if}
          </div>
          <div class="info">
            <p class="lbl dim">{meta(p)}</p>
            <p class="body">{p.line}</p>
            <div class="links">{#each p.links as l (l.href)}<QuietLink href={l.href} label={l.label} />{/each}</div>
          </div>
        </article>
      {/each}
    </div>
  </Band>
  <section class="end"><PageFoot note={`(C) ${new Date().getFullYear()} Timothy Ali`} href="/contact/" label="Get in touch" /></section>
</main>
<style>
.software-landing :global(.desk){min-height:calc(100svh - var(--s8));padding:var(--s4) var(--gutter) var(--s8);display:grid;grid-template-columns:120px minmax(0,1fr);gap:var(--s4);align-items:start}
.icons{display:flex;flex-direction:column;gap:var(--s3)}
.icons a{display:flex;flex-direction:column;align-items:center;gap:var(--s1);padding:var(--s1);color:inherit}
/* a product with its own colours shows its real icon's pair at rest (Gryphon: red on vellum, 0251) */
.glyph{width:72px;height:72px;display:grid;place-items:center;background:var(--mark-ground,var(--fg));color:var(--mark-ink,var(--paper));overflow:hidden}
.glyph .blackletter{font-size:86px;line-height:72px;transform:translate(var(--dx,0),var(--dy,0))}
.glyph svg{width:42px;height:42px}
/* optical centring: each letter's ink measured in its 72 (phone 48) box, moved by whole pixels to the middle */
.glyph [data-ch=T]{--dx:-1px}.glyph [data-ch=G]{--dy:1px}
.icons a[aria-current] .glyph,.icons a:active .glyph{background:var(--accent);color:var(--on-accent)}
.icons a[aria-current] .lbl{background:var(--accent);color:var(--on-accent);padding:0 var(--s1)}
@media(hover:hover){.icons a:not([aria-current]):hover .lbl{color:var(--accent-text)}}
/* Tome's accent on the page is the label's own colour, so its hover is the title links' underline (0254) */
@media(hover:hover){.icons a.ink:not([aria-current]):hover .lbl{text-decoration:underline;text-underline-offset:4px}}
.stack{position:relative;max-width:880px;width:100%;margin:var(--s4) auto 0;display:flex;flex-direction:column;gap:var(--s4)}
.ghost{display:none}
:global(html.js) .ghost{display:block;position:absolute;inset:0;transform:translate(calc(var(--i) * 32px),calc(var(--i) * -32px));opacity:calc(1 - var(--i) * .3);z-index:calc(3 - var(--i))}
:global(html.js) .win:not(.open){display:none}
.win{position:relative;z-index:5;scroll-margin-top:var(--s4)}
/* switching: the picked window comes forward from the first slot behind (a spring, 32px on the
   grid) and its screen arrives through the dither wipe (0100). Showing a window restarts both;
   motion off, nothing moves. The knockout is measured again when it lands. */
:global(.motion) .arrive .win.open{animation:win-forward 320ms cubic-bezier(.34,1.3,.5,1) both}
:global(.motion) .arrive .win.open .screen{animation:var(--wipe-in)}
@keyframes win-forward{from{transform:translate(var(--rise-x,32px),-32px)}to{transform:none}}
.title{display:flex;justify-content:space-between;gap:var(--s2);margin:0;padding:var(--s1) var(--s2);background:var(--accent);color:var(--on-accent)}
.title a{color:inherit}
@media(hover:hover){.title a:hover{text-decoration:underline;text-underline-offset:4px}}
.ghost .title{background:var(--paper);color:var(--fg)}
/* Tome's bar is ruled round in its panel's colour, like the game's own frames (0254) */
.win.ink .title{box-shadow:inset 0 0 0 2px var(--fg)}
.screen{padding:var(--s1) var(--s1) 0}
.tabs{list-style:none;margin:0;padding:var(--s6);aspect-ratio:16/9;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:var(--s1)}
.tabs li{padding:var(--pad-s);background:var(--paper);color:var(--fg)}.tabs li:first-child{background:var(--accent);color:var(--on-accent)}
.info{padding:var(--s3);display:flex;flex-direction:column;gap:var(--s1)}.info p{margin:0}
.info .body{max-width:60ch}
.links{display:flex;gap:var(--s1) var(--s2);flex-wrap:wrap;margin-top:var(--s1)} /* Sonde's three on one line in the narrowest window */
.end :global(.page-foot){margin-top:var(--s4);margin-bottom:var(--s4)}
/* One screen (0256): from 701px the desktop fills the window under the header, its foot is the
   footer's own line and height, and the open window takes the width its height leaves (440 is the
   header, the room the stack rises into, the bar, the words and the foot), down to 528 and up to 880.
   Tome's tabs are 16:9, so no window is taller than Sonde's: every one fits from 790 up (1440x790,
   a 13-inch MacBook's browser). Shorter than that, the page scrolls; phones always do, a window and its words being taller than one. */
@media(min-width:701px){
 .software-landing{display:flex;flex-direction:column;min-height:calc(100svh - var(--chrome-height))}
 .software-landing :global(.desk){flex:1 0 auto;min-height:0;padding-bottom:var(--s1)}
 .stack{max-width:clamp(528px,round(down,calc((100svh - 440px) * 1.5),8px),880px)}
 .end :global(.page-foot){margin:0;padding:var(--s2) 0 var(--s3)}
}
@media(max-width:700px){
 .software-landing :global(.desk){grid-template-columns:minmax(0,1fr);padding-top:var(--s3);padding-bottom:var(--s6)}
 .icons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--s1) var(--s2)} /* four across clips Tome at 390 */
 .icons a{flex-direction:row;gap:var(--s2);padding:0}
 :global(html.js) .ghost{display:none}
 .stack{--rise-x:0px} /* no stack to rise from on phones: straight down */
 .glyph{width:48px;height:48px}
 .glyph .blackletter{font-size:43px;line-height:48px}
 .glyph [data-ch=T]{--dx:0px} /* T sits within half a pixel at 43 */
 .stack{margin-top:0}
 .tabs{padding:var(--s3)}
 .info{padding:var(--s2)}
 .end :global(.page-foot){margin-top:0}
}
</style>
