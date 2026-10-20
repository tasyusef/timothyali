# Design-system audit, 2026-10-19

**Bottom line: the system holds, but it has leaks.**
- **Eight things you can see** are wrong, mostly small: invisible text selection on the dark panels, a press state that never shows, demo buttons that slide.
- **About thirty merges and tokens** would remove copies that have started to drift apart.
- Nothing is broken badly. Nothing has been changed yet.

Two read-only reviewers ran on the same brief: a Claude Opus agent (49 findings) and Codex on `gpt-6-astra` (30 findings). Duplicates are merged below.
- **Source tags:** **[Both]**, **[Opus]**, **[Codex]**.
- **Effort:** **S** is about an hour or less; **M** is up to half a day.

Full reports with every file and line: `2026-10-19-design-system-reports.md`.

---

## 1. Visible bugs (fix first)

1. **Selected text is invisible on the dark panels.**
   - Where: the Contact note, and the Toolbox install and phone panels.
   - Why: the global selection colours are the same two colours as those panels. Only the code block corrects for it.
   - Fix: one shared `.panel` block. It also replaces five copies of the panel's styles. **[Opus] S**
2. **Toolbox demo buttons slide 8px on hover** with motion on, including the disabled Export button. The site's hover nudge outranks the demo's "don't move". **[Opus] S**
3. **Home's work cards and the hero's "Selected work" chip never show the yellow press state.** Home's own card and chip styles outrank the shared `:active` rule. **[Codex] S**
4. **The field cursors use the old ink and white** (from before 0171), so they don't match the text colour. Two other tools and three demo colours carry the same old values. **[Both] S**
5. **"building." is a different size on Home and Contact** between 1101 and 1300px wide: 258px on Home, 172px on Contact. The heading is built three times (Home, Contact, share images). Fix: one component with one size ladder. **[Both] M**
6. **Blurry text on the admin page.**
   - The notes (22.5px) and the new referral dates (18px) are not sizes from the cell table.
   - The Toolbox options' disclosure marker is also off its size.
   - **[Both] S**
7. **The Toolbox demos' file path can't truncate with "…".** The demo borrows class names (`.readout`, `.path`) from the site's status strip and inherits its rules. **[Opus] S**
8. **The demo toolbar's middle item sits on a fractional pixel.** It uses `space-between` with three items, which rule 0089 forbids. **[Opus] S**

## 2. Merge into shared components

9. **`Cta` can't render a `<button>`.**
   - So the Contact send button, the Toolbox send button and the admin buttons are hand-built.
   - The Toolbox one has no hover, and its press goes to the wrong colour.
   - **[Both] S–M**
10. **Links with an arrow that bypass `QuietLink`:** Home's "All work" (a fourth link style), the page footer, and the admin and error pages. **[Both] S**
11. **The page-title size ladder (110 → 82.5 → 55 → 41.25) is written out in three routes**, and the "shrink to fit the longest word" probe is copied three times. Fix: a `.display-title` type role and one `fitWord` action. **[Both] M**
12. **`Picture` and `Clip` each carry their own copy** of the figure styles and the sizing code. Fix: move them to the blocks layer, plus one shared sizing action. **[Both] S–M**
13. **Inner-page head, paragraph column and full-bleed band rules** are copied across 4–6 routes. Fix: move them into `layout.css`. **[Both] S**
14. **The four Toolbox demos repeat their frame**: readout, toolbar, the "Destination" row, and inline styles. Fix: three small demo components. **[Both] M**
15. **The "Next" footer on studies and tool pages** is the same markup twice, and so is its loader. **[Opus] S**
16. **`Cursor` can't take a class or a 24px size**, so the Contact carets and the command cursors are hand-built. **[Both] S**
17. **Arrows and pixel icons outside `Arrow`**: the hero's down arrow, the admin's ↗, and the play, pause and settings icons. **[Opus] S**
18. **The error page skips the system**: inline styles and a bare link. **[Opus] S**
19. **Smaller copies:**
    - the Toolbox hero restates the `.display-xl` ladder;
    - the command plate exists twice;
    - the card's background over the field is restated.
    - **[Opus] S**

## 3. Tokens to add or use

20. **The header height (96 / 104px) is typed in four places**, although the layout already measures it. Anchor offsets under the header vary from 16 to 96px. Fix: one `--chrome-height` token. **[Opus] S**
21. **Every page passes the same field settings by hand** (feather 12, depth 0.85, clear feather 3) at five call sites. Fix: make them `Band`'s defaults for a scene. **[Both] S**
22. **The phone caption style (Plex Mono 14/24)** is written twice. Fix: a `.read-s` type role. **[Both] S**
23. **Type roles restated outside `type.css`** (`.body`, `.lbl`, `.mono`) in six places; the Specimen demo also retypes the font stacks. **[Both] S**
24. **Scene palettes hard-code the brand hexes.** Fix: import them from `tokens.ts`, and add the field yellow there. **[Both] S**
25. **Small repeated values:**
    - the focus ring;
    - the button padding (0097);
    - the breakpoints, typed in JavaScript;
    - the dim level on dark panels;
    - the tint percentages;
    - the dither-in animation;
    - the gallery gap (a token in CSS, the number 16 in JavaScript).
    - **[Both] S each**
26. **Raw spacing in the demos and the gallery maths** (`16`, `8px`, `96px`, inline `gap:4px`). **[Both] S**
27. **Image `sizes` hints assume the page stops at 1440px.** It doesn't, so wide screens get softer images. **[Opus] M**

## 4. Constants written twice

28. **Site constants are retyped:**
    - the site URL in five places;
    - the email address eight times;
    - the LinkedIn URL spelled two ways;
    - the releases URL defined twice;
    - the `?via=` pattern written twice.
    - Fix: everything in `site.ts`. **[Both] S**
29. **The contact form's rules** (email pattern, length limits) are written separately in the form and the endpoint. **[Both] S**
30. **The share-image page list** is rebuilt by the generator, the verifier and the route. **[Codex] M**
31. **Smaller ones:** three two-digit `pad` helpers, and the admin day ranges written twice. **[Opus] S**

## 5. Cleanup (no visual change)

32. **Dead code:**
    - `Decode`'s `live` state;
    - `MetaLine`'s short form;
    - two unused imports;
    - unused tokens (`--s16`, `CELL_TEXT`);
    - the old Grid-toggle migration;
    - unused exports in `work.ts`. **[Both] S**
33. **Names:**
    - images use `w`/`h` in the data but `width`/`height` in components;
    - `galleryClass()` returns `sizes`;
    - `--grid-*` is named after the removed Grid;
    - `.pad` and `.intro` each mean two or three things;
    - `.alt` means `.dim`. **[Both] S–M**
34. **`Cta` and `QuietLink` make every caller add `lbl`**, while `PageFoot` and `MetaLine` add it themselves. **[Opus] S**
35. **`Band` doesn't pass `interactive` or `reach` through to the field** (no caller uses them yet). **[Codex] S**

Also: `docs/design-system.md` is stale in places. For example, it says `MetaLine` is used by the Work rows and Home cards; only the share images use it now.

---

## Suggested batches

- **A: visible bugs (1–8).** About half a day. Small, and each one is visible.
- **B: merges and tokens (9–27).** About a day. The site should look the same apart from the unifications noted, checked by the parity harness.
- **C: constants and cleanup (28–35).** About half a day, with no visual change.
