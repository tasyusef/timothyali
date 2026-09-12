<script lang="ts">
  // One tool's screen, in miniature: the readout strip, the stage beside the rail, the
  // bottom bar. Each example is the app's own layout for that tool with its real
  // settings, and the numbers it shows (file counts, folder trees, generated text,
  // encoded sizes) come from the same rules the app runs (0095). Nothing exports.
  import './demo.css';
  import LockupDemo from './LockupDemo.svelte';
  import PaletteDemo from './PaletteDemo.svelte';
  import SpecimenDemo from './SpecimenDemo.svelte';
  import ConvertDemo from './ConvertDemo.svelte';
  let { tool = 'lockup' }: { tool: string } = $props();
</script>
<div class="demo">
  {#if tool === 'lockup'}<LockupDemo />{:else if tool === 'palette'}<PaletteDemo />{:else if tool === 'specimen'}<SpecimenDemo />{:else}<ConvertDemo />{/if}
</div>
