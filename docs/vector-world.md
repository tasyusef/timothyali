# Graphic city — solid architecture working pass

Correction 0041 refines the opening foreground and separates the introduction from the fixed wordmark. A low angular quay hall and a basin connected to the eastern canal give the lower view waterfront structure; the cross viaduct reaches the far quay. Ground and water shift toward warmer yellows. The large ground surface is subdivided so it no longer visually covers nearby water. The opening type is modestly smaller and its initial world-space position adapts to the viewport, leaving a clear navigation gap and preventing left-edge clipping on taller desktop windows. It stays anchored in the city during scroll. This implements Timothy’s requested correction; it is not visual approval.

Correction 0040 revises the bridge-to-overlook movement after Timothy described its path as awkward. From scene 05, the camera follows a continuous, distance-sampled crane path through the opening and forward over the terrace. It stays farther from the right tower and arrives 56 units deeper into the city. The viewing direction levels gradually toward the skyline, and the desktop lens and portrait lift follow the same travel phase. The invitation moves by the same depth offset to retain its reading scale; final links and the completion label appear at progress .97. This is an implementation response for review, not Timothy’s visual approval.

Refinement 0039 is a whole-city model polish pass requested by Timothy. District towers now use four extruded profiles mixing stepped crowns, clipped roofs, angled shoulders, and split tops. Sparse recessed and lit windows extend up the usable faces, with return/rear detail and silhouette checks. SVG landmarks keep their approved outlines and gain restrained façade accents. Canal banks have coping and finer water marks; road piers have tapered bodies and integrated bearing heads; the junction billboard gains a defined frame and foundations; canyon walls and the terrace arcade have occupied window bays. The terrace adds deck joints, a finished cap, panel joints, and attached underside ribs. This is a reviewed working revision, not Timothy’s visual acceptance. The narrow angular road, lowercase Jacquard emphasis, open underpass, and atmospheric depth remain in place.

Correction 0038 responds to Timothy’s concern that the road is too wide for the intended monumental city scale. The main road is reduced from 42 to 18 world units (about 57% narrower); its depth changes from 8 to 3.5, with finer markings, lower/slimmer barriers, and proportionate piers and footings. The cross viaduct is narrower too. A shared `ROAD_HALF_WIDTH` controls geometry and the distant district’s clearance. One additional camera key follows the narrower bend precisely. The tower and type dimensions remain the same in this scale trial.

Scene 04 now emphasizes “people use.” in lowercase Jacquard. Scattered window clusters occupy the civic building above and below the lettering bay and along its side return, with matching windows on the neighboring tower. The windows follow the actual building planes; the central typography area remains clear. This follows Timothy’s explicit request for blackletter and scattered windows in the civic lockup.

Correction 0036 refines the bridge-to-tower connections and opens the underpass. The bridge ends sit in recessed collars on short bearing seats; the long hanging braces are removed. Tower bases are set outside the road corridor. The obstructing nearby lot is removed, the setback landmark is relocated, and the terrace is carried by side wings around an open arcade. The road continues straight beneath it before turning farther out in the city. Distant district towers now respect a reserved road corridor, and the narrow landmark previously intersecting the bend is moved aside. The city behind the bridge is visible through the opening. This is a working implementation responding to Timothy’s correction, not visual approval.

The landing remains one persistent Three.js scene driven by native document scroll. The current visual pass replaces the rejected thin-cutout city with solid architecture while retaining unlit yellow, ink, olive face tones and atmospheric haze. It is a reviewable work in progress, not visual approval. Live HTML typography uses the same camera through CSS3DRenderer. No generated backgrounds or bitmap textures are used.

## Geometry and editing map

`src/lib/world/city.ts` defines the world. `block()` uses shared box geometry and unlit face colors; `tower()` creates four polygon-based district profiles with attached roof fixtures. `prism()` extrudes editable polygon profiles for faceted terrain, the civic facade, bridge abutments, and the terrace. All are simple vertices and flat fills, without texture maps. District plinths connect the smaller buildings. Angular canals use joined water polygons, retaining banks, and sparse reflection marks.

The wide billboard/frame share yaw 0.95. The tall canyon sign uses a wall return. Scene 04 places its typography vertically on the civic mass at yaw 0.32; nonuniform road-letter stretching is removed. Scene 05 uses yaw 0.5 for both bridge and copy, with recessed end collars and short bearing seats at each end. Scene 06 is a deep terrace carried by grounded side wings around an open arcade, rotated −0.22 in plan. The camera passes under the bridge before climbing along the terrace front.

