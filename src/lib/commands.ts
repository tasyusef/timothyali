import { goto } from '$app/navigation';
import { NAV_LINKS } from '$lib/nav';
import { projects } from '$lib/projects';
import { theme } from '$lib/theme.svelte';

export interface Command {
	label: string;
	hint?: string;
	group: 'Navigate' | 'Projects' | 'Theme';
	run: () => void;
}

export const COMMAND_GROUPS = ['Navigate', 'Projects', 'Theme'] as const;

/** The full command list for the ⌘K menu — nav links, case studies, theme. */
export function buildCommands(): Command[] {
	return [
		...NAV_LINKS.map((link) => ({
			label: link.label,
			hint: link.href,
			group: 'Navigate' as const,
			run: () => goto(link.href)
		})),
		...projects.map((project) => ({
			label: project.title,
			hint: project.category,
			group: 'Projects' as const,
			run: () => goto(`/work/${project.slug}`)
		})),
		{ label: 'Dark mode', group: 'Theme' as const, run: () => theme.set('dark') },
		{ label: 'Light mode', group: 'Theme' as const, run: () => theme.set('light') }
	];
}
