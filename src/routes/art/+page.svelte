<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ArtGrid from '$lib/components/ArtGrid.svelte';
	import { art } from '$lib/art';
</script>

<Seo
	title="Art"
	description="Art, prints, and photography by Timothy Ali — misc work outside the client case studies."
	ogKey="art"
/>

<div class="page-wrapper">
	<h1 class="sr-only">Art, prints & photography by Timothy Ali</h1>
	<!-- Header row -->
	<div
		class="entrance pb-row mb-section grid grid-cols-1 border-b border-[var(--color-border)] md:grid-cols-12"
	>
		<p class="label-swiss md:col-span-3" aria-hidden="true">Art</p>
	</div>

	<div class="entrance" style:--entrance-delay="100ms">
		<ArtGrid pieces={art} />
	</div>
</div>
