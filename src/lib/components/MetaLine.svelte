<script lang="ts">
  // The project metadata line, `[01] / 2024 / Brand`: the study share images' head (0183).
  import type { Project } from '$lib/work';
  let { project, class: klass = '' }: { project: Project; class?: string } = $props();
  const cls = $derived(['lbl', klass].filter(Boolean).join(' '));
</script>
<span class={cls}>[{project.n}] / {project.year} / {project.scope}</span>
