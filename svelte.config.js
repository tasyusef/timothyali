import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.svx', '.md'],
			layout: false
		})
	],
	kit: {
		adapter: adapter(),
		alias: {
			$content: 'src/content'
		},
		prerender: {
			handleHttpError: 'fail'
		}
	}
};

export default config;
