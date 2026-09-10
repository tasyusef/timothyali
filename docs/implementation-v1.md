# Working v1 — implementation notes

Correction 0041 refines the opening foreground and separates the introduction from the fixed wordmark. A low angular quay hall and a basin connected to the eastern canal give the lower view waterfront structure; the cross viaduct reaches the far quay. Ground and water shift toward warmer yellows. The large ground surface is subdivided so it no longer visually covers nearby water. The opening type is modestly smaller and its initial world-space position adapts to the viewport, leaving a clear navigation gap and preventing left-edge clipping on taller desktop windows. It stays anchored in the city during scroll. This implements Timothy’s requested correction; it is not visual approval.

Correction 0040 revises the bridge-to-overlook movement after Timothy described its path as awkward. From scene 05, the camera follows a continuous, distance-sampled crane path through the opening and forward over the terrace. It stays farther from the right tower and arrives 56 units deeper into the city. The viewing direction levels gradually toward the skyline, and the desktop lens and portrait lift follow the same travel phase. The invitation moves by the same depth offset to retain its reading scale; final links and the completion label appear at progress .97. This is an implementation response for review, not Timothy’s visual approval.

Refinement 0039 is a whole-city model polish pass requested by Timothy. District towers now use four extruded profiles mixing stepped crowns, clipped roofs, angled shoulders, and split tops. Sparse recessed and lit windows extend up the usable faces, with return/rear detail and silhouette checks. SVG landmarks keep their approved outlines and gain restrained façade accents. Canal banks have coping and finer water marks; road piers have tapered bodies and integrated bearing heads; the junction billboard gains a defined frame and foundations; canyon walls and the terrace arcade have occupied window bays. The terrace adds deck joints, a finished cap, panel joints, and attached underside ribs. This is a reviewed working revision, not Timothy’s visual acceptance. The narrow angular road, lowercase Jacquard emphasis, open underpass, and atmospheric depth remain in place.

Correction 0038 responds to Timothy’s concern that the road is too wide for the intended monumental city scale. The main road is reduced from 42 to 18 world units (about 57% narrower); its depth changes from 8 to 3.5, with finer markings, lower/slimmer barriers, and proportionate piers and footings. The cross viaduct is narrower too. A shared `ROAD_HALF_WIDTH` controls geometry and the distant district’s clearance. One additional camera key follows the narrower bend precisely. The tower and type dimensions remain the same in this scale trial.

Scene 04 now emphasizes “people use.” in lowercase Jacquard. Scattered window clusters occupy the civic building above and below the lettering bay and along its side return, with matching windows on the neighboring tower. The windows follow the actual building planes; the central typography area remains clear. This follows Timothy’s explicit request for blackletter and scattered windows in the civic lockup.

Correction 0036 refines the bridge-to-tower connections and opens the underpass. The bridge ends sit in recessed collars on short bearing seats; the long hanging braces are removed. Tower bases are set outside the road corridor. The obstructing nearby lot is removed, the setback landmark is relocated, and the terrace is carried by side wings around an open arcade. The road continues straight beneath it before turning farther out in the city. Distant district towers now respect a reserved road corridor, and the narrow landmark previously intersecting the bend is moved aside. The city behind the bridge is visible through the opening. This is a working implementation responding to Timothy’s correction, not visual approval.

This working local SvelteKit build develops storyboard 03 as a simplified graphic Three.js world. Under decisions 0033–0034, major architecture and infrastructure are solid 3D geometry, with editable SVG profiles for selected extruded landmarks and the far horizon. The copy, display-font candidate, exact colors, and camera compositions remain open to iteration; implementation does not confer final approval on each choice.

## Run and build

Use Node >=22.12, with Node 22 recommended on this machine:

```sh
PATH=/opt/homebrew/opt/node@22/bin:$PATH pnpm dev
PATH=/opt/homebrew/opt/node@22/bin:$PATH pnpm check
PATH=/opt/homebrew/opt/node@22/bin:$PATH pnpm build
```

