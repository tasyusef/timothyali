// The app's own rules for the size words on the landing diagrams, after Toolbox 1.2.5's Rust
// crates (`tool-convert` view.rs): the sizes and changes the diagrams print read as the app's.
// Everything else on them is the app's real output (`<tool>-sample.json`).

/** Convert's sizes (`file_size`): B below 1 kB, whole kB below 1 MB, then MB to one place. */
export const fileSize = (bytes: number): string => (bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} kB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`);

/** An output's change against its source as a whole percentage, “+50%”, “−29%” (U+2212),
 *  “0%”, thousands grouped; `grew` says it got bigger. Null for an empty source. */
export function changePercent(from: number, to: number): { text: string; grew: boolean } | null {
  if (from === 0) return null;
  const change = Math.trunc(((to - from) / from) * 100);
  const digits = Math.abs(change).toLocaleString('en-US');
  return { text: change > 0 ? `+${digits}%` : change < 0 ? `\u2212${digits}%` : '0%', grew: change > 0 };
}
