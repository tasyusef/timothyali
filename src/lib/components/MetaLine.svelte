<script lang="ts">
  // The project metadata line. Full: `[01] / 2024 / Brand` (Work rows, study head).
  // `short`: `01 / Brand` (Home cards).
  import type { Project } from '$lib/work';
  let { project, short = false, class: klass = '' }:
    { project: Project; short?: boolean; class?: string } = $props();
  const cls = $derived(['lbl', klass].filter(Boolean).join(' '));
</script>
<span class={cls}>{#if short}{project.n} / {project.scope}{:else}[{project.n}] / {project.year} / {project.scope}{/if}</span>
