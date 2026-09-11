<script lang="ts">
  // The contact form (decision 0090). Three fields and a send block, posted to the
  // Vercel Function at /api/contact with fetch; without JavaScript the same form posts
  // there natively and comes back to ?sent=1 / ?error=. Fields are the body face on a
  // paper ground inside the ink panel; heights are on the unit (48 for a line, 8 + 4 × 32
  // + 8 for the message). `company` is a honeypot the function drops silently.
  import { page } from '$app/state';
  import Arrow from './Arrow.svelte';
  let phase: 'idle' | 'sending' | 'sent' | 'error' = $state('idle');
  let reason = $state('');
  $effect(() => {
    const q = page.url.searchParams;
    if (q.get('sent')) phase = 'sent';
    else if (q.get('error')) { phase = 'error'; reason = q.get('error') ?? ''; }
  });
  const NOTE: Record<string, string> = {
    invalid: 'Check the fields — a name, an address that works, and a message.',
    unconfigured: 'The relay isn’t set up yet. Email studio@timothyali.com directly.',
    'send-failed': 'The mail didn’t go through. Try again, or email studio@timothyali.com.',
    network: 'No connection. Try again, or email studio@timothyali.com.'
  };
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    phase = 'sending';
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { accept: 'application/json' }, body: new FormData(form) });
      const body = await res.json().catch(() => ({ ok: false, error: 'send-failed' }));
      if (body.ok) { phase = 'sent'; form.reset(); } else { phase = 'error'; reason = body.error ?? 'send-failed'; }
    } catch { phase = 'error'; reason = 'network'; }
  }
</script>
<form id="contact-form" class="contact-form" action="/api/contact" method="post" onsubmit={submit} aria-describedby="contact-status">
  <label class="field"><span class="lbl dim">Name</span><input class="body" name="name" type="text" autocomplete="name" required maxlength="120" /></label>
  <label class="field"><span class="lbl dim">Email</span><input class="body" name="email" type="email" autocomplete="email" required maxlength="200" /></label>
  <label class="field"><span class="lbl dim">What you’re building</span><textarea class="body" name="message" rows="4" required maxlength="5000"></textarea></label>
  <label class="trap" aria-hidden="true"><span>Company</span><input name="company" type="text" tabindex="-1" autocomplete="off" /></label>
  <div class="send">
    <button class="cta-row lbl" type="submit" disabled={phase === 'sending'}><span>{phase === 'sending' ? 'Sending' : 'Send'}</span><Arrow /></button>
    <p id="contact-status" class="lbl status" class:on={phase === 'sent' || phase === 'error'} aria-live="polite">
      {#if phase === 'sent'}Sent. I’ll reply from studio@timothyali.com.{:else if phase === 'error'}{NOTE[reason] ?? NOTE['send-failed']}{/if}
    </p>
  </div>
</form>
<style>
.contact-form{display:flex;flex-direction:column;gap:var(--s2)}
.field{display:flex;flex-direction:column;gap:var(--s1)}
.field .lbl{opacity:var(--dim)}
input,textarea{display:block;width:100%;margin:0;border:0;border-radius:0;padding:var(--s1) var(--s2);background:var(--paper);color:var(--fg);font:inherit;resize:none}
input{height:48px}
textarea{height:144px} /* 8 + 4 lines of 32 + 8 */
input:focus-visible,textarea:focus-visible{outline:2px solid var(--accent);outline-offset:0}
.trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.send{display:flex;flex-direction:column;gap:var(--s2);margin-top:var(--s1)}
.send button{width:100%;text-align:left}
.send button:disabled{cursor:default;opacity:var(--dim)}
.status{min-height:16px}
.status.on{background:var(--accent);color:var(--on-accent);padding:var(--s1);align-self:flex-start}
</style>