`pnpm dev` uses port 5173 and refuses to select another port silently. SvelteKit prerenders Home, Work, and Contact using adapter-static. Deployment has not been performed.

## Editing map

- `static/world/`: twelve editable SVG profiles, including retained studies; see the exact runtime inventory below.
- `src/lib/world/city.ts`: solid building masses, SVG extrusion, road construction, canals, world placement, scene text, haze and camera presentation.
- `src/lib/world/route.ts`: eight-point angular road centerline, sixteen camera position/target keys, and six reading stops.
- `src/lib/world/world.css`: perspective typography. The environment uses no generated raster scene artwork.
- `src/routes/+page.svelte`: native scroll binding, mode control, semantic reading view, scene navigation, final links.
- `src/app.css`: shared colors, self-hosted font usage, fixed navigation and inner-page foundations.
- `src/routes/work/+page.svelte`: four selected projects and source-verified existing case-study links.
- `src/routes/contact/+page.svelte`: contact through Timothy’s verified LinkedIn profile.

Anton is the heavy display-font implementation candidate. Jacquard 24 supplies the wordmark and occasional narrative emphasis. IBM Plex Sans carries small interface and reading text. All fonts are served locally by the application. Yellow `#f2d600` and black `#11110e` are working values.

## Current environment refinement — decision 0034

The local environment now reflects correction 0034. Timothy rejected the visible city edge, floating rails, inverted city/road lettering, boxy bridge surroundings, and unconvincing terrace approach. The working revision adds faceted terrain, replaces scene 04 with an oblique vertical architectural statement, anchors the bridge to angular abutments, grounds the final terrace, corrects antenna-to-roof connections, and delays the final headline until the climb has framed it. The tall canyon sign uses lowercase Jacquard “look.” / “move.” / “work.” as explicitly requested. This is implemented for review; it is not Timothy’s visual approval. Work is direct: Timothy explicitly requested no orchestration skill.

`block()` and `tower()` build the smaller districts from four extruded profiles with restrained façade detail. `volume()` extrudes SVG landmarks, while `prism()` provides faceted terrain and the new major masses. The opening gains a geological basin and a grounded cross viaduct. Scene 04 uses vertical copy on a civic facade; scene 05 has an inhabited bridge connected to angular towers; scene 06 has a deep terrace carried by a waterfront building. Camera positions follow straight segments with smooth look directions. The final climb clears the bridge before rising, and invitation text appears from progress .95 to .98.

Typography and physical surfaces share their perspective: wide billboard yaw .95, civic facade .32, bridge .5, terrace −.22. Fog blends from depths 180 to 1650 before the 2300 far plane. Olive land and brighter canals remain working palette choices.

There are twelve SVG files: six instantiated families (stepped, spire, slab, stepped-classic, spire-classic, megastructure), four fetched retained templates without instances (slab-classic, gantry, road, hanging-city), and two unfetched skyline studies. See `docs/vector-world.md` for the editing map. The generated road follows the shared angular centerline; the old transit-road SVG is only a retained study.

## Interaction and access

The camera follows ordinary document scrolling; no wheel or keyboard scrolling is intercepted. Six scene buttons move directly to reading positions. The renderer updates when progress or the viewport changes. A small amount of camera damping settles between updates.

The final action links sit beneath the invitation, above the foreground city: 54% of viewport height on desktop and 45% at the mobile breakpoint. They remain ordinary DOM links with the shared keyboard focus treatment. Motion mode changes reset the current homepage immediately, so delayed world initialization cannot reset scrolling after navigation to Work.

The initial HTML contains all narrative sections. The visual world is decorative to assistive technology, while the semantic narrative remains available. Motion off, the browser’s reduced-motion preference, no JavaScript, and WebGL failure all provide the complete narrative in native document flow without the long animated journey spacer. Motion preference is saved locally when storage is available. Navigation and the final work/contact links are ordinary links.