`volume()` extrudes selected SVG landmarks, including the 280 × 267 × 135 destination megastructure. The old hanging-city template remains in the source archive but is no longer instantiated. Classic and angular tower profiles remain as selected extrusions and lightweight far-horizon instances.

The road uses one mitered polygon extruded 3.5 units deep, generated directly from `ROAD_CENTERLINE` in `src/lib/world/route.ts`. Markings and parapets follow joined mitered edge polylines, while tapered piers, integrated bearing heads, and footings derive from the same straight segments. This prevents independent segment caps crossing the driving corridor at a turn. The retained `static/world/transit-road.svg` is an earlier source study; it no longer determines the solid road geometry. To edit the street, update the shared centerline and matching camera keys rather than that retained SVG. Every corner is an actual polyline vertex, with no sampled curves.

`GROUND_Y` is −35; `ROAD_Y` is 6. The lowest tower bodies reach `GROUND_Y` while preserving their top positions; district plinths overlap their grounded bases. The primary working palette is yellow `#f2d600` and ink `#11110e`, with darker olive side/roof tones, a warm yellow ground and brighter canal surfaces. Fog blends toward yellow between depths 180 and 1650, before the 2300-unit far plane. Materials are unlit, with no photorealistic lighting or textures.

## Camera and six reading positions

`route.ts` contains sixteen position/target keys. Positions follow straight segments; look directions interpolate smoothly. Reading stops remain `0, .22, .42, .6, .78, 1`, with short scroll-distance plateaus. Reverse scroll retraces the world.

1. Elevated arrival: lowercase Jacquard introduction, destination megastructure, district masses, and a terrain basin.
2. Junction: foreshortened wide black billboard on a thick frame attached to the building mass.
3. Canyon: enclosed walls, cross bridges, and a tall yellow sign with lowercase Jacquard “look.” / “move.” / “work.”
4. Civic facade: large vertical statement on an angular mass beside the road and canal network; the inverted skyline and road lettering are removed.
5. Inhabited bridge: a wider upward view, with a turning road, recessed soffit, short bearing seats, windowed wings and tower faces. Lowercase Jacquard emphasizes “products.” and “theirs.”
6. Terrace: emerge above a grounded roof onto layered districts and the receding water corridor.

`world.css` sets Anton and Jacquard 24. The opening, “invested”, the three tall-sign words, and “building.” use lowercase Jacquard. Portrait views use lens/target adjustments. At the final overlook, the camera and invitation lift together by up to 26 units to show more water beyond the terrace. The final headline fades in from progress .95 to .98, after the climb has framed it.

The public controller remains `createCity({canvas, overlay, onSceneChange})` returning `setProgress()`, `resize()` and `dispose()`. It owns no scroll listeners or perpetual animation loop. The shell owns motion scheduling, font loading and semantic fallback.

## Rendering limits and fallback

CSS3D and WebGL do not share a depth buffer. A sign is visible only in its local reading neighborhood, fading before foreground geometry could cover it. The persistent sign support and all city geometry continue through every transition. This is an intentional v1 constraint: traveling lettering is not visible from every distant viewpoint. A later fully depth-tested text solution can use vector outlines if necessary.

Three.js documents CSS3DRenderer as supporting 100% browser/display zoom. The shell's readable story provides a normal HTML version for reduced motion and unavailable graphics; it also gives users an alternative to the spatial presentation. Text in the decorative 3D layer is hidden from assistive technology, has no focusable descendants, and should never be the only accessible copy.

SVG requests fail as a group; failure disposes renderer resources and is surfaced to the shell. Normal teardown removes CSS3D DOM, aborts outstanding loads, and disposes shared geometry/materials. Frame rendering is demand-based. The shell owns scroll scheduling and context-loss fallback.

