// Shared runtime state for the site. Set by the layout, read by the canvas/type components.
// `on` is false until the layout mounts and resolves the saved choice / OS preference,
// so the no-JavaScript and reduced-motion renderings are the default renderings.
export const motion = $state({ on: false, ready: false });
export const grid = $state({ on: false });
export const theme = $state({ light: false });