## Project content

Pocketwatch, PARC, xrp.cafe, and First Ledger use images copied from the prior local portfolio and factual scope information from its `src/lib/projects.ts`. Their case studies remain at `https://timothyali.com/work/…` for this v1. These are real outbound destinations, not empty case-study placeholders.

## Current revision validation — 2026-09-08

The geometry revision passed `pnpm check` (zero errors/warnings), the production build, 125 browser checks covering desktop, 390px/320px and fallback modes, and seven navigation/remount/reverse-scroll checks. Sixteen desktop and sixteen mobile travel positions were captured without browser errors before the final antenna and headline-entry corrections; a targeted desktop .96 capture verified the corrected headline entry. An instrumented browser audit sampled 1,001 actual rendered camera positions per desktop/mobile viewport against candidate solid geometry, using local boxes and ray-intersection parity for extrusions; no camera-center intersections were found. This is a sampled clearance check, not a continuous-volume proof. The final lowercase text edit was confirmed in the live DOM with Jacquard 24. Technical checks support behavior, not visual acceptance.

The environment-source bundle contains the three world code files, all twelve SVGs, and documentation. It is an editing extract for this app, not a standalone application. The earlier matched-storyboard comparison is historical evidence for pass 0033; scene 04 is deliberately replaced under 0034. No deployment has been performed.

The dynamic Three.js chunk is larger than Vite’s default warning threshold. It is loaded only for the animated homepage. The reading view remains available before that import and does not require WebGL.

## Model polish validation — 0039

Refinement 0039 completed three visual iterations: a city-wide profile/detail pass, a correction for blank upper and return faces revealed by the overlook, and a terrace-edge/soffit pass after travel review.

Code checking finished with zero errors or warnings, and the production build passed (with the existing chunk-size advisory). During this pass, 125 browser checks passed across desktop, 390px, 320px, reduced-motion and unavailable-JS/WebGL modes. After the final terrace detail adjustment, all six desktop lockups and sixteen travel positions per desktop/mobile viewport were recaptured without browser errors; seven navigation/remount/reverse-scroll checks passed. The final geometry audit sampled 1,001 camera positions per desktop/mobile viewport without camera-center intersections. A road-width audit sampled 3,378 center/lane-offset positions without solid intersections. These are sampled implementation checks, not continuous-volume proofs or visual acceptance. Decorative instanced windows are excluded from the structural-solid audit.

## Final transition validation — 0040

The code check passed with zero errors/warnings; the production build passed with the existing chunk-size advisory. Eleven transition positions were captured and reviewed at desktop and 390px without browser errors. All six desktop lockups were recaptured. Seven navigation/remount/reverse-scroll checks and seven targeted 320px endpoint checks passed. The camera audit evaluated 1,001 positions at desktop and mobile sizes against structural solids with no camera-center intersections. During this audit, GPU/CSS draw submission is suppressed while the actual camera-update function runs; this avoids queuing thousands of unnecessary frames. This is a sampled clearance check, not a continuous-volume guarantee. The earlier 125-check suite belongs to 0039 and was not rerun for this route correction.

## Arrival validation — 0041

Code checking passed with zero errors/warnings and the production build passed with the existing chunk-size advisory. The opening text fits at 1600×900, 1440×1000, 1280×720, 1024×768, 768×1024, and 390×844; measured text bounds leave at least 28px below the wordmark. All six desktop lockups were recaptured and reviewed, including the effect of the shared ground/water colors. Seven navigation/remount/reverse-scroll checks passed, and the camera audit sampled 1,001 positions per desktop/mobile viewport without camera-center intersections. Earlier targeted arrival captures passed seven structural checks each at desktop and mobile. The ground/water correction was additionally checked using a ray hit and the corresponding rendered pixel before and after subdivision. These checks do not imply Timothy’s visual acceptance.
