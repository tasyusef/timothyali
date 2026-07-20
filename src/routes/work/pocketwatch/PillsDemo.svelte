<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	// The ten real category accents from the Pocketwatch design system
	// (dark-mode values from its tokens file). Product content colors,
	// not site tokens.
	const HUES = [
		{ name: 'Mint', hex: '#29cd93' },
		{ name: 'Sky', hex: '#38bdf8' },
		{ name: 'Lavender', hex: '#b49dff' },
		{ name: 'Rose', hex: '#fe7bbf' },
		{ name: 'Peach', hex: '#ef9a00' },
		{ name: 'Butter', hex: '#d2ab00' },
		{ name: 'Sage', hex: '#16cab5' },
		{ name: 'Coral', hex: '#ff8877' },
		{ name: 'Plum', hex: '#ea7bfb' },
		{ name: 'Stone', hex: '#a8b0bc' }
	];
	const EMOJI = ['☕', '🛒', '🏠', '✈️', '🎬', '⛽', '🍜', '💪'];
	const NAMES: Record<string, string> = {
		'☕': 'Coffee',
		'🛒': 'Groceries',
		'🏠': 'Rent',
		'✈️': 'Travel',
		'🎬': 'Streaming',
		'⛽': 'Gas',
		'🍜': 'Eating Out',
		'💪': 'Gym'
	};

	let hue = $state(HUES[2]);
	let emoji = $state('☕');

	const pillColor = $derived(hue.hex);
	const pillBg = $derived(`color-mix(in oklab, ${hue.hex} 14%, transparent)`);
</script>

<div use:reveal class="mb-section">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-0">
		<h2 class="label-swiss md:col-span-3">Interactive: Try It</h2>
		<div class="md:col-span-5 md:col-start-7">
			<div class="panel-swiss flex flex-col gap-6 p-6 md:p-8">
				<!-- Live pill preview -->
				<div class="flex items-center justify-between gap-4">
					<span
						class="pill data-swiss text-caption-size"
						style:background={pillBg}
						style:color={pillColor}
					>
						{emoji}
						{NAMES[emoji]}
					</span>
					<span class="data-swiss text-caption-size text-[var(--color-muted)]">-$142.50</span>
				</div>

				<!-- Hue swatches -->
				<div class="flex flex-wrap gap-2" role="group" aria-label="Category color">
					{#each HUES as h (h.name)}
						<button
							type="button"
							onclick={() => (hue = h)}
							aria-pressed={hue === h}
							aria-label={h.name}
							class="swatch {hue === h ? 'swatch-active' : ''}"
							style:background={h.hex}
						></button>
					{/each}
				</div>

				<!-- Emoji picker -->
				<div class="flex flex-wrap gap-1" role="group" aria-label="Category emoji">
					{#each EMOJI as e (e)}
						<button
							type="button"
							onclick={() => (emoji = e)}
							aria-pressed={emoji === e}
							aria-label="Category {NAMES[e]}"
							class="emoji-btn {emoji === e ? 'emoji-active' : ''}"
						>
							{e}
						</button>
					{/each}
				</div>
			</div>
			<p class="label-swiss mt-3">
				The only color you add to the Pocketwatch UI is the one you pick here. These are the
				product&rsquo;s ten real category hues.
			</p>
		</div>
	</div>
</div>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		border-radius: 9999px;
		transition:
			background-color var(--duration-fast) var(--ease-swiss),
			color var(--duration-fast) var(--ease-swiss);
	}

	.swatch {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
		cursor: pointer;
		transition: transform var(--duration-fast) var(--ease-swiss);
	}

	.swatch-active {
		outline: 2px solid var(--color-foreground);
		outline-offset: 2px;
	}

	.emoji-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-panel);
		cursor: pointer;
		font-size: 1.125rem;
		transition: background-color var(--duration-fast) var(--ease-swiss);
	}

	.emoji-btn:hover {
		background: var(--color-border);
	}

	.emoji-active {
		background: var(--color-border);
	}

	@media (prefers-reduced-motion: reduce) {
		.pill,
		.swatch,
		.emoji-btn {
			transition: none;
		}
	}
</style>
