// The whole site is static content — prerender everything.
export const prerender = true;

// Pin the canonical URL scheme: /about, never /about/ (protects the
// self-canonicals in <Seo> from adapter default changes).
export const trailingSlash = 'never';
