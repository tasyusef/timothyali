<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { TICK_FAST, STEP_FAST } from '$lib/tokens';
</script>
<svelte:head><title>Get in touch — Timothy Ali</title><meta name="description" content="Tell me what you’re building. Connect with designer Timothy Ali about brand, product, motion, and front-end work." /></svelte:head>
<main id="main" tabindex="-1">
  <Band class="contact" mode="fall" seed={3} density={0.55} tick={TICK_FAST} avoid=".contact h1 > span, .contact-foot">
    <div class="contact-top lbl"><span>Let’s talk</span><span class="channel">Timothy Ali / Denver, CO</span></div>
    <h1><span class="display intro">Tell me what<br />you’re</span><span class="blackletter display-xl building"><Decode text="building." step={STEP_FAST} /></span></h1>
    <div class="contact-bottom">
      <div class="signal" aria-hidden="true"><svg width="96" height="96" viewBox="0 0 12 12" shape-rendering="crispEdges"><path fill="currentColor" d="M1 1h1v7h7V7H8V6h1v1h1v1h1v1h-1v1H9v1H8v-1h1V9H1z" /></svg></div>
      <div class="contact-note">
        <p class="body">Got an idea, an early team, or something that needs a designer?</p>
        <p class="body signoff">I’d like to hear about it.</p>
        <ContactForm />
        <QuietLink href="https://linkedin.com/in/timothyali" label="Or message me on LinkedIn" class="lbl alt" />
      </div>
    </div>
    <div class="contact-foot"><PageFoot note="Brand / product / motion / front end" href="/work/" label="See my work" /></div>
  </Band>
</main>
<style>
main :global(.contact){position:relative;isolation:isolate;overflow:hidden;padding-top:var(--s6);padding-bottom:var(--s4)}
.contact-top{display:flex;justify-content:space-between;gap:var(--s2);margin-bottom:var(--s6)}
.contact-top>span{background:var(--paper);padding:var(--s1)}
.contact-top>span:first-child{background:var(--accent);color:var(--on-accent)}
h1{display:grid;grid-template-columns:1fr 1fr;gap:var(--s2) var(--s4)}
.intro{grid-column:1;line-height:64px}
.building{grid-column:1/-1;justify-self:center;font-size:344px;line-height:344px}
.contact-bottom{display:grid;grid-template-columns:1fr 1fr;gap:var(--s4);align-items:end;margin-top:var(--s2)}
.signal{align-self:stretch;display:flex;align-items:flex-end;padding:var(--s4);color:var(--accent-text)}
.signal svg{display:block}
.contact-note{background:var(--fg);color:var(--paper);padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)}
.contact-note .body{max-width:38ch}
.contact-note :global(.cta-row){flex-wrap:nowrap}
.contact-note :global(.cta-row:hover),.contact-note :global(.cta-row:focus-visible){background:var(--paper);color:var(--fg)}
.contact-note :global(.alt){opacity:var(--dim)}
.contact-bottom{align-items:start}
.contact-foot :global(.page-foot){margin-top:var(--s6)}
@media(max-width:1100px){.building{font-size:258px;line-height:264px}.intro{font-size:41.25px;line-height:48px}}
@media(max-width:900px){.contact-bottom{grid-template-columns:1fr 2fr}.building{font-size:172px;line-height:176px}.intro{grid-column:1/-1}}
@media(max-width:700px){
  main :global(.contact){padding-top:var(--s4)}
  .contact-top{margin-bottom:var(--s4)}.channel{display:none}
  h1{display:flex;flex-direction:column;gap:var(--s2)}
  .intro{font-size:41.25px;line-height:48px}
  .building{align-self:flex-start;font-size:129px;line-height:136px}
  .contact-bottom{grid-template-columns:1fr;margin-top:var(--s4)}
  .signal{display:none}.contact-note{padding:var(--s3);gap:var(--s2)}
  .contact-note :global(.cta-row){padding:var(--s2);gap:var(--s2)}
  .contact-note :global(.contact-form){gap:var(--s1)}
}
@media(max-width:420px){.building{font-size:86px;line-height:88px}.contact-note{padding:var(--s2)}}
</style>
