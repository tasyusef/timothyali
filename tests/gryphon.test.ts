import { expect, it } from 'vitest';
import { VERSION, RELEASES, builds } from '../src/lib/gryphon';
// Gryphon's downloads (PX-137): one version and one base, and every link is a file of that release.
it('links every build to a file of the one release', () => {
  const hrefs = builds.flatMap((b) => b.files.map((f) => f.href));
  const base = `${RELEASES}/download/v${VERSION}/`;
  expect(RELEASES).toBe('https://github.com/tasyusef/gryphon/releases');
  expect(hrefs.map((h) => h.slice(base.length))).toEqual([
    `Gryphon_${VERSION}_mac-universal.dmg`,
    `Gryphon_${VERSION}_x64-setup.exe`,
    `Gryphon_${VERSION}_amd64.AppImage`,
    `Gryphon_${VERSION}_amd64.deb`
  ]);
  for (const h of hrefs) expect(h.startsWith(base)).toBe(true);
});
