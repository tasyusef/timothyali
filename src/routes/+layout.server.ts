// Each page's title, description, share tags and structured data, worked out at prerender (0207).
// In a load they ship as that page's data only; imported by the layout they shipped every study's
// copy and the Toolbox option tables to every page.
import { socialFor } from '$lib/social';
import { jsonLdFor } from '$lib/seo';
export const load = ({ url }) => {
  const meta = socialFor(url.pathname) ?? null;
  return { meta, jsonLd: meta ? jsonLdFor(meta.path) : '' };
};
