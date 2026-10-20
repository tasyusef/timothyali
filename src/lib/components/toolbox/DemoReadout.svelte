<script lang="ts">
  // The readout strip over each example (0210; written four times): the tool's folder, a count.
  let { path, count }: { path: string; count: string } = $props();
</script>
<div class="demo-readout lbl"><span class="demo-path"><span class="pre">~/Toolbox/</span>{path}</span><span>{count}</span></div>
