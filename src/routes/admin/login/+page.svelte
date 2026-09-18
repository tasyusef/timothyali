<script lang="ts">
  import { signIn } from '@auth/sveltekit/client';
  import { page } from '$app/state';
  let { data } = $props();
  let email = $state(''); let sending = $state(false); let failed = $state(false);
  async function submit(event: SubmitEvent) {
    event.preventDefault(); sending = true; failed = false;
    try { await signIn('resend', { email, redirectTo: '/admin/' }); }
    catch { failed = true; sending = false; }
  }
</script>
<svelte:head><title>Admin sign-in — Timothy Ali</title><meta name="robots" content="noindex, nofollow" /></svelte:head>
<main id="main" tabindex="-1" class="inner-page login body">
  <p class="lbl">Private / Timothy Ali</p>
  <h1 class="display">Site admin.</h1>
  {#if !data.ready}
    <p>Sign-in setup is in progress. The dashboard is closed until it’s ready.</p>
  {:else if page.url.searchParams.has('sent')}
    <h2 class="display-s">Check your email.</h2>
    <p>Use the sign-in link within 15 minutes. Each link works once.</p>
    <a href="/admin/login/">Back to sign-in</a>
  {:else}
    <p>Sign in with your email. Access is limited to the site owner.</p>
    <form onsubmit={submit}>
      <label class="lbl" for="admin-email">Email address</label>
      <input id="admin-email" type="email" bind:value={email} autocomplete="email" required disabled={sending} />
      <button class="lbl" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Email me a sign-in link'}</button>
    </form>
    {#if failed || page.url.searchParams.has('error')}<p role="alert">We couldn’t sign you in. Check your email address and try again in a minute, or request a fresh link if yours has expired.</p>{/if}
  {/if}
  <a class="lbl" href="/">Back to the site ↗</a>
</main>
<style>
  .login{width:100%;min-width:0;max-width:720px;min-height:70vh;padding:var(--s8) var(--gutter);margin:auto;display:flex;flex-direction:column;gap:var(--s4)}
  form{display:flex;flex-direction:column;gap:var(--s2)}
  input{font:inherit;padding:var(--s2);border:2px solid var(--fg);background:var(--paper);color:var(--fg);min-width:0;width:100%}
  button{padding:var(--s2);min-height:48px;background:var(--accent);color:var(--on-accent);cursor:pointer;text-align:left}
  button:disabled{opacity:.6;cursor:wait}a{text-decoration:underline;text-underline-offset:4px}
</style>
