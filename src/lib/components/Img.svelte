<script lang="ts">
	import { getImage } from '$lib/images';

	interface Props {
		src: string;
		alt: string;
		sizes?: string;
		/** Load eagerly with high fetch priority (above-the-fold heroes). */
		eager?: boolean;
		class?: string;
	}

	let { src, alt, sizes, eager = false, class: className }: Props = $props();

	const image = $derived(getImage(src));
</script>

<enhanced:img
	src={image}
	{alt}
	{sizes}
	loading={eager ? 'eager' : 'lazy'}
	fetchpriority={eager ? 'high' : 'auto'}
	class={className}
/>
