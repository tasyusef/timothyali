<script lang="ts">
  // One row of the export tree, recursing into its children (the app's `lockup/PlanRow`,
  // without the file thumbnails). Versions open, PRINT/WEB closed until clicked; the
  // expansion sets live with the tree's owner so they survive a rebuild of the plan.
  import type { SvelteSet } from 'svelte/reactivity';
  import PlanRow from './PlanRow.svelte';
  import SwatchDot from './SwatchDot.svelte';
  import { type PlanNode, isFile } from './plan';
  let { node, depth, userExpanded, userCollapsed, palette }: { node: PlanNode; depth: number; userExpanded: SvelteSet<string>; userCollapsed: SvelteSet<string>; palette: string[] } = $props();
  const defaultExpandDepth = 2;
  const expanded = $derived(userExpanded.has(node.id) ? true : userCollapsed.has(node.id) ? false : depth < defaultExpandDepth);
  const swatches = $derived.by((): string[] => {
    if (node.name === 'Black') return ['#000000'];
    if (node.name === 'White') return ['#FFFFFF'];
    if (node.name.includes('Color')) return palette;
    return [];
  });
  const toggle = (): void => {
    if (expanded) { userExpanded.delete(node.id); userCollapsed.add(node.id); }
    else { userCollapsed.delete(node.id); userExpanded.add(node.id); }
  };
</script>
{#if isFile(node)}
  <div class="tree-row" style:padding-left={`${depth * 16}px`}><span class="mono"></span><span class="body name dim">{node.name}</span></div>
{:else}
  <button type="button" class="tree-row" onclick={toggle} aria-expanded={expanded} style:padding-left={`${depth * 16}px`}>
    <span class="mono dim" aria-hidden="true">{expanded ? 'v' : '>'}</span>
    <span class="lbl name" class:dim={depth !== 1}>{node.name}/</span>
    {#if swatches.length}<span style="display:inline-flex;gap:4px">{#each swatches as hex, i (`${hex}-${i}`)}<SwatchDot {hex} size={16} />{/each}</span>{/if}
    <span class="lbl dim">{node.fileCount}</span>
  </button>
  {#if expanded}{#each node.children as child (child.id)}<PlanRow node={child} depth={depth + 1} {userExpanded} {userCollapsed} {palette} />{/each}{/if}
{/if}
