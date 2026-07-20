<script lang="ts">
	// Live Denver clock. Renders empty on the server (the site is prerendered)
	// and starts ticking client-side — tabular figures prevent width jitter.
	let { seconds = true }: { seconds?: boolean } = $props();

	const timeFormat = $derived(
		new Intl.DateTimeFormat('en-US', {
			timeZone: 'America/Denver',
			hour: 'numeric',
			minute: '2-digit',
			...(seconds ? { second: '2-digit' as const } : {}),
			hour12: true
		})
	);

	let now = $state('');

	$effect(() => {
		now = timeFormat.format(new Date());
		const id = setInterval(() => (now = timeFormat.format(new Date())), 1000);
		return () => clearInterval(id);
	});
</script>

<span class="data-swiss">{now}</span>
