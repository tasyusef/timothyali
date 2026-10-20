// Site constants with no imports, so a page that needs only these does not pull in the
// whole work index the share tags are built from (0207).
export { SITE_URL, EMAIL, LIMITS, EMAIL_PATTERN } from './shared.js';
/** the site's own hostnames: a referrer from these is not a referral */
export const HOSTS = ['www.timothyali.com', 'timothyali.com'];
export const LINKEDIN = 'https://www.linkedin.com/in/timothyali';
export const GITHUB = 'https://github.com/tasyusef';
/** a tagged link's name (`?via=acme`, 0209): what Analytics keeps and the endpoint accepts */
export const VIA = /^[a-z0-9][a-z0-9-]{0,39}$/;
// The hosted résumé (PX-43; the product track since PX-50): no phone number, built outside this repo
// by the résumé source in Timothy's RESUME folder and copied into static/resume/.
export const RESUME_URL = '/resume/Timothy-Ali-Resume.pdf';
