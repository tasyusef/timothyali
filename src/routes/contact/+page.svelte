<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import BuildingHead from '$lib/components/BuildingHead.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { RESUME_URL, EMAIL, LINKEDIN } from '$lib/site';
</script>
<!-- One screen, no scroll on a desktop (0173): the copy on the left over the giant rising from
     the foot of the window, the form on the right. Below 1101px the two stack and the page scrolls. -->
<main id="main" class="fill-main" tabindex="-1">
  <Band class="contact" mode="scene" shot="rise" seed={3} avoid=".contact h1 > span" clear=".contact-foot .page-foot > *">
    <div class="contact-head"><BuildingHead level="h1" tight /></div>
    <div class="contact-note panel">
      <p class="body">Hiring, or have a project in mind? I’d like to hear about it.</p>
      <p class="body signoff">I’m available for full-time roles and contract work, remotely or in Denver.</p>
      <ContactForm />
      <div class="contact-links">
        <QuietLink href={RESUME_URL} label="Resume (PDF)" class="dim" />
        <QuietLink href={`mailto:${EMAIL}`} label={EMAIL} class="dim" />
        <QuietLink href={LINKEDIN} label="Message me on LinkedIn" class="dim" />
      </div>
    </div>
    <!-- after the form in the markup, so Tab reaches it after the form at every width (PX-128); the grid puts it under the headline on a desktop -->
    <div class="contact-foot"><PageFoot note="Interfaces / brands / websites" href="/work/" label="See my work" /></div>
  </Band>
</main>
<style>
main :global(.contact){display:grid;grid-template-columns:minmax(0,1fr) var(--col-side);grid-template-rows:auto minmax(0,1fr);grid-template-areas:"head note" "foot note";gap:var(--s4);padding-top:var(--s6);padding-bottom:var(--s3)} /* s6 at the top: the label row above the headline is gone (0189) */
.contact-head{grid-area:head;min-width:0}
.contact-foot{grid-area:foot;align-self:end;min-width:0}
.contact-note{grid-area:note;align-self:end;padding:var(--s3);display:flex;flex-direction:column;gap:var(--s2)}
.contact-note .body{max-width:38ch;margin:0}
.contact-note :global(.cta-row){flex-wrap:nowrap}
.contact-links{display:flex;flex-wrap:wrap;gap:var(--s1) var(--s3)}
.contact-links :global(.quiet-link){flex-wrap:wrap;max-width:100%} /* at 320 the address fills the line and the arrow drops under it, not past the panel (PX-128) */
@media(pointer:coarse){.contact-links{gap:var(--s3)}} /* room for each link's 40px reach (0206) */
/* to fit one screen: name and email share a row, the message is three lines */
.contact-note :global(.contact-form){display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:var(--s2)}
.contact-note :global(.contact-form>*:nth-child(n+3)){grid-column:1/-1}
.contact-note :global(textarea){height:112px}
.contact-foot :global(.page-foot){margin:0}
/* shorter laptop screens (800px tall): 32px less around and inside the form, so it still fits */
@media(min-width:1101px) and (max-height:860px){main :global(.contact){padding-top:var(--s2);padding-bottom:var(--s2)}.contact-note{padding:var(--s2)}}
@media(max-width:1100px){
  main :global(.contact){grid-template-columns:100%;grid-template-rows:none;grid-template-areas:"head" "note" "foot";gap:var(--s6)} /* stacked: heading, form, then the foot */
  .contact-note{align-self:stretch}
}
@media(max-width:700px){
  main :global(.contact){padding-top:var(--s3);gap:var(--s4)}
    .contact-foot{display:none} /* the scope line and “See my work” repeat the nav (0188) */
  .contact-note :global(.cta-row){padding:var(--pad-m);gap:var(--s2)}
  .contact-note :global(.contact-form){gap:var(--s1)}
}
@media(max-width:420px){.contact-note{padding:var(--s2)}.contact-note :global(.contact-form){grid-template-columns:100%}}
</style>
