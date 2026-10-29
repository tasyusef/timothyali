<script lang="ts">
  // Copy for a command or a block of code (PX-128). “Copy” reads “Copied” for two seconds and a
  // polite status says it once. A refused clipboard says so and stays until the next press, as
  // the Toolbox send link does. Without JavaScript it would do nothing, so it isn't shown.
  // `name` finishes the button's name for a reader (“Copy Example command”); the visible word stays first.
  let { text, name = '' }: { text: string; name?: string } = $props();
  let said = $state('');
  let timer: ReturnType<typeof setTimeout> | undefined;
  async function copy() {
    clearTimeout(timer);
    try { await navigator.clipboard.writeText(text); said = 'Copied'; timer = setTimeout(() => (said = ''), 2000); }
    catch { said = 'Couldn’t copy'; }
  }
</script>
<button type="button" class="copy lbl" class:done={said === 'Copied'} onclick={copy}>{said || 'Copy'}{#if name}<span class="sr-only"> {name}</span>{/if}</button><span class="sr-only" role="status">{said}</span>
<style>
/* a label-face block that lights on hover and presses to the accent like every block (0099);
   on the ink plate it lights to paper, on a paper plate to ink */
.copy{flex:none;padding:var(--pad-s);user-select:none;-webkit-user-select:none;white-space:nowrap;cursor:pointer}
:global(html:not(.js)) .copy{display:none}
@media(hover:hover){.copy:not(.done):hover{background:var(--paper);color:var(--fg)}:global(.command-plate) .copy:not(.done):hover{background:var(--fg);color:var(--paper)}}
.copy:is(:active,.done),.copy:is(:active,.done):hover,:global(.command-plate) .copy:is(:active,.done):hover{background:var(--accent);color:var(--on-accent)}
</style>
