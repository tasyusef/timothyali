<script lang="ts">
  // The contact form (decision 0090). Three fields and a send block, posted to the
  // Vercel Function at /api/contact with fetch; without JavaScript the same form posts
  // there natively and comes back to ?sent=1 / ?error=. Fields are the body face on a
  // paper ground inside the ink panel; heights are on the unit (48 for a line, 8 + 4 × 32
  // + 8 for the message). Each field shows the site's block cursor at its insertion point
  // instead of the native caret (0092, `$lib/caret`). `company` is a honeypot the
  // function drops silently.
  import { page } from '$app/state';
  import Arrow from './Arrow.svelte';
  import { blockCaret } from '$lib/caret';
  let phase: 'idle' | 'sending' | 'sent' | 'error' = $state('idle');
  let reason = $state('');
  // The browser's own validation bubbles cannot be styled, so the form runs with
  // `novalidate` and says it in the site's voice: a note chip under the field that is
  // wrong, the first of them focused. `required` stays on the fields for what it means.
  let notes: Record<string, string> = $state({});
  const NEED: Record<string, (el: HTMLInputElement | HTMLTextAreaElement) => string> = {
    name: (el) => (el.value.trim() ? '' : 'A name, please.'),
    email: (el) => (!el.value.trim() ? 'An address I can reply to.' : el.validity.typeMismatch ? 'That address doesn’t parse.' : ''),
    message: (el) => (el.value.trim() ? '' : 'A line about what you’re building.')
  };
  function validate(form: HTMLFormElement) {
    const next: Record<string, string> = {}; let first: HTMLElement | null = null;
    for (const key of Object.keys(NEED)) { const el = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement; const n = NEED[key](el); if (n) { next[key] = n; first ??= el; } }
    notes = next; first?.focus(); return !first;
  }
  function clear(e: Event) { const key = (e.currentTarget as HTMLInputElement).name; if (notes[key]) { const { [key]: _, ...rest } = notes; notes = rest; } }
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
    if (!validate(form)) return;
    phase = 'sending';
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { accept: 'application/json' }, body: new FormData(form) });
      const body = await res.json().catch(() => ({ ok: false, error: 'send-failed' }));
      if (body.ok) { phase = 'sent'; form.reset(); } else { phase = 'error'; reason = body.error ?? 'send-failed'; }
    } catch { phase = 'error'; reason = 'network'; }
  }
</script>
<form id="contact-form" class="contact-form" action="/api/contact" method="post" novalidate onsubmit={submit} aria-describedby="contact-status">
  <label class="field"><span class="lbl dim">Name</span><span class="box"><input class="body" name="name" aria-invalid={notes.name ? 'true' : undefined} aria-describedby={notes.name ? 'name-note' : undefined} oninput={clear} type="text" autocomplete="name" required maxlength="120" use:blockCaret /><span class="cursor caret" aria-hidden="true"></span></span>{#if notes.name}<span class="lbl note" id="name-note">{notes.name}</span>{/if}</label>
  <label class="field"><span class="lbl dim">Email</span><span class="box"><input class="body" name="email" aria-invalid={notes.email ? 'true' : undefined} aria-describedby={notes.email ? 'email-note' : undefined} oninput={clear} type="email" autocomplete="email" required maxlength="200" use:blockCaret /><span class="cursor caret" aria-hidden="true"></span></span>{#if notes.email}<span class="lbl note" id="email-note">{notes.email}</span>{/if}</label>
  <label class="field"><span class="lbl dim">What you’re building</span><span class="box"><textarea class="body" name="message" aria-invalid={notes.message ? 'true' : undefined} aria-describedby={notes.message ? 'message-note' : undefined} oninput={clear} rows="4" required maxlength="5000" use:blockCaret></textarea><span class="cursor caret" aria-hidden="true"></span></span>{#if notes.message}<span class="lbl note" id="message-note">{notes.message}</span>{/if}</label>
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
input,textarea{display:block;width:100%;margin:0;border:0;border-radius:0;padding:var(--s1) var(--s2);background:var(--paper);color:var(--fg);font:inherit;resize:none;caret-color:transparent}
.box{position:relative;display:block}
.caret{position:absolute;margin:0;pointer-events:none}
input{height:48px}
textarea{height:144px} /* 8 + 4 lines of 32 + 8 */
input:focus-visible,textarea:focus-visible{outline:2px solid var(--accent);outline-offset:0}
.trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.send{display:flex;flex-direction:column;gap:var(--s2);margin-top:var(--s1)}
.send button{width:100%;text-align:left}
.send button:disabled{cursor:default;opacity:var(--dim)}
.note,.status{min-height:16px}
.note,.field .note{background:var(--accent);color:var(--on-accent);padding:var(--s1);align-self:flex-start;opacity:1}
.status.on{background:var(--accent);color:var(--on-accent);padding:var(--s1);align-self:flex-start}
</style>
