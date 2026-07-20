<script lang="ts">
	import { commandMenu } from '$lib/commandMenu.svelte';
</script>

<button
	type="button"
	onclick={() => commandMenu.show()}
	aria-label="Open command menu"
	class="panel-swiss data-swiss text-caption-size hover-swiss px-1.5 py-0.5 text-[var(--color-muted)]"
>
	&#8984;K
</button>
