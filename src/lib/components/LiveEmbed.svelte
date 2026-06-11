<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		label: string;
		description: string;
		href: string;
		src: string;
		title: string;
	}

	let { label, description, href, src, title }: Props = $props();
</script>

<div use:reveal class="mb-section mt-section">
	<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-0">
		<p class="label-swiss md:col-span-3">{label}</p>
		<div class="md:col-span-5 md:col-start-7">
			<p class="leading-body">{description}</p>
			<a
				{href}
				target="_blank"
				rel="noopener noreferrer"
				class="label-swiss hover-swiss mt-4 inline-block underline underline-offset-4"
			>
				Open full site &rarr;
			</a>
		</div>
	</div>
	<div class="overflow-hidden border border-[var(--color-border)]">
		<iframe
			{src}
			{title}
			class="bg-page h-[70vh] w-full md:h-[90vh]"
			loading="lazy"
			sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
		></iframe>
	</div>
</div>
