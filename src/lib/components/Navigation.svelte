<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { crossfade } from 'svelte/transition';
	import { NAV_LINKS, NAV_LINK_COLUMNS, isActiveLink } from '$lib/nav';
	import { duration, easeSwiss } from '$lib/motion';
	import { focusTrap } from '$lib/actions/focusTrap';
	import ThemeToggle from './ThemeToggle.svelte';

	let mobileOpen = $state(false);

	const pathname = $derived(page.url.pathname);

	// Sliding underline between active desktop links (the old layoutId pattern)
	const [send, receive] = crossfade({
		duration: duration.page,
		easing: easeSwiss,
		fallback: (node) => fade(node, { duration: duration.fast, easing: easeSwiss })
	});
</script>

<!-- The nav owns its own bottom rule, so every page gets the same bounded band
     instead of the homepage hero supplying a border-t of its own. -->
<nav
	aria-label="Main navigation"
	class="z-nav px-swiss relative border-b border-[var(--color-border)] py-4 md:py-5"
>
	<div class="flex items-center justify-between md:grid md:grid-cols-12">
		<a href="/" class="label-swiss text-[var(--color-foreground)] md:col-span-3">Timothy Ali</a>

		<!-- Desktop nav -->
		{#each NAV_LINKS as link, i (link.href)}
			{@const isActive = isActiveLink(link.href, pathname)}
			<a
				href={link.href}
				aria-current={isActive ? 'page' : undefined}
				class="label-swiss hover-swiss relative hidden md:inline-flex {NAV_LINK_COLUMNS[
					i
				]} md:col-span-1 {isActive ? 'text-[var(--color-foreground)]' : ''}"
			>
				{#if isActive}
					<span
						in:receive={{ key: 'nav-underline' }}
						out:send={{ key: 'nav-underline' }}
						class="absolute right-0 bottom-0 left-0 h-px bg-[var(--color-foreground)]"
					></span>
				{/if}
				<span class="z-dropdown relative">{link.label}</span>
			</a>
		{/each}
		<div class="hidden justify-end md:col-span-1 md:col-start-12 md:flex">
			<ThemeToggle />
		</div>

		<!-- Mobile hamburger + theme toggle -->
		<div class="flex items-center gap-2 md:hidden">
			<ThemeToggle />
			<button
				type="button"
				class="flex flex-col gap-1.5 p-2"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label="Toggle menu"
				aria-expanded={mobileOpen}
				aria-controls="mobile-nav"
			>
				<span class="hamburger-line {mobileOpen ? 'rotate-45' : ''}" style:--y="3.5px"></span>
				<span class="hamburger-line {mobileOpen ? '-rotate-45' : ''}" style:--y="-3.5px"></span>
			</button>
		</div>
	</div>

	<!-- Mobile full-screen overlay -->
	{#if mobileOpen}
		<div
			id="mobile-nav"
			role="dialog"
			aria-modal="true"
			aria-label="Navigation menu"
			transition:fade={{ duration: duration.fast, easing: easeSwiss }}
			use:focusTrap={{ onEscape: () => (mobileOpen = false) }}
			class="z-nav px-swiss fixed inset-0 flex flex-col justify-center bg-[var(--color-background)]"
		>
			<button
				type="button"
				class="absolute top-6 right-[var(--spacing-section)] flex flex-col gap-1.5 p-2"
				onclick={() => (mobileOpen = false)}
				aria-label="Close menu"
			>
				<span class="hamburger-line rotate-45" style:--y="3.5px"></span>
				<span class="hamburger-line -rotate-45" style:--y="-3.5px"></span>
			</button>
			<div class="flex flex-col items-end gap-6 text-right">
				{#each NAV_LINKS as link (link.href)}
					{@const isActive = isActiveLink(link.href, pathname)}
					<a
						href={link.href}
						onclick={() => (mobileOpen = false)}
						aria-current={isActive ? 'page' : undefined}
						class="heading-swiss hover-swiss text-headline inline-block pb-[0.1em] {isActive
							? 'border-b border-[var(--color-foreground)] text-[var(--color-foreground)]'
							: 'border-b border-transparent text-[var(--color-muted)]'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>

<style>
	.hamburger-line {
		display: block;
		width: 1.25rem;
		height: 1px;
		background: var(--color-foreground);
		transition: transform var(--duration-fast) var(--ease-swiss);
	}

	.hamburger-line.rotate-45 {
		transform: translateY(var(--y)) rotate(45deg);
	}

	.hamburger-line.-rotate-45 {
		transform: translateY(var(--y)) rotate(-45deg);
	}
</style>
