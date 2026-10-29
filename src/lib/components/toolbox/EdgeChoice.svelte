<script lang="ts">
  // The app's Edges section (ui-kit `edge_choice.rs`): smooth or hard edges in what the tool
  // draws, with a note on what that covers; `fill` stretches the chips across the rail.
  let { hard, onchange, note, fill = false }: { hard: boolean; onchange: (hard: boolean) => void; note?: string; fill?: boolean } = $props();
</script>
<section class="rail-section tight">
  <div class="rail-head lbl dim"><span>Edges</span></div>
  <div class="chips lbl" class:fill role="group" aria-label="Edges">
    <button type="button" class="chip" aria-pressed={!hard} title="Anti-aliased edges" onclick={() => onchange(false)}>Smooth</button>
    <button type="button" class="chip" aria-pressed={hard} title="No anti-aliasing: each pixel fully on or off" onclick={() => onchange(true)}>Hard</button>
  </div>
  {#if note}<p class="lbl note dim">{note}</p>{/if}
</section>
