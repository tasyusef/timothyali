import { ingest } from '$lib/server/ingest';
import type { RequestHandler } from './$types';
export const prerender = false;
// The endpoint's name before 0223, kept for pages still open on the old script.
export const POST: RequestHandler = (event) => ingest(event);
