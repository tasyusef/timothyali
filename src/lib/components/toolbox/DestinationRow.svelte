<script lang="ts">
  // The rail's last setting in three tools (0210; written three times): no folder can be chosen here.
  import Arrow from '$lib/components/Arrow.svelte';
</script>
<section class="rail-section">
  <div class="rail-head lbl dim"><span>Destination</span></div>
  <button type="button" class="btn body dest" disabled><span class="nowrap">Choose where to save…</span><Arrow /></button>
</section>
