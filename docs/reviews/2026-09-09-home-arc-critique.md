# Home page story arc — independent critique

2026-09-09. Timothy asked for a fresh-context review of the home page (PX-06 state) by a separate agent with no involvement in the build. Identity constraints (name, Jacquard 24, black/white with yellow accent, pixel grid, ASCII textures, kinetic type) were declared fixed. The reviewer read the source and copy docs and captured its own screenshots. Verbatim report below; disposition is logged in the decision log once Timothy decides.

---

**Verdict up front:** The system is strong and distinctive; the arc is not. The home page reads as five independent posters stacked vertically, not one story. The identity work (Jacquard hero, textures, yellow-sparingly, cards) is done. The narrative and the middle third of the page are not.

## a. Story arc as a visitor experiences it

1. **Hero — "i'm tim."** Works. Big, confident, texture is beautiful. But it's a full viewport (≈800px) that says only a name, and the "Scroll" hint is nearly invisible at 55% Silkscreen over dots. A cold visitor gets curiosity but zero information; the payoff for staying is deferred to band 2.
2. **Statement — "Designer for teams that don't have one yet."** This is the actual thesis and the strongest line on the site. It's also the moment the visitor finally learns what you do. Good.
3. **"I get / invested. / in what I make."** This is where attention drops. It restates the *tone* of band 2 without adding information; "invested" is the third giant blackletter word in a row, so the emphasis device is already spent. Right-aligned "IN WHAT I MAKE." breaks the reading rhythm — the eye has to travel ~900px across a dot field to finish the sentence.
4. **"How it / looks. moves. works."** + diagram + "I've cofounded products." The best idea on the page, but it's disconnected from band 3 despite the negative margin: the ASCII bands texture starts abruptly under "in what I make." with no compositional handoff, and the diagram/copy sits in the bottom-right corner, the only part of the page in body type. The three words never connect to the "brand / product / motion / front end" claim in band 2 — they should map to each other and don't.
5. **Cards.** The payoff, and it's good: real work, real colour, the only place with proof. But it appears with no lead-in — no heading, no "selected work", nothing. It arrives as if pasted from another page.
6. **"Tell me what you're building."** Strong close. Full-width yellow bar is the right move.

Net: curiosity → clarity → **flat** → clarity → proof → close. The "flat" is bands 3–4; roughly 1,400px of the 4,500px page.

## b. Layout and transitions

- **Bands 3→4 don't work.** "in what I make." right-aligned and "HOW IT" left-aligned with a texture change between them; the -96px overlap doesn't create continuity, it creates a seam.
- **Band 4 internal hierarchy is off.** Three 172px Jacquard words vs a tiny 16px diagram and 27px body copy, bottom-right, align-items:end. The most credible sentence on the page ("I've cofounded products") is the smallest thing on it.
- **Band 4→5 is the hardest cut on the page.** Full-bleed texture straight into colourful cards with no heading, no label.
- **Redundancy:** "From the first idea to something people use" (band 2) and IDEA→ITERATE→SHIP (band 4) are the same claim twice.
- **Reading order:** Bands 3, 4 and 6 all use "display lead → blackletter → display tail". Three times is a template, not emphasis.

## c. Recommendations, prioritised

1. **Cut band 3 ("I get invested") or fold it into band 4.** Make band 4 the single "what I care about" beat: `I GET / invested. / IN HOW IT / looks. moves. works.` — one texture, one composition, one blackletter run. Saves ~500px and gives the middle a spine. If you can't cut it, at least left-align "in what I make."
2. **Give the cards a heading.** One `display` line: `SELECTED WORK` (matches /work/). Optionally a `lbl dim` "01–04" count. This is 40px that fixes the worst seam.
3. **Promote the proof.** Move "I've cofounded products. Helped teams ship theirs." up into the statement band's right column (replacing the redundant "From the first idea…" line) so credibility lands within the first two screens. Drop the ASCII diagram — it's decorative, 8px on mobile, and says what the copy already says.
4. **Make the three words earn their place:** put a `lbl dim` under each — `looks.` → BRAND, `moves.` → MOTION, `works.` → PRODUCT / FRONT END. Now band 2's claim and band 4's emphasis are one system.
5. **Hero:** raise "Scroll" to full opacity or replace with a yellow block cursor, matching the header cursor. Consider a 4-second auto-type of the statement line into the hero at the end — the hero is the only place the kinetic type actually feels kinetic and it's spent on 8 characters.
6. **Cards:** card labels ("01 / PRODUCT / BRAND") at 55% are near-unreadable on the checker surface. Full opacity.

## d. Don't touch

Hero composition and sky dither. The statement headline copy. Card surface and full-colour pixel-resampled images. The yellow bar close. Header/readout chrome. The /work/ page — it's the clearest page on the site (heading + cards + descriptions + CTA) and is the model the home index should follow.

## Mobile (390)

Better than desktop in one respect — everything left-aligns, so the band 3→4 seam mostly disappears. Problems: the hero is 80vh of texture with a 129px name; the ASCII diagram at 8px is illegible noise and should be hidden below 700px; "SCROLL" is gone so nothing signals the page continues; card images shrink to ~330px so the First Ledger billboard text is mush; footer toggles wrap to two rows. The nav becomes a full-width three-tab bar, which is good.
