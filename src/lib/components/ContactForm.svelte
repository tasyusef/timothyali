<script lang="ts">
  // The contact form (decision 0090). Three fields and a send block, posted to the
  // contact route at /api/contact with fetch; without JavaScript the same form posts
  // there natively and comes back to ?sent=1 / ?error=. Fields are the body face on a
  // paper ground inside the ink panel; heights are on the unit (48 for a line, 8 + 4 × 32
  // + 8 for the message). Each field shows the site's block cursor at its insertion point
  // instead of the native caret (0092, `$lib/caret`). `hp_check` is a honeypot the
  // function drops silently.
  import { page } from '$app/state';
  import Arrow from './Arrow.svelte';
  import Cta from './Cta.svelte';
  import { blockCaret } from '$lib/caret';
  import Cursor from './Cursor.svelte';
  import { EMAIL as ADDRESS, LIMITS, EMAIL_PATTERN as EMAIL } from '$lib/site';
  let phase: 'idle' | 'sending' | 'sent' | 'error' = $state('idle');
  let reason = $state('');
  // The browser's own validation bubbles cannot be styled, so the form runs with
  // `novalidate` and says it in the site's voice: a note chip under the field that is
  // wrong, the first of them focused. `required` stays on the fields for what it means.
  // The note sits outside the <label>, so the field's name stays “Email” and the note is
  // only its description; inside, a reader heard it twice (PX-128).
  let notes: Record<string, string> = $state({});
  // EMAIL is the function's own pattern ($lib/shared.js), so the field says what is wrong before the server does
  const NEED: Record<string, (el: HTMLInputElement | HTMLTextAreaElement) => string> = {
    name: (el) => (el.value.trim() ? '' : 'Enter your name.'),
    email: (el) => (!el.value.trim() ? 'Enter an email address I can reply to.' : !EMAIL.test(el.value.trim()) ? 'Enter an email address like name@example.com.' : ''),
    message: (el) => (el.value.trim() ? '' : 'Tell me about the role or project.')
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
    invalid: 'Check your name, email address, and message.',
    unconfigured: `The form is unavailable. Email ${ADDRESS} directly.`,
    'send-failed': `Your message didn’t send. Try again, or email ${ADDRESS}.`,
    'rate-limited': `That’s a lot of messages at once. Wait a few minutes, or email ${ADDRESS}.`,
    network: `Couldn’t send your message. Check your connection and try again, or email ${ADDRESS}.`
  };
  // Cmd/Ctrl+Enter in the message sends, as it does in mail (PX-125)
  function sendKey(e: KeyboardEvent) { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); (e.currentTarget as HTMLTextAreaElement).form?.requestSubmit(); } }
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (phase === 'sending' || !validate(form)) return;
    phase = 'sending';
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { accept: 'application/json' }, body: new FormData(form) });
      const body = await res.json().catch(() => ({ ok: false, error: 'send-failed' }));
      if (body.ok) { phase = 'sent'; form.reset(); } else { phase = 'error'; reason = body.error ?? 'send-failed'; }
    } catch { phase = 'error'; reason = 'network'; }
  }
</script>
<form id="contact-form" class="contact-form" action="/api/contact" method="post" novalidate onsubmit={submit} aria-describedby="contact-status">
  <div class="field"><label class="lbl dim" for="contact-name">Name</label><span class="box"><input class="body" id="contact-name" name="name" aria-invalid={notes.name ? 'true' : undefined} aria-describedby={notes.name ? 'name-note' : undefined} oninput={clear} type="text" autocomplete="name" autocapitalize="words" required maxlength={LIMITS.name} use:blockCaret /><Cursor class="caret" /></span>{#if notes.name}<span class="lbl note" id="name-note">{notes.name}</span>{/if}</div>
  <div class="field"><label class="lbl dim" for="contact-email">Email</label><span class="box"><input class="body" id="contact-email" name="email" aria-invalid={notes.email ? 'true' : undefined} aria-describedby={notes.email ? 'email-note' : undefined} oninput={clear} type="email" autocomplete="email" required maxlength={LIMITS.email} use:blockCaret /><Cursor class="caret" /></span>{#if notes.email}<span class="lbl note" id="email-note">{notes.email}</span>{/if}</div>
  <div class="field"><label class="lbl dim" for="contact-message">Your message</label><span class="box"><textarea class="body" id="contact-message" name="message" enterkeyhint="enter" aria-invalid={notes.message ? 'true' : undefined} aria-describedby={notes.message ? 'message-note' : undefined} oninput={clear} onkeydown={sendKey} rows="4" required maxlength={LIMITS.message} use:blockCaret></textarea><Cursor class="caret" /></span>{#if notes.message}<span class="lbl note" id="message-note">{notes.message}</span>{/if}</div>
  <label class="trap" aria-hidden="true"><span>Leave this empty</span><input name="hp_check" type="text" tabindex="-1" autocomplete="off" /></label>
  <div class="send">
    <!-- aria-disabled, not disabled: a disabled button drops the keyboard focus that pressed it (PX-125) -->
    <Cta variant="row" type="submit" aria-disabled={phase === 'sending' ? 'true' : undefined}><span>{phase === 'sending' ? 'Sending' : 'Send'}</span><Arrow /></Cta>
    <!-- without JavaScript the function redirects to one of these and :target shows it (0206) -->
    <p id="contact-sent" class="lbl status on nojs">Sent. I’ll reply from {ADDRESS}.</p>
    <p id="contact-failed" class="lbl status on nojs">Your message didn’t send. Try again, or email {ADDRESS}.</p>
    <p id="contact-status" class="lbl status" class:on={phase === 'sent' || phase === 'error'} aria-live="polite">
      {#if phase === 'sent'}Sent. I’ll reply from {ADDRESS}.{:else if phase === 'error'}{NOTE[reason] ?? NOTE['send-failed']}{/if}
    </p>
  </div>
</form>
<style>
.contact-form{display:flex;flex-direction:column;gap:var(--s2)}
.field{display:flex;flex-direction:column;gap:var(--s1)}
input,textarea{display:block;width:100%;margin:0;border:0;border-radius:0;padding:var(--s1) var(--s2);background:var(--paper);color:var(--fg);font:inherit;resize:none}
/* the block caret is JavaScript's: without it the native caret stays and no caret block shows (0206) */
:global(html.js) input,:global(html.js) textarea{caret-color:transparent}
:global(html:not(.js)) .box :global(.caret){display:none}
.nojs{display:none}.nojs:target{display:block}:global(html.js) .nojs{display:none}
.box{position:relative;display:block}
.box :global(.caret){position:absolute;margin:0;pointer-events:none}
input{height:48px}
textarea{height:144px} /* 8 + 4 lines of 32 + 8 */
.trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.send{display:flex;flex-direction:column;gap:var(--s2);margin-top:var(--s1)}
.note,.status{min-height:16px}
.note,.field .note{background:var(--accent);color:var(--on-accent);padding:var(--s1);align-self:flex-start;opacity:1}
.status.on{background:var(--accent);color:var(--on-accent);padding:var(--s1);align-self:flex-start}
</style>
