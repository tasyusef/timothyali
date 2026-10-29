<script lang="ts">
  // The rail's last setting (0210; the app's DestinationPanel after design batch B): a Project
  // select and a Folder field. Neither can be chosen here; exports run in the app.
  import type { Snippet } from 'svelte';
  let { children }: { children?: Snippet } = $props();
  const id = $props.id();
</script>
<section class="rail-section">
  <div class="rail-head lbl dim"><span>Destination</span></div>
  <label class="project-row lbl"><span class="dim">Project</span><span class="select"><select class="field lbl" disabled><option>None</option></select></span></label>
  <div class="project-row lbl"><span class="dim" id={`${id}-folder`}>Folder</span><button type="button" class="field body dest-field" id={`${id}-choose`} aria-labelledby={`${id}-folder ${id}-choose`} disabled>Choose…</button></div>
  {#if children}<div class="dest-note">{@render children()}</div>{/if}
</section>
