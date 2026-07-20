<script lang="ts">
	import { fade } from 'svelte/transition';
	import { duration, easeSwiss, prefersReducedMotion } from '$lib/motion';
	import { focusTrap } from '$lib/actions/focusTrap';
	import { commandMenu } from '$lib/commandMenu.svelte';
	import { buildCommands, COMMAND_GROUPS, type Command } from '$lib/commands';

	const commands = buildCommands();

	let query = $state('');
	let selected = $state(0);

	const filtered = $derived(
		commands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
	);

	// Reset selection whenever the query changes; reset everything on close.
	$effect(() => {
		void query;
		selected = 0;
	});
	$effect(() => {
		if (!commandMenu.open) {
			query = '';
			selected = 0;
		}
	});

	function onWindowKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			commandMenu.toggle();
		}
	}

	function run(cmd: Command) {
		commandMenu.hide();
		cmd.run();
	}

	function onMenuKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selected = Math.min(selected + 1, filtered.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selected = Math.max(selected - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filtered[selected]) run(filtered[selected]);
		}
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#if commandMenu.open}
	<!-- Click-outside close; Escape is the keyboard path (focusTrap) -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="dialog"
		aria-modal="true"
		aria-label="Command menu"
		tabindex="-1"
		transition:fade={{ duration: prefersReducedMotion() ? 0 : duration.fast, easing: easeSwiss }}
		use:focusTrap={{ onEscape: commandMenu.hide }}
		onclick={(e) => {
			if (e.target === e.currentTarget) commandMenu.hide();
		}}
		class="z-lightbox px-swiss fixed inset-0 flex justify-center bg-black/50"
	>
		<div class="menu-panel panel-swiss w-full max-w-lg self-start overflow-hidden shadow-2xl">
			<div class="border-b border-[var(--color-border)] px-4 py-3">
				<input
					type="text"
					bind:value={query}
					onkeydown={onMenuKeydown}
					placeholder="Type a command or search&hellip;"
					aria-label="Filter commands"
					aria-activedescendant={filtered[selected] ? `command-${selected}` : undefined}
					class="menu-input font-body text-caption-size w-full bg-transparent"
				/>
			</div>
			<div class="max-h-80 overflow-y-auto py-2" role="listbox" aria-label="Commands">
				{#each COMMAND_GROUPS as group (group)}
					{@const items = filtered.filter((c) => c.group === group)}
					{#if items.length > 0}
						<p class="label-swiss px-4 pt-3 pb-1.5">{group}</p>
						{#each items as cmd (cmd.label)}
							{@const index = filtered.indexOf(cmd)}
							<button
								type="button"
								id="command-{index}"
								role="option"
								aria-selected={index === selected}
								onclick={() => run(cmd)}
								onpointerenter={() => (selected = index)}
								class="duration-fast ease-swiss flex w-full items-center justify-between px-4 py-2 text-left transition-colors {index ===
								selected
									? 'bg-[var(--color-border)]'
									: ''}"
							>
								<span class="text-caption-size">{cmd.label}</span>
								{#if cmd.hint}
									<span class="label-swiss data-swiss">{cmd.hint}</span>
								{/if}
							</button>
						{/each}
					{/if}
				{/each}
				{#if filtered.length === 0}
					<p class="label-swiss px-4 py-6 text-center">No results</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.menu-panel {
		margin-top: 18vh;
	}

	/* The panel border is the focus affordance — suppress the global ring */
	.menu-input:focus,
	.menu-input:focus-visible {
		outline: none;
	}
</style>
