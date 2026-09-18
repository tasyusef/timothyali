// Auth.js handles these endpoints in hooks.server.ts. The route keeps them in Vercel's manifest.
export const prerender = false;
export const GET = () => new Response('Not found', { status: 404 });
export const POST = GET;
