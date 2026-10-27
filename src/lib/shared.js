// What the site and its Node tools (tools/social/verify.mjs) both need (0210). Plain JavaScript
// with no imports, so a script that is not built by SvelteKit can import it by path.
// The site, the contact route among it, reads these through $lib/site.

/** the public origin, retained from the previous site */
export const SITE_URL = 'https://www.timothyali.com';
/** the address the form sends to and every "email me" names */
export const EMAIL = 'studio@timothyali.com';
/** the contact form's limits, in characters (the fields' maxlength and the function's cut) */
export const LIMITS = { name: 120, email: 200, message: 5000 };
/** one address: no spaces, commas, semicolons, quotes or angle brackets (it becomes the reply-to) */
export const EMAIL_PATTERN = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]+$/;
