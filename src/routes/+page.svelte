<script lang="ts">
  // Home as four stages held on the window (PX-54, Q41): the page stays still and the content
  // moves. The hero's name sinks into its sky, the statement types itself on the panel, Selected
  // work turns on a picker wheel, and the invitation's word comes out of the rain. Each stage
  // ends on the ground the next begins on. Motion off, no JavaScript and the prerender show each
  // section as plain content.
  import HeroStage from '$lib/components/home/HeroStage.svelte';
  import StatementStage from '$lib/components/home/StatementStage.svelte';
  import WorkWheel from '$lib/components/home/WorkWheel.svelte';
  import InviteStage from '$lib/components/home/InviteStage.svelte';
</script>
<svelte:head><title>Timothy Ali / Product designer who ships in code</title><meta name="description" content="Timothy Ali, product designer in Denver who ships in code. Interfaces, design systems, and front ends in TypeScript. Open to full-time and contract work." /></svelte:head>
<main id="main" tabindex="-1">
  <HeroStage />
  <StatementStage />
  <WorkWheel />
  <InviteStage />
</main>
