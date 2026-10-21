import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// Chunks under 4 KB are merged into the ones that import them (0214): Home asked for 36 files,
// eleven of them under 1 KB.
export default defineConfig({ plugins: [sveltekit()], server: { port: Number(process.env.PORT) || 5173 }, build: { rollupOptions: { output: { experimentalMinChunkSize: 4096 } } } });