API references used: [SVGLoader](https://threejs.org/docs/pages/SVGLoader.html), [CSS3DRenderer](https://threejs.org/docs/pages/CSS3DRenderer.html).


## Source inventory and portable bundles

The environment has three runtime source files: `src/lib/world/city.ts`, `route.ts` and `world.css`. These code files define the major architecture, infrastructure, materials, camera and typography. The twelve SVG files are profile sources and retained studies; a vector-only archive cannot reproduce the whole current environment.

| SVG role | Files |
| --- | --- |
| Profiles instantiated as flat and/or extruded geometry | `tower-stepped.svg`, `tower-spire.svg`, `tower-slab.svg`, `tower-stepped-classic.svg`, `tower-spire-classic.svg`, `megastructure.svg` |
| Definitions currently fetched but without scene instances | `tower-slab-classic.svg`, `gantry.svg`, `transit-road.svg`, `hanging-city.svg` |
| Retained studies, not fetched by the current app | `skyline.svg`, `skyline-classic.svg` |

The loader therefore fetches ten definitions, while six SVG families contribute instances. The forty-eight lightweight far-horizon instances cycle through stepped-classic, slab, spire-classic and stepped; solid districts are built separately with code. Both original and approved newer shapes remain preserved without implying that every retained variant is currently placed.

`city-environment-source.zip` contains the three source files, all twelve SVGs, this guide and a README. It is an environment-source extract for the existing SvelteKit application, not a standalone site or a full project backup. `vector-city-assets.zip` contains all twelve SVG files and the same guide. Neither bundle includes generated background artwork, dependencies, the application shell or font files.


`windowBays()` places deterministic, irregular window clusters on a local facade plane. Its origin, column/row counts, yaw, and seed can be edited independently. Windows are small unlit solid shapes with darker recesses; no bitmap texture or glow effects are used. The bridge has separate local window sections, keeping its central lettering clear.


The road stays at X=140 through Z=−1230, then turns diagonally to [470, −1560] and continues to Z=−3000. `tower()` reserves a conservative clearance around the later road segments, keeping district masses outside the roadway. Major custom solids and SVG landmarks still require explicit placement checks. The lower terrace arcade preserves sightlines from the bridge reading stop through to the distant city.

## Model polish editing map — 0039

- `tower()` holds four normalized profiles. Width, height, and depth scale each solid independently. Front window placement tests the silhouette; return windows stay below the sloping shoulders. Upper rows extend through the usable crown. Selected rear windows keep later angles inhabited.
- `volume()` tests façade accents against its editable SVG outline, and adds slim shoulder ledges to the destination megastructure. The source SVG outlines are preserved.
- `tile()` collects small solid accents; `finishDetails()` batches them into one `InstancedMesh` per color. Teardown disposes the instance resources alongside shared geometry/materials. Structural solids remain separate objects.
- `windowBays()` continues to define local clusters on custom buildings, including the canyon and terrace arcade. Keep each grid inside its physical face when changing dimensions.
- `canal()` controls the joined banks, coping, and angular water marks. Road pier profiles are defined in the centerline loop. Billboard and rooftop groups own their local frame, base, panel, and soffit details.

The retained unused SVG studies are historical sources, not additional active models to decorate. The six active SVG families, district solids, custom civic/bridge/terrace masses, terrain, canals, and viaduct were reviewed together in the live route.

## Final transition editing — 0040

`route.ts` retains straight position segments before scene 05. After .78, `finalFlight` uses the ordered position entries as centripetal spline control points, sampled by arc length. Their intermediate `at` values do not set flight speed; `readingTime()` and `finalTravelProgress()` supply the single eased travel phase. The look direction blends between the bridge and overlook directions without tilting toward an intermediate roof target. The flight keeps the road itself angular.

The final camera position is [140, 92, −1088], with its sightline equivalent to [140, 110, −1236]. The invitation plane has moved to Z=−1159. The existing portrait lift remains 26 units at the endpoint, entering smoothly after bridge clearance. `city.ts` ties the final lens and portrait framing to this travel phase. `src/routes/+page.svelte` delays the final actions/completion label until .97. The prior near-vertical climb and separate lens/lift schedules are superseded.

## Opening foreground and type layout — 0041

The ground is a flat 18,000-unit plane with 36 subdivisions per axis at `GROUND_Y`; the former large box and an unsubdivided plane visually covered canal pixels even where a ray hit the water first. Subdivision resolved that observed rendering problem with ordinary depth testing; no draw-order override or polygon bias remains. Ground is `#c5b21a`, water `#eed200`. These are shared world materials, so the warmer surface colors carry through the journey.

The foreground basin runs from X=20 to X=380 at Z=−4, with an 80-unit nominal width. The eastern longitudinal canal has an opening for it. A low quay hall at [−190, −35, −38] has an angled shoulder, a foundation, roof cap, and restrained occupied bays. The cross viaduct extends to X=425 and its end abutment to X=415.

`resize()` places the arrival plane against a reference camera sampled at progress zero. On landscape screens, it computes a safe initial left/top grid and scales the plane by aspect ratio. Subsequent scroll motion leaves that plane in world space. Portrait framing keeps its prior anchor. `world.css` sets the desktop arrival headline to 245px and subtitle to 84px in the plane’s local coordinates; the mobile font overrides remain in place.
