import { ingest } from '$lib/server/ingest';
import type { RequestHandler } from './$types';
export const prerender = false;
// A plain name: block lists drop requests to paths named "analytics" (0223).
export const POST: RequestHandler = (event) => ingest(event);
