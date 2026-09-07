<script lang="ts">
	// The site's hero scatter behind the whole case study: LivingTexture on a fixed,
	// full-viewport layer. Content sits above it (parc-theme.css lifts .cs to z-index 1
	// and lets pointer events fall through to the ground between elements), so the
	// cursor sparks wherever it crosses bare white, the way it does on parcxrpl.com.
	import LivingTexture from './LivingTexture.svelte';
</script>

<div class="fixed inset-0 z-0" aria-hidden="true">
	<LivingTexture class="block h-full w-full" />
</div>
