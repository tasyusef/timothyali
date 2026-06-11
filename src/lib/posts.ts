import type { Component } from 'svelte';

interface PostMetadata {
	title: string;
	date: string; // ISO yyyy-mm-dd
	excerpt: string;
}

interface PostModule {
	metadata: PostMetadata;
	default: Component;
}

export interface Post extends PostMetadata {
	slug: string;
	component: Component;
}

const modules = import.meta.glob<PostModule>('/src/content/posts/*.md', { eager: true });

export const posts: Post[] = Object.entries(modules)
	.map(([path, mod]) => ({
		slug: path.split('/').pop()!.replace('.md', ''),
		component: mod.default,
		...mod.metadata
	}))
	.sort((a, b) => +new Date(b.date) - +new Date(a.date));

export function getPost(slug: string): Post | undefined {
	return posts.find((p) => p.slug === slug);
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	timeZone: 'UTC'
});

export function formatDate(iso: string): string {
	return dateFormat.format(new Date(iso));
}
