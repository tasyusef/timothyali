<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { TICK_SLOW, STEP_FAST } from '$lib/tokens';
  import { RESUME_URL } from '$lib/social';
</script>
<svelte:head><title>Get in touch / Timothy Ali</title><meta name="description" content="Tell me what you’re building. Timothy Ali is open to full-time roles, remote or in Denver, and to contract product, front-end, and brand work." /></svelte:head>
<!-- One screen, no scroll on a desktop (0173): the copy on the left over the giant rising from
     the foot of the window, the form on the right. Below 1101px the two stack and the page scrolls. -->
<main id="main" class="contact-main" tabindex="-1">
  <Band class="contact" mode="scene" shot="rise" seed={3} tick={TICK_SLOW} palette="scene" cell={8} px={1} lightAs="dither" hug pad={0} feather={3} depth={0.6} avoid=".contact h1 > span" clear=".contact-top .channel, .contact-foot .page-foot > *">
    <div class="contact-copy">
      <div class="contact-top lbl"><span>Let’s talk</span><span class="channel">Timothy Ali / Denver, CO</span></div>
      <h1><span class="display intro">Tell me what<br />you’re</span><span class="blackletter display-xl building"><Decode text="building." step={STEP_FAST} /></span></h1>
      <div class="contact-foot"><PageFoot note="Interface / motion / code" href="/work/" label="See my work" /></div>
    </div>
    <div class="contact-note">
      <p class="body">Hiring, or have a project in mind? I’d like to hear about it.</p>
      <p class="body signoff">I’m available for full-time roles and contract work, remotely or in Denver.</p>
      <ContactForm />
      <div class="contact-links">
        <QuietLink href={RESUME_URL} label="Resume (PDF)" class="lbl alt" />
        <QuietLink href="mailto:studio@timothyali.com" label="studio@timothyali.com" class="lbl alt" />
        <QuietLink href="https://linkedin.com/in/timothyali" label="Message me on LinkedIn" class="lbl alt" />
      </div>
    </div>
  </Band>
</main>
<style>
.contact-main{display:flex;flex-direction:column}
main :global(.contact){flex:1;position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) 448px;gap:var(--s4);padding-top:var(--s3);padding-bottom:var(--s3)}
.contact-copy{display:flex;flex-direction:column;justify-content:space-between;gap:var(--s4);min-width:0}
.contact-top{display:flex;justify-content:space-between;gap:var(--s2)}
.contact-top>span{padding:var(--s1)}
.contact-top>span:first-child{background:var(--accent);color:var(--on-accent)}
h1{display:flex;flex-direction:column;align-items:flex-start;gap:var(--s2);margin:0}
.intro{line-height:64px}
.building{font-size:258px;line-height:264px}
.contact-note{--accent-text:var(--accent-on-fg);align-self:end;background:var(--fg);color:var(--paper);padding:var(--s3);display:flex;flex-direction:column;gap:var(--s2)}
.contact-note .body{max-width:38ch;margin:0}
.contact-note :global(.cta-row){flex-wrap:nowrap}
.contact-note :global(.cta-row:hover),.contact-note :global(.cta-row:focus-visible){background:var(--paper);color:var(--fg)}
.contact-note :global(.cta-row:active){background:var(--accent);color:var(--on-accent)} /* press (0099) */
.contact-note :global(.alt){opacity:var(--dim)}
.contact-links{display:flex;flex-wrap:wrap;gap:var(--s1) var(--s3)}
/* to fit one screen: name and email share a row, the message is three lines */
.contact-note :global(.contact-form){display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:var(--s2)}
.contact-note :global(.contact-form>*:nth-child(n+3)){grid-column:1/-1}
.contact-note :global(textarea){height:112px}
.contact-foot :global(.page-foot){margin:0}
/* shorter laptop screens (800px tall): 32px less around and inside the form, so it still fits */
@media(min-width:1101px) and (max-height:860px){main :global(.contact){padding-top:var(--s2);padding-bottom:var(--s2)}.contact-note{padding:var(--s2)}}
@media(max-width:1300px){.building{font-size:172px;line-height:176px}.intro{font-size:41.25px;line-height:48px}}
@media(max-width:1100px){
  main :global(.contact){grid-template-columns:100%;gap:var(--s6)}
  .contact-copy{display:contents} /* stacked: label, heading, form, then the foot */
  .contact-note{order:1;align-self:stretch}
  .contact-foot{order:2}
}
@media(max-width:700px){
  main :global(.contact){padding-top:var(--s3);gap:var(--s4)}
  .channel{display:none}
  .building{font-size:129px;line-height:136px}
  .contact-note :global(.cta-row){padding:17px 14px 15px 16px;gap:var(--s2)}
  .contact-note :global(.contact-form){gap:var(--s1)}
}
@media(max-width:420px){.building{font-size:86px;line-height:88px}.contact-note{padding:var(--s2)}.contact-note :global(.contact-form){grid-template-columns:100%}}
</style>
