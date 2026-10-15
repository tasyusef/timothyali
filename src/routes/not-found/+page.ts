// Prerendered without a trailing slash so it lands at build/not-found.html. A missing path is
// answered by the SvelteKit function through +error.svelte with a 404 status (vercel.json has no 404 route). (Vercel refuses
// to serve a file named 404.html by that name, so the page is not called that.)
export const prerender = true;
export const trailingSlash = 'never';
