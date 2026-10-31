// Gryphon and Tome, on /gryphon/ (PX-137, an assistant proposal awaiting Timothy's word).
// Facts come from the two READMEs; the wording around them is the assistant's.
// App source: /Users/twocakes/Desktop/PROJECTS/WOW (Tauri + Leptos, like Toolbox)
// Addon source: /Users/twocakes/Desktop/PROJECTS/Tome
import type { Shot } from './toolbox.ts';

/** The one version and the one place the downloads live: change them here and every link follows. */
export const VERSION = '0.1.0';
/** The public downloads repo, named as Toolbox's is (tasyusef/toolbox). */
export const REPO = 'https://github.com/tasyusef/gryphon';
export const RELEASES = `${REPO}/releases`;
// Straight to the GitHub file. Toolbox's go through /download/ to be counted (0223), but that
// route and the admin know only Toolbox's files; a click here counts as an outbound GitHub link.
const file = (name: string) => `${RELEASES}/download/v${VERSION}/${encodeURIComponent(name)}`;

export const APP = {
  name: 'Gryphon',
  version: VERSION,
  platforms: ['macOS', 'Windows', 'Linux'],
  description: 'A small desktop app for macOS, Windows, and Linux that installs and updates World of Warcraft: Forever addons straight from their GitHub releases.',
  features: ['Installs and updates addons from their GitHub releases', 'A short list of checked picks', 'Any addon from a pasted GitHub repo with a Forever zip', 'A backup before every update or removal', 'Leaves addons it didn’t install alone']
};
/** The page's description, which names Tome too. */
export const PAGE_DESCRIPTION = 'A small desktop app that installs and updates WoW Forever addons straight from GitHub. No account, no ads. Plus Tome, an addon for your game windows.';

export const builds = [
  { os: 'macOS', note: 'Signed and notarized', files: [{ label: 'Apple silicon and Intel', href: file(`Gryphon_${VERSION}_mac-universal.dmg`) }] },
  { os: 'Windows', note: 'The installer isn’t code-signed, so SmartScreen may warn you. Choose More info, then Run anyway.', files: [{ label: 'Installer x64', href: file(`Gryphon_${VERSION}_x64-setup.exe`) }] },
  { os: 'Linux', note: 'Make the AppImage executable before opening it, or use the deb package on Debian or Ubuntu.', files: [{ label: 'AppImage amd64', href: file(`Gryphon_${VERSION}_amd64.AppImage`) }, { label: 'deb amd64', href: file(`Gryphon_${VERSION}_amd64.deb`) }] }
];

// Each screen has a phone crop of its rows (tools/images/phone-crops.py), as Toolbox's do (0206).
const PHONE: Record<string, [number, number]> = { picks: [939, 633], github: [950, 367], folders: [1200, 311], settings: [1200, 431] };
const shot = (name: string, alt: string): Shot => ({ src: `/gryphon/${name}.png`, w: 2160, h: 1440, alt, phone: { src: `/gryphon/${name}-phone.png`, w: PHONE[name][0], h: PHONE[name][1] } });

export interface Point { title: string; text: string; shot: Shot }
export const points: Point[] = [
  {
    title: 'Picks I’ve checked.',
    text: 'It comes with a short list of addons I’ve checked have real Forever builds: OpenMap, Questie, DialogueUI, and Spoken, plus Spoken’s quest voices. It checks for updates and installs them when you say so.',
    shot: shot('picks', 'Gryphon’s Picks screen: OpenMap, Questie, DialogueUI, and Spoken with their versions, one update waiting and two ready to install.')
  },
  {
    title: 'Any addon on GitHub.',
    text: 'Paste an addon’s GitHub repo. If a release has a zip built for Forever, Gryphon installs it, and nothing in your AddOns folder changes until that’s been checked.',
    shot: shot('github', 'Gryphon’s GitHub screen: a field for an addon’s repo, and an added addon whose row says it has no release with a Forever zip.')
  },
  {
    title: 'The rest left alone.',
    text: 'Addons you installed some other way stay as they are. Gryphon lists them and tells you whether Forever will load them.',
    shot: shot('folders', 'Gryphon’s Other folders screen: three folders it didn’t install, marked built for another client, loads on Forever, and not an addon.')
  },
  {
    title: 'A backup first.',
    text: 'Before an update or a removal touches an addon, its old folder goes to Interface/.gryphon-backup, so you can always get it back. If it can’t find the game, point it at the folder in Settings.',
    shot: shot('settings', 'Gryphon’s Settings: the game folder it found, buttons to choose another or open the AddOns and backup folders, and a note on backups.')
  }
];

/** The Picks screen stands for the app in search and structured data. */
export const home: Shot = points[0].shot;

/** Tome, the addon: installed from Gryphon by its repo, or as a zip from its releases. */
export const TOME = {
  name: 'Tome',
  version: '0.1.0',
  repo: 'tasyusef/tome',
  releases: 'https://github.com/tasyusef/tome/releases',
  description: 'A World of Warcraft: Forever addon that puts one set of tabs on the character, spellbook, talents, guild, collections, and group finder windows, plus bags.',
  /** the windows it puts its tabs on, in its own order (README) */
  tabs: ['Character', 'Spellbook', 'Talents', 'Guild', 'Collections', 'Group Finder', 'Bags']
};
