<script lang="ts">
  // A label with a counter opposite it. `row` sits the two on one baseline
  // (Home's `Selected work / 01–04`); `column` stacks them right-aligned and
  // becomes a row again below 700px (Work's header index, decision 0068).
  let { label, value, accent = false, layout = 'row', class: klass = '' }:
    { label: string; value: string; accent?: boolean; layout?: 'row' | 'column'; class?: string } = $props();
  const cls = $derived(['index-row', `index-row-${layout}`, 'lbl', klass].filter(Boolean).join(' '));
</script>
<div class={cls}><span>{label}</span><span class={accent ? 'index-value accent' : 'index-value'}>{value}</span></div>
