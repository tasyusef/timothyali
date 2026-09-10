// Prerendered without a trailing slash so it lands at build/not-found.html; the 404 route in
// vercel.json serves it, with a 404 status, for any path that does not exist. (Vercel refuses
// to serve a file named 404.html by that name, so the page is not called that.)
export const prerender = true;
export const trailingSlash = 'never';
