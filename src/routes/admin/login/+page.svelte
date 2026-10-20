<script lang="ts">
  import { signIn } from '@auth/sveltekit/client';
  import { page } from '$app/state';
  import Cta from '$lib/components/Cta.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  let { data } = $props();
  let email = $state(''); let sending = $state(false); let failed = $state(false);
  async function submit(event: SubmitEvent) {
    event.preventDefault(); sending = true; failed = false;
    try { await signIn('resend', { email, redirectTo: '/admin/' }); }
    catch { failed = true; sending = false; }
  }
</script>
<svelte:head><title>Admin sign-in / Timothy Ali</title><meta name="robots" content="noindex, nofollow" /></svelte:head>
<main id="main" tabindex="-1" class="inner-page login body">
  <p class="lbl">Private / Timothy Ali</p>
  <h1 class="display">Site admin.</h1>
  {#if !data.ready}
    <p>Sign-in setup is in progress. The dashboard is closed until it’s ready.</p>
  {:else if page.url.searchParams.has('sent')}
    <h2 class="display-s">Check your email.</h2>
    <p>Use the sign-in link within 15 minutes. Each link works once.</p>
    <QuietLink href="/admin/login/" label="Back to sign-in" dir="left" />
  {:else}
    <p>Sign in with your email. Access is limited to the site owner.</p>
    <form onsubmit={submit}>
      <label class="lbl" for="admin-email">Email address</label>
      <input id="admin-email" type="email" bind:value={email} autocomplete="email" required disabled={sending} />
      <Cta type="submit" disabled={sending}>{sending ? 'Sending…' : 'Email me a sign-in link'}</Cta>
    </form>
    {#if failed || page.url.searchParams.has('error')}<p role="alert">Couldn’t sign you in. Check your email address and try again in a minute. If your link has expired, request a new one.</p>{/if}
  {/if}
  <QuietLink href="/" label="Back to the site" />
</main>
<style>
  .login{width:100%;min-width:0;max-width:720px;min-height:70vh;padding:var(--s8) var(--gutter);margin:auto;display:flex;flex-direction:column;gap:var(--s4)}
  form{display:flex;flex-direction:column;gap:var(--s2)}
  input{font:inherit;padding:var(--s2);border:2px solid var(--fg);background:var(--paper);color:var(--fg);min-width:0;width:100%}
  form :global(.cta){align-self:flex-start}
</style>
