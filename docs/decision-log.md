# Decision Log

Format per entry: number, date, status, the question, options considered, decision, reasoning, consequences.
Status is one of: Proposed, Accepted, Superseded.

---

## 0001 — How decisions get recorded

- **Date:** 2026-09-08
- **Status:** Accepted (Timothy confirmed 2026-09-08: "this is good")

**Question:** Timothy wants every decision in the rebrand recorded well enough to show the process publicly. What format?

**Options considered:**
1. A single running markdown log in the repo (this file).
2. A Notion/Google Doc outside the repo.
3. Git commit messages only.

**Decision:** Option 1. One markdown log in `docs/`, ADR-style (numbered entries with options, decision, reasoning). Plus `open-questions.md` for undecided items and `context.md` for the starting point.

**Reasoning:** Lives next to the work, is versionable, and can be rendered into a public "process" page or post later without reformatting. Commit messages alone lose the options that were rejected, which is the interesting part to show. An external doc drifts from the code.

**Consequences:** Every meaningful choice (positioning, name, platforms, stack, visual direction) gets an entry before work proceeds on it. Claude asks for the "why" when it is not clear rather than inventing one.

---

## 0002 — What the rebrand is for

- **Date:** 2026-09-08
- **Status:** Accepted

**Question:** Freelance clients, full-time role, or audience? These pull in different directions and the site has to lead with one.

**Options considered:**
1. Full-time job hunt first (the current site's framing: "open to full-time roles").
2. Freelance client acquisition first, full-time as a welcome side effect.
3. Audience/creator play.

**Decision:** Option 2. Primary goal is expanding the freelance client base. A full-time role at a tech or crypto company is a secondary outcome the same portfolio should be able to land. Social media is a means, not the goal: Timothy does not want to be an influencer.

**Reasoning (Timothy's words, paraphrased):** The job market is tough and applications are going nowhere. The current part-time contract ($40/hr, monotonous, no product or brand thinking) pays the bills but is stagnation, and he hates stagnation. Something has to change. Showing process publicly makes the work feel legitimate and counters the "he probably AI-generated all of that" reaction.

**Consequences:** Every brand and site decision gets tested against "does this make a client hire me?" first and "does this make a hiring manager call?" second. Social content is process-driven, not personality-driven.

---

## 0003 — Sequence: brand before site

- **Date:** 2026-09-08
- **Status:** Accepted

**Question:** Rebuild the site first and let the brand emerge, or settle the brand first?

**Decision:** Brand first. Positioning and identity system before any site code.

**Reasoning:** Timothy: the current identity is "just my name in whatever font." The site cannot be designed against a brand that does not exist yet. Claude agrees; the previous site's three competing pitches are a symptom of building the site before the positioning.

**Consequences:** Order of work is positioning statement → voice → identity system (mark, type, color) → site → content cadence. No site work until the identity is signed off.

---

## 0004 — Tech stack for the v2 site

- **Date:** 2026-09-08
- **Status:** Accepted

**Question:** Is the rebuild also a stack change?

**Decision:** SvelteKit stays.

**Reasoning:** Timothy's call. The current stack (SvelteKit 2, Svelte 5, Tailwind v4, Vercel, prerendered) works and he knows it. The rebrand is about positioning and identity, not tooling. Changing stacks would spend effort where there is no problem.

**Consequences:** v2 can reuse infrastructure from `../timothyali` (image pipeline, OG generation, SEO component, mdsvex blog). Design tokens and components get rebuilt to the new identity.

---

## 0005 — How crypto/XRPL work is positioned

- **Date:** 2026-09-08
- **Status:** Accepted

**Question:** About half the portfolio is XRPL ecosystem work (xrp.cafe, First Ledger, PARC, Sonde). Lead with it, keep it as one chapter, or downplay it?

**Options considered:**
1. Lead with it: "crypto designer." Strongest numbers, but narrows to a shrinking audience and can scare off non-crypto clients.
2. Downplay it. Reads as shame, and Timothy is not ashamed of it. Also throws away the best proof.
3. Own it as the proof chapter, not the label.

**Decision:** Option 3. Crypto work is presented as evidence: brands that had to earn trust in the most adversarial, scam-saturated market online, and did (32K members, $5M revenue, $1B volume, Ripple credit). It is not the identity.

**Reasoning:** Timothy's stance: crypto is where he learned a lot, there is a lot of grifting, he is not ashamed, and he still believes it is changing money in a way that has not happened in a long time. The reframe keeps that honesty while making the work legible to a med-spa owner or a startup founder. Timothy confirmed the reframe does not feel like spin.

**Consequences:** Case studies stay. Copy frames them around trust and results rather than around the ecosystem. A crypto company hiring manager still sees deep domain experience.

---

## 0006 — Social platforms

- **Date:** 2026-09-08
- **Status:** Accepted

**Question:** Which platforms, in what order?

**Starting point:** X (@twocakes__, ~1–1.5K followers), Instagram (personal use), LinkedIn (small following).

**Options considered:**
1. New Instagram design account plus X plus LinkedIn from day one.
2. X primary, LinkedIn as distribution, Instagram deferred.
3. LinkedIn primary.

**Decision:** Option 2. X is the primary channel for process content. LinkedIn gets the same content reformatted, because that is where freelance leads and hiring managers are. No new Instagram account until X is running consistently.

**Reasoning:** X is the one platform where design, tech, and crypto audiences overlap, and Timothy already has a base there. Starting a second account from zero while learning to post consistently on the first is a bad trade. LinkedIn is the weakest channel and the most commercially useful one, so it cannot be skipped.

**Consequences:** Content is made once for X and adapted for LinkedIn. Instagram is revisited once X has a cadence (see open questions).

---

## 0007 — Target freelance client

- **Date:** 2026-09-08
- **Status:** Accepted (direction); the specific profile is still open (Q7)

**Question:** Who is the freelance client the brand should be built to attract?

**Decision:** Tech companies. Not local service businesses as the primary target.

**Reasoning:** Timothy wants product and brand thinking in the work, which local-business jobs rarely have. Recent clients (FirstStrike, Jade Aesthetics, First Ledger) were all good engagements with real businesses, but every one came through friendship with the owner.

**Consequences:** This is the most important fact in the log so far: the brand has never had to win a stranger. Everything built here is being built for cold audiences for the first time. "Tech" still needs narrowing (stage, size, product type) before the positioning statement is written.

---

## 0008 — Target client, narrowed

- **Date:** 2026-09-08
- **Status:** Accepted

**Question:** "Tech" was too broad (0007). Which tech companies?

**Decision:** Seed-stage startups and crypto protocols, ideally without an existing design team. Same profile for a full-time role.

**Reasoning (Timothy):** The ideal client or employer gives him control to test and iterate until the result is genuinely great. A team with an established design org means slotting into someone else's system, which is the monotony he is trying to leave.

**Claude's read:** This narrowing changes the positioning problem. In the general market, "designer who does brand, product, motion, and front end" is a crowded generalist claim (see context.md). For a seed-stage team with no designer, one person who can own all of it and ship it to production is the entire offer. The generalism becomes the product when the audience is a team that has nobody. The positioning statement should be written for that reader.

**Risk noted:** Seed-stage startups and crypto protocols are the two client types most likely to pay late, pay in tokens, or run out of money. Terms, deposits, and scope need to be part of the brand's operating rules, not an afterthought. Logged so it gets decided later.

**Consequences:** Portfolio and copy are written for founders, not design managers. Case studies emphasize ownership and shipped outcomes over process polish.

---

## 0009 — Name and persona

- **Date:** 2026-09-08
- **Status:** Accepted (Timothy, 2026-09-08). Sub-question resolved: twocakes stays a handle only, no role in the brand.

**Question:** On X he is "tim" at twocakes__. On the site he is "Timothy Ali" in a formal Swiss grid. Which is the brand?

**Timothy's input:** Goes by tim everywhere. Chose timothyali.com because it felt more professional. Resonates more with "tim" than "Timothy Ali". Describes himself as mellow or nonchalant on the outside, extremely passionate about aesthetics and design on the inside.

**Options considered:**
1. Timothy Ali everywhere. Professional, searchable, but it is a name he does not identify with, and the feed would have to be rebranded toward formality.
2. tim everywhere. Honest, matches the voice, but "tim" alone is ungoogleable and cannot be a domain, an SEO entity, or a LinkedIn name.
3. Split by layer: "tim" is the brand voice and display identity; "Timothy Ali" is the legal/searchable entity (domain, SEO schema, LinkedIn, invoices).

**Recommendation:** Option 3. The brand is tim. The domain, page titles, and structured data stay Timothy Ali so a founder who hears about "tim" can still find him. The site should feel like the X feed, not the other way round: lowercase, direct, a person talking.

**Reasoning:** The "professional" instinct behind timothyali.com produced a site that feels like it belongs to someone else. The target reader (0008) is a founder, who hires a person, not a firm. The mellow-outside, obsessive-inside description is the brand's actual tension and should drive the identity: calm surface, relentless craft underneath.

**Open sub-question:** whether "twocakes" gets any role beyond the X handle. Leaning no: it is a handle, not a name, and the GitHub is under a different one (tasyusef).

**Consequences if accepted:** Site copy is rewritten in first person, lowercase where the voice calls for it. Display name on X stays "tim". Bio gets rewritten to the new positioning. The wordmark question (0003 identity work) starts from "tim", not "Timothy Ali".

---

## 0010 — Positioning statement

- **Date:** 2026-09-08
- **Status:** Accepted (direction). Wording is a draft and will be tuned during identity work.

**Question:** The one sentence a seed-stage founder or crypto protocol reads first.

**Options considered (all written in tim's voice, for a founder reader):**
- A. "tim. designer for teams that don't have one yet. brand, product, front end. shipped."
- B. "i design and build the whole thing. brand to product to code, for early teams that need it done, not handed off."
- C. "founding designer for hire. i've cofounded three products. i'll help build yours."

**Claude recommended:** C with A's tail, on the grounds that the cofounder history is the one thing other freelancers cannot claim.

**Decision:** A. Timothy's pick.

**Reasoning (Timothy):** A sounds more like something he would actually say. More concise, his style. C, in Claude's own words, risked reading as a job application; A reads as a statement.

**Consequences:** The offer leads with who it is for (teams without a designer) and what gets delivered (brand, product, front end, shipped). The cofounder proof moves to the second beat: supporting copy, About page, case studies. It is not dropped.

---

## 0011 — Visual direction for the identity and site

- **Date:** 2026-09-08
- **Status:** Accepted (direction). Specific type, color, and 3D choices are separate future entries.

**Question:** What survives from the current Swiss-modernist site, and where does the new identity go?

**Timothy's brief:**
- Keep Swiss influence in the grid. The grid shows professional foundations.
- Stop defaulting to sans-serifs. Be more expressive with type.
- Break the grid and its rules occasionally.
- Use Three.js so the site does not feel entirely flat.
- The feeling: opening the site should feel like stepping away from the rest of the internet.
- Spend real time on the wordmark, the type system, and the color system.
- Wants a full-viewport landing and/or an intro animation.

**Decision:** Direction accepted as stated. The identity is built in this order, per 0003: wordmark ("tim", per 0009) → type system → color system → grid rules and when they break → 3D concept → site.

**Reasoning:** The grid is the credibility layer for founders (structure, restraint). Expressive type and depth are the personality layer (the "obsessive inside" from 0009). Keeping both is the brand tension made visual. The current site has the first layer only, which is why it reads as generic.

**Consequences:** Type exploration starts with the wordmark, since three letters is a gift for a wordmark and the wordmark will set the type direction. References from Timothy are needed before any type is proposed (Q12).

**Point of disagreement, unresolved:** Claude pushes back on a blocking intro animation. See 0012.

---

## 0012 — Intro animation vs. full-viewport landing

- **Date:** 2026-09-08
- **Status:** Accepted (Timothy agreed 2026-09-08)

**Question:** Timothy wants "a cool intro animation for when you open the site" or a full-viewport landing. Are these the same thing?

**Claude's position:** No, and the distinction matters.
- A **gate**: a loader, curtain, or sequence that plays before the visitor can do anything. Recommended against. The target reader (0008) is a founder skimming ten portfolios. Anything that makes them wait costs the visit. It also undercuts the "designer who ships production work" claim: a site that performs is itself the proof.
- An **entrance**: a full-viewport first screen that is interactive immediately, where the 3D and type animate in while the visitor can already scroll or click. Recommended for. This can deliver the "stepping away from the internet" feeling without the cost.

**Recommendation:** Full-viewport landing with an entrance, never a gate. Rules: content is usable within a second on a normal connection, the 3D loads progressively and degrades on mobile and under prefers-reduced-motion, and nothing ever plays twice for a returning visitor.

**Consequences if accepted:** The 3D concept is designed as a living first screen, not a preroll. Performance budget is set before the 3D work starts.

---

## 0013 — 3D concept seed: Do Androids Dream language, Object shape

- **Date:** 2026-09-08
- **Status:** Accepted, with Claude's concern 1 overruled (see 0014) and concern 3 resolved by 0015

**Timothy's reactions to references (docs/references.md):**
- Likes Hubtown: one hero object, mouse reveal.
- Likes Mat Voyce a lot: type that responds to scroll direction and hover.
- Idea: merge the visual style of his 2023 "Do Androids Dream?" title sequence (yellow and black, flat vector silhouettes, a single chromatic-aberration effect, heavy condensed grotesk, Saul Bass reference) with Three.js and use it to tell his design story on the site.
- Likes Aristide Benoist: the simplicity, and how smooth the movement is.
- Wants the brand nailed before any of this is built.

**Read on the three likes together:** Hubtown (one object), Mat Voyce (type that moves), Aristide (simple, smooth). All three are restrained sites with one idea each. None of them is loud. That is worth holding against the yellow/black instinct below.

**What this implies:** 3D shape is Object with a narrative reveal (Q15), not World. Flat-shaded, unlit materials in Three.js would reproduce the DAD look faithfully and cheaply, and would look like nothing else in the 3D-portfolio genre, which is almost all glossy, lit, gradient work.

**Claude's concerns, to be resolved before this is accepted:**
1. **Palette vs. persona.** 0009 describes the brand as calm on the surface, obsessive underneath. Yellow and black is the loudest two-color combination there is (hazard tape, Wu-Tang, Kill Bill). It is not a calm surface. The DAD *principles* (a two-color world, silhouette, one effect only, restraint) are very tim. The DAD *palette* may be the film's, not his.
2. **One project becoming the whole brand.** If the personal identity is built from a single 2023 piece, the brand reads as "the guy who did the yellow thing." Take the language, not the artifact.
3. **Story vs. gate.** "Tell my design story" as a scroll narrative is a step toward the World shape and toward the gate that 0012 ruled out. It can be done as an entrance (Hubtown-style reveal that unfolds as you move) but the scope has to be watched.

**Recommendation:** Accept the DAD *language* as the seed for the 3D concept and the identity: flat silhouette, two-color discipline, a single signature effect, heavy graphic type. Leave the specific palette open until the color system entry. Shape is Object with reveal.

**Consequences if accepted:** Wordmark and type exploration start from the condensed-grotesk-plus-restraint end of the spectrum rather than from the serif pairings in references.md section B. Mat Voyce's scroll-direction type behavior becomes the reference for how the wordmark and headings move.

---

## 0014 — Palette: yellow and black

- **Date:** 2026-09-08
- **Status:** Accepted. Exact yellow to be tuned in the color-system entry.

**Question:** Is the Do Androids Dream palette the brand, or only its language?

**Claude's position:** Language yes, palette open. Argued that yellow/black is the loudest two-color pairing available and does not match the "calm surface" half of 0009, and that building the identity from one 2023 piece risks the brand becoming that piece.

**Decision (Timothy, overruling):** Yellow and black is the brand. "I like the yellow and black. I think it fits me well. Same with the visual style of the piece." Yellow is primary; the exact hue is still to be adjusted.

**Reasoning (Timothy, when asked):** He disagrees with the premise that yellow/black is loud. Color, type, and movement are the three channels he wants to express himself through; the Swiss influence stays constant in the layout. The site has to be unique, not another flat website. Claude's dissent stands as logged; the decision is his.

**Consequences:** The site is light, not dark. Dark-mode-primary from the old site does not survive. The color system's job is now to find the yellow that reads as tim rather than as hazard tape, and to define how much of any screen is yellow versus black versus white (if white exists at all). The "calm surface" of 0009 has to come from layout, spacing, and motion rather than from color.

---

## 0015 — 3D shape: flat shapes moving through 3D space

- **Date:** 2026-09-08
- **Status:** Accepted

**Question:** World, Object, or Material (Q15)?

**Decision (Timothy):** The same 2D vector shapes and visuals as the DAD video, moving through 3D space with parallax.

**Claude's read:** This is a multiplane camera: flat layers at different depths, a camera that moves. Cheaper than any lit 3D scene, faithful to the source language, and rare in the 3D-portfolio genre. It resolves 0013 concern 3 because parallax is inherently an entrance, not a gate: the scene exists on load and responds to input, nothing has to play first.

**Consequences:** Three.js work is orthographic or near-orthographic, unlit materials, layered planes, camera and parallax driven by scroll and pointer. The chromatic-aberration effect from DAD is the one post-process. Performance budget stays as in 0012.

---

## 0016 — Wordmark approach

- **Date:** 2026-09-08
- **Status:** Accepted

**Decision (Timothy):** A chosen typeface, set with care. Not custom-drawn letterforms.

**Reasoning:** Timothy's call ("probably a chosen typeface"). Claude agrees: three letters set in the right face at the right weight, with the tracking and the yellow field doing the work, is enough. Custom drawing is scope that does not move a founder.

**Consequences:** Type exploration is a typeface search, starting from the heavy condensed grotesk direction of the DAD title. Case (tim vs TIM) and licensing budget are open (Q20, Q21).

---

## 0017 — Sites tim does not want to be compared to

- **Date:** 2026-09-08
- **Status:** Accepted

**Decision (Timothy):** Not Bruno Simon, not Samsy. "Not a big fan of those."

**Consequences:** No drivable worlds, no first-person exploration, no cyberpunk. Confirms 0015's flat-layer direction.

---

## 0018 — Wordmark: "Timothy Ali" in a modern blackletter, on the Swiss grid

- **Date:** 2026-09-08
- **Status:** Accepted (Timothy, 2026-09-08). Layering confirmed: wordmark Timothy Ali, voice tim. Streetwear reading acknowledged and accepted ("I don't mind it"); rationing still applies as the design rule.

**Timothy's direction:** Go back to "Timothy Ali" for the wordmark. Display type is a modern blackletter, set inside the Swiss grid, going directly against the Swiss/Bauhaus line of thought.

**Why this is strong:** Swiss modernism was, historically, the rejection of blackletter (Tschichold's break with Fraktur is the founding story of the whole style). Putting a blackletter on a Swiss grid is not decoration, it is an argument, and it is the "break the rules occasionally" from 0011 made structural. Combined with the flat yellow/black parallax world (0014, 0015) it is a combination Claude has not seen on a designer portfolio.

**Reconciliation with 0009 (tim vs Timothy Ali):** 0009 does not need to be reversed. It already splits the brand into layers: tim is the voice and display identity; Timothy Ali is the entity. A wordmark is an entity mark. So: **the wordmark reads "Timothy Ali", the copy still talks like tim.** What changes is only that the wordmark, not just the domain, carries the full name. The reason is typographic and honest: blackletter needs length and ascenders to sing, and "tim" gives it three letters and nothing to do.

**Claude's concerns:**
1. **Genre drift.** Blackletter plus yellow/black currently reads as streetwear, hip-hop, or metal merch before it reads as product design. That is the same neighborhood as Wu-Tang. A founder should see a designer, not a clothing label. Mitigation: the blackletter is rationed (wordmark, a few display moments), the grotesk does all the working type, and the Swiss layout is visibly disciplined. Timothy should decide with this reading in mind rather than discover it later.
2. **"Modern blackletter" is itself a trend** (2020s streetwear and music revival). The uniqueness comes from the grid and the flat 3D, not from the blackletter alone.
3. **Legibility.** Blackletter is display-only. Headings that carry information stay in the grotesk unless the chosen face is simplified enough to read at a glance.

**Consequences if accepted:** The wordmark type search (0016) moves from condensed grotesk to modern blackletter. Case question (Q20) is answered by the name: mixed case "Timothy Ali". The type system becomes three voices: blackletter display, Swiss grotesk for everything that has to be read, mono for data (the one thing worth keeping from the old system). DAD's condensed grotesk becomes a candidate for the working sans, not the wordmark (Q22 still open).

---

## 0019 — Wordmark shortlist from sheet 01

- **Date:** 2026-09-08
- **Status:** Proposed (shortlist, not a pick)

**Sheet:** `docs/explorations/wordmark-sheet-01.html`, nine Google-hosted blackletters.

**Timothy's shortlist:** 05 UnifrakturCook and 08 Jacquard 24.

**Not chosen:** 01 Grenze Gotisch and 02 Texturina (Claude's leans), 03 Germania One, 04 UnifrakturMaguntia, 06 Pirata One, 07 New Rocker, 09 Almendra Display.

**Claude's read of the pair:** Both are the heaviest, bluntest faces on the sheet. Timothy is choosing mass and graphic flatness over calligraphic refinement, which is consistent with the DAD language (flat silhouette, no gradients) and with the "not another flat website" goal being about depth and conviction, not delicacy. Claude's leans were the "designer, not band" faces; Timothy is not optimizing for that, which is coherent with 0018 (streetwear reading accepted).

**Two things to resolve before either becomes the wordmark:**
1. **Pixel vs vector.** Jacquard 24 is a pixel face. The 3D world (0015) is DAD vector. A pixel wordmark over a vector world is two rendering languages on one screen. It could be the tension that makes the site unique, or it could read as two brands. The PARC pixel lineage (PARC Pixel typeface, Rowboat Racer) makes the pixel choice feel earned rather than borrowed, which counts in its favor.
2. **Quality at wordmark size.** UnifrakturCook is a free digitization of a 1920s face. Curves and joins need checking at 140px+ before it is trusted as the mark. Amador and Fette Fraktur are the round-two faces in the same territory with professional drawing.

**Reasoning (Timothy):** The other seven are not really blackletter, or did not speak to him. 08 Jacquard 24 speaks to his past pixel-art work (NFT era, PARC) and has a techy feel he enjoys. The pixel-over-vector question is not a concern for him.

**Process note:** Claude's two "things to resolve" above (digitization quality, pixel vs vector) were called misplaced effort by Timothy at this stage. He is right: they are execution checks, not direction questions, and belong at build time. Logged so the record shows the correction.

**Next:** Sheet 02, narrowed to the heavy direction: 05 and 08 at multiple sizes, both over a flat DAD-style backdrop, plus Amador and Fette Fraktur if they can be sourced, plus Jacquard 12 as the finer-grid sibling of 08.

---

## 0020 — Wordmark face: Jacquard 24

- **Date:** 2026-09-08
- **Status:** Accepted

**Decision (Timothy):** Jacquard only. UnifrakturCook dropped. One blackletter, not two.

**Reasoning:** Timothy: "I don't think we use both fonts here." Jacquard speaks to his pixel-art past (NFT era, PARC) and has a techy feel he enjoys (0019). One face is simpler and more his than a pairing.

**Consequences:** Wordmark and blackletter display moments are both Jacquard 24, with Jacquard 12 available for small sizes. The working sans and mono are still open (type-system entry). Sheet 02's role mockups are void, see 0021.

---

## 0021 — The landing page is the DAD world, moved through on scroll

- **Date:** 2026-09-08
- **Status:** Accepted. Revises 0015.

**What happened:** Sheet 02 included two nav-and-headline mockups. Timothy: they are the same as the current site, and that is exactly what he does not want. Claude defaulted to the Swiss template (nav row, headline, index list) instead of designing from the world.

**Timothy's concept, stated plainly:** Take the world from the Do Androids Dream video and apply it to the landing page. As you scroll, you move through a cyberpunk silhouette world made from flat shapes. Three.js is there for a reason: to move through the world.

**Revision to 0015:** 0015 described flat layers with parallax. That stands as the rendering method, but the shape is a **world on rails**: a scroll-driven camera path through layered flat silhouettes. It is not free-roam (Bruno Simon, 0017) and it is not a gate (0012): the world is present on load and the visitor drives it with scroll. The page's structure comes from the journey, not from a grid template with a scene behind it.

**Consequences:**
- The Swiss grid moves off the landing page's spine. It governs the inner pages (work, about, writing) and the typography, not the landing composition. To be confirmed (Q28).
- Next deliverable is a storyboard of the scroll journey, not a layout: what is on screen at each beat, what the camera does, what the copy says. DAD's three acts (flat title field → skyline and credits → perspective breaks, road converges, sunrise) are the obvious spine (Q29).
- Layout mockups of the landing are not made again until the storyboard is agreed.


---

## 0022 — Exact DAD video as environment and scroll-story reference

- **Date:** 2026-09-08
- **Status:** Accepted (explicit user instruction)

**Source:** `/Users/twocakes/Desktop/PROJECTS/timothyali/static/videos/DO_ANDROIDS_DREAM_-_Title_Sequence.mp4`

**Decision (Timothy):** “this video is what i want to serve as reference for the site. for the. environment and for the scroll story”

**Context and reasoning:** This identifies the exact source for the DAD world requested in 0021 and confirms that it guides both the environment and narrative progression. Earlier reasoning remains in 0013–0015 and 0021; no additional motivation is inferred from this message.

**Alternatives:** No new alternatives were discussed in this exchange.

**Consequences:** Use the actual film when developing the storyboard. `docs/dad-video-reference.md` records sampled-frame observations separately from proposed site translations. The film includes an inverted skyline/road composition and a radial architectural composition around a yellow disc and human figure; the previous “road/sunrise” summary is incomplete. Exact scene mapping, copy, and inner-page scope remain unresolved. This decision does not approve a shot-for-shot adaptation or a final storyboard.


---

## 0023 — Landing narrative and separation of Work

- **Date:** 2026-09-08
- **Status:** Accepted (Timothy: “agreed”, in response to the proposed structure and story arc)

**Question:** What story should the animated landing tell, and where should projects and case studies live?

**How we arrived here:** Timothy proposed using the animated landing to introduce himself, with work and case studies on separate pages. Codex recommended connecting that introduction to what he brings to a team, and proposed four narrative beats. Timothy agreed.

**Decision:**
- Main structure: Home / Work / Contact. Work has a dedicated project index and individual case studies. Contact is a destination; its exact implementation is undecided.
- The landing introduces tim, his values, the way he works, and his credibility, ending in invitations to explore Work or make contact.
- Four beats: meet tim → what he cares about → how he works and why to believe him → where to go next.
- Intended emotional progression: curiosity → connection → confidence → a next step.
- Work is accessible immediately through navigation; finishing the scroll story is not required to reach it.
- Brief proof such as product names or links can support the landing story. Detailed project presentations live on Work. Which proof to include is still open.
- A separate About page is optional; the landing already supplies the essential introduction.

**Reasoning presented with the proposal:** The visitor should understand tim's taste, what he can own for a team, and why they should look at his work. Separating detailed case studies gives the introduction a focused narrative while letting someone evaluating the portfolio reach evidence directly. This is the rationale Timothy agreed to; no additional personal motivation is inferred.

**Options considered:** A landing introduction with separate project presentations, plus an optional longer About page. Light proof on the landing was proposed to establish credibility. No other site architectures were evaluated in detail.

**Consequences:** Develop writing and storyboard from this accepted arc. The example copy in the conversation remains draft wording, not final approved text. Exact film-to-story mapping, camera path, selected proof, and inner-page visual treatment remain open. See `docs/landing-story.md`. Q28's page-role question is settled; its inner-page treatment question remains open. Q29 now concerns spatial mapping rather than the narrative's purpose.


---

## 0024 — Landing copy v1 accepted

- **Date:** 2026-09-08
- **Status:** Accepted (Timothy: “yeah this sounds really good tbh”)

**Question:** Does the first full landing-copy draft sound like tim and express the accepted four-beat narrative?

**Decision:** Use the main narrative and the two action labels in `docs/landing-copy-v1.md` as the accepted landing copy. Preserve its first-person, lowercase voice. The optional founder credit remains an optional supporting element; its inclusion and presentation are still open.

**Reasoning and provenance:** Timothy responded positively when asked whether the draft sounded like him or was too composed: “yeah this sounds really good tbh”. This establishes approval of the copy and voice. He did not provide a more detailed rationale; the editorial reasoning in the copy document remains Codex's explanation, not an attributed user motive.

**Options considered:** The earlier illustrative wording in the narrative proposal and this first complete draft. Draft 01 replaces the abstract “details you feel before you notice” line with “i get pretty invested in the things i make” and explicitly includes motion in his range. No second full draft was requested.

**Consequences:** Use the accepted text when developing the spatial storyboard. Line breaks and distribution across scenes can be explored without silently rewriting the wording. The storyboard, camera movement, and optional founder credit are not settled by this copy approval.


---

## 0025 — Scroll storyboard 01

- **Date:** 2026-09-08
- **Status:** Proposed — revision requested; see 0026 and storyboard 02

**Question:** How should the accepted landing copy move through the supplied DAD world?

**Proposal:** Six connected shots across four narrative beats: arrival → skyline → inside the city → road beneath the inverted skyline → radial opening → expanded clearing with invitation. Camera approaches the same architecture, passes between its layers, follows the road, and tilts upward before settling at the destination. Read `docs/storyboards/storyboard-01.md` and its companion image.

**Reasoning (Codex):** Moving from a distant view to a position inside the city gives the environment a meaningful spatial progression. Splitting the values and experience beats gives each passage reading room. The film's road composition accommodates the longest passage. Expanding its radial opening gives the closing invitation a stable destination.

**Choices made for this proposal:** Use architectural occlusion to enter the inverted skyline without a full camera roll; keep narrative text level; end in an open yellow space rather than carrying over the film's blackout; omit the film's figure and the optional company credit from this first illustrated version. These remain reviewable choices, not accepted exclusions.

**Consequences if accepted:** Develop the camera path and a motion study around these shots, preserving copy accepted in 0024. This board does not finalize the working sans, exact yellow, wordmark setting, navigation design, scroll length, or inner-page visuals. The generated image's lettering is a placement guide.


---

## 0026 — Grid, perspective, display weight, and selective blackletter

- **Date:** 2026-09-08
- **Status:** Accepted direction (explicit user feedback); exact revision remains proposed

**Timothy's feedback:** Wants text somewhat tied to a grid, matching the scene's perspective so it feels less flat; wants heavier display type; it need not all be lowercase; wants blackletter selectively, possibly emphasizing particular words. He also questioned whether some passages felt wordy.

**Decision:** Keep deliberate typographic alignment while allowing narrative text to share scene perspective. Pursue heavier display typography, flexible casing, and selective Jacquard blackletter emphasis. The personal voice does not require uniformly lowercase visual presentation. Revise the board and explore tightening the copy.

**Reasoning (Timothy):** The first board felt too flat. He wanted the text's grid, perspective, weight, and blackletter use to contribute to the design. His wordiness concern motivates an edit proposal, not a presumption that every passage must be shortened.

**Revisions to earlier records:** This direction supersedes 0025's proposed screen-level-text rule and relaxes 0024's uniformly lowercase presentation. It does not by itself replace the accepted wording in 0024, select a specific heavy sans, or approve every scene from storyboard 01.

**Response for review:** `docs/storyboards/storyboard-02.md` and image; `docs/landing-copy-v2.md`. Codex proposes local text grids projected with architectural planes, Jacquard emphasis on “invested” and “building”, and shorter middle passages. These specific choices await Timothy's feedback. Previous versions are preserved.


---

## 0027 — Megacity, distinct scenes, and positional continuity

- **Date:** 2026-09-08
- **Status:** Accepted requirements; storyboard 03's specific solutions remain proposed

**Timothy's requests:** Make scenes 2 and 3 more distinct in layout, suggesting two different billboards in a cyberpunk Times Square-style scene. Make 5 and 6 more distinct. The city should be large, futuristic, Blade Runner/cyberpunk, and somewhat dystopian. Also work out the transitions and how the scenes relate positionally.

**Decision:** Revise the environment toward a dense futuristic megacity, differentiate the compositions of the two scene pairs, and plan the camera's route and transitions as part of the storyboard. Preserve the yellow/black world, grid/perspective typography, heavy display direction, and selective Jacquard use.

**Reasoning:** The user identified repeated layouts in 02/03 and 05/06 and requested a stronger city character. The follow-up explicitly requires spatial relationships and transitions. No additional personal motivation is inferred.

**Proposed response:** Storyboard 03 tests a wide gantry billboard over a junction, followed by a portrait sign around the corner in a canyon; an enclosed upward view beneath a megastructure, followed by a rooftop panorama. A plan/elevation diagram connects all six scenes through an approach, descent, street turn, transit ramp, understructure, and exterior rise to the overlook. The suspended megastructure provides the physical interpretation of the source's inverted skyline.

**Alternatives and history:** Storyboard 02's two large face-mounted text treatments and two radial yellow-sky endings remain preserved. Storyboard 03's final rooftop view replaces the circular opening as the proposed destination. User approval of the exact billboard arrangements, ending, camera route, or reduced copy is not inferred.

**Consequences:** Read `docs/storyboards/storyboard-03.md`, `storyboard-03.png`, and `storyboard-route-03.svg` together. Six key views now have explicit relative locations and five proposed transitions. A later motion study should demonstrate continuity with shared geometry. Generated architecture detail and illustrative type are not a final production specification.

---

## 0028 — Build v1 with a simplified editable vector environment

- **Date:** 2026-09-08
- **Status:** Accepted (explicit implementation request)

**Timothy's instruction:** “lets build out this v1” with an environment simplified from the generated boards, closer to the original source's vector illustration style, ideally made from SVGs or another editable vector format.

**Decision:** Begin the working SvelteKit implementation using the latest storyboard and connected route as the starting point. Author the city as editable vector assets. Preserve the futuristic, slightly dystopian scale and the differentiated billboard/ending compositions, while reducing visual detail to deliberate silhouettes and flat shapes.

**Reasoning (Timothy):** Wants the same style and vibe with more of the original video's vector illustration character, and wants to be able to tweak the artwork easily.

**Implementation interpretation (Codex):** Use SVG source silhouettes loaded into unlit Three.js geometry, plus live type on scene-aligned planes. Keep the path, placement, palette, and copy in editable source files. Use the shorter copy shown in the latest storyboard as the working v1 copy, preserving the previous accepted copy for comparison. The build request authorizes a reviewable implementation; it does not make every exact font, path coordinate, or wording irreversible.

**Consequences:** Generated storyboard PNGs are reference only and are not runtime city assets. No photoreal surfaces, dense window grids, or crowds are required. Preserve the original website; v1 lives in timothyali2. Work and Contact remain reachable throughout. A static readable story supports reduced motion and unavailable WebGL. The new font choice used to implement the heavy display direction remains an implementation candidate for review.

---

## 0029 — Blackletter opening headline

- **Date:** 2026-09-08
- **Status:** Accepted (explicit change request)

**Timothy's instruction:** Make “i'm tim” blackletter.

**Decision:** Apply the existing Jacquard 24 face to the entire opening headline, in both the animated scene and the readable fallback.

---

## 0030 — Clearer city silhouettes and stronger travel through the city

- **Date:** 2026-09-08
- **Status:** Accepted revision requirements (explicit user feedback); revised implementation in progress

**Timothy's feedback:** The city feels noisy, with scene 02's overlapping black shapes called out as an example. He wants the journey to feel more like traveling through a city, and wants futuristic skyscraper shapes and diagonals rather than an environment dominated by black rectangles.

**Additional feedback:** “the road also just ends and gets cut off.”

**Follow-up on the angular revision:** “Yeah those new ones go too far. We need somewhere in the middle.”

**Middle-ground direction — subsequently superseded:** Bring the silhouettes back toward the original buildings, using the new futuristic forms more sparingly. A working revision combined mostly straight-sided, stepped buildings and flat crowns with a few restrained chamfers or diagonal accents. Timothy's following image-specific approval supersedes this request.

**Latest approval:** Timothy supplied the two-column `silhouette-revised.png` comparison and said, “Oh actually these are good”. The approved shapes are the right-column structural correction shown in that image: vertical shafts with angular crowns, a broad notched slab, a split spire, the skyline with mostly diagonal crowns, and rectangular hanging buildings with slanted ends. This identifies the version before the middle-ground edit, not the earlier tapered/crystal-like pass or original v1 silhouettes.

**Result:** Restore those exact five approved SVGs from the saved pre-middle-ground snapshot. Preserve the skyline's 3600×300 viewBox and three repeated districts. This approval settles the illustrated silhouette set; city placement, road continuity, and the camera journey still require implementation and review under the original requirements above.

**Further request — mix both sets:** “But I still want some of the originals in there too. I think we can have more variety”. Timothy wants the approved right-column structural correction and some of the original left-column building profiles together. The new shapes remain approved; this supersedes an interpretation that the environment should use the new set exclusively.

**Working implementation response:** Retain the approved new assets, add the three original tower silhouettes and original skyline as separate classic variants, and mix those variants among existing placements. This is an implementation approach to the requested variety, not approval of a particular ratio or placement pattern. Preserve the requirement to reduce visual noise rather than treating variety as a request for greater density.

**Decision:** Revise the city composition and silhouettes to reduce visual noise, strengthen the impression of moving through the city, and give the architecture more distinctive futuristic skyscraper forms and diagonal geometry. Make the road read as continuous through the journey rather than ending in a visible cutoff. Preserve the simplified, editable vector illustration direction established in 0028.

**Reasoning and provenance:** Timothy identified the current city's noise, rectangular appearance, and abruptly ending road, and requested a stronger experience of travel through it. His later image-specific approval and request to mix both sets are recorded above. Exact density, variant ratio, camera route, and final composition remain open to review.

**Consequences:** Review the transitions between the reading stops alongside the stops themselves, especially the approach to and movement through scene 02. Keep the current narrative and typography direction, including 0029's blackletter opening, while revising the environment. Record specific implementation choices as working revisions rather than new accepted brand decisions. Earlier validation describes the previous version; check the revised world after changes stabilize.

---

## 0031 — Lowercase opening headline

- **Date:** 2026-09-08
- **Status:** Accepted (explicit change request)

**Timothy's instruction:** Make “i'm tim” lowercase.

**Decision:** Use “i’m tim.” in both the animated opening and readable fallback, retaining Jacquard 24 blackletter.

---

## 0032 — Restore storyboard 03 compositions, atmospheric depth, and angular roads

- **Date:** 2026-09-08
- **Status:** Accepted correction requirements; the resulting implementation was subsequently rejected visually in 0033 despite passing behavioral checks

**Timothy's feedback:** The current result looks broken, and the distant buildings do not look right. Return to the compositions and haze of storyboard 03. Roads should use straight lines and angles rather than curves. He also suggested yellow sky and ground with black buildings and roads.

**Decision:** Rework the city around storyboard 03's six compositions and visible separation between foreground, intermediate structures, and distant haze. Keep the editable, simplified vector rendering and the requested mix of original and approved newer silhouettes. Replace the visibly curved street with deliberate straight segments and angular junctions while preserving road continuity. The lowercase Jacquard opening and the landing narrative remain unchanged.

**Working visual trial:** Test yellow sky and ground with black buildings and roads. This is a response to Timothy's suggestion for the revision, not final approval of a permanent palette treatment or every resulting composition.

**Implementation interpretation:** Use a distinct destination megastructure as the large anchor in the opening and reconnect it to the later scenes. Recover the wide junction, narrow canyon, straight transit-road perspective beneath an overhang, enclosed upward view, and open rooftop panorama as compositionally distinct views along the same route. The new anchor is additional artwork; it does not replace the approved building-profile mix. Exact asset geometry and placement remain reviewable implementation choices.

**Reasoning and provenance:** Timothy rejected the current appearance and explicitly referred back to the storyboard's compositions, haze, and angular road treatment. The prior 149 passing browser checks establish behavior in that version; they do not constitute visual approval or proof that the storyboard was reproduced.

---

## 0033 — Match the storyboard keyframes through continued visual iteration

- **Date:** 2026-09-08
- **Status:** Accepted correction request; hybrid pass 3 implemented and technically verified; visual review remains open

**Timothy's feedback:** The result still does not match storyboard 03. The shapes feel rough, the monolithic/brutalist architectural mass is missing, the road appears to float on sticks, waterways are missing, and the approach into the canyon does not read. Continue iterating until the actual storyboard perspectives and keyframe compositions are achieved. He suggested using actual 3D geometry alongside SVGs.

**Decision:** Treat the six storyboard keyframes, their perspective, spatial enclosure, and connecting approaches as the visual targets. Revise architectural mass, road support/integration, waterways, and the canyon approach as part of that work. Preserve the simplified graphic identity and the established narrative while continuing implementation and direct visual comparison.

**Working implementation choice:** Use a hybrid scene: actual 3D geometry for major architectural masses and infrastructure, alongside editable SVG silhouettes where they remain useful. This is an implementation response to Timothy's suggestion, not a new brand approval or permission to treat the generated storyboard's surface detail as a final asset specification. Exact geometry and the resulting images remain reviewable.

**Reasoning and provenance:** Timothy explicitly rejected the latest appearance after its technical checks passed. The previous 149 browser checks, navigation checks, and canopy checks remain evidence of prior behavior only. They do not demonstrate that the intended storyboard composition, architectural character, or sense of movement was achieved.

**Consequences:** Compare each rebuilt view directly against its corresponding storyboard panel at a matching aspect ratio, and review the approach/departure between keyframes. Keep the prior versions and their approvals/rejections in the record. Continue the authorized correction; the next review should show concrete revised compositions rather than rely on test counts as evidence of visual completion.


**Working implementation record — hybrid pass 3:** Three successive geometry and camera revisions have replaced the thin major cutouts with solid stepped building masses, deep facade returns, occupied plinths, extruded SVG landmarks, a continuous angular viaduct with broad supports, and two longitudinal canals plus a cross canal. The camera establishes the approach through a sustained canyon before moving beneath the hanging complex, looking upward at an oblique bridge face, and reaching an open rooftop with a receding parapet and water corridor. The junction billboard and frame share a 0.95-radian yaw; the experience bridge/text use 0.5 radians; the rooftop uses −0.4 radians. These are implementation settings, not new accepted design requirements.

**Current review evidence:** The six live built frames were captured at their corresponding storyboard panel aspect ratios and paired directly with those reference crops. Root visual review found the perspective direction materially improved after these passes. Timothy has not yet approved the resulting implementation; matching the actual keyframe perspective and the movement between keyframes remains the governing objective. Hybrid pass 3 passed 149/149 browser checks and 7/7 focused navigation checks before the final bounded ground-contact and portrait-overlook adjustments; sixteen desktop travel captures completed without browser errors. The final changes passed targeted checks at the 320px endpoint (7/7), 390px approach at progress .94 (7/7), and 390px endpoint (7/7), plus a clean code check and production build. Independent geometry audits found no camera intersections, including the final portrait rise, and the road-tail exposure candidates were occluded. The final road-end audit sampled 4,001 positions from progress .89 to 1: visible endpoints remained at depth 1,951 or greater, beyond the fog end at 1,650. Implementation verification is complete for this handoff; Timothy’s visual judgment remains open.

**Working palette update:** Olive ground and brighter canal surfaces now distinguish water from land beneath the yellow sky and ink/olive architecture. This revises the earlier yellow-ground trial to support the requested spatial reading; it is not final brand approval. The source remains editable through TypeScript geometry/camera definitions and retained SVG profiles. The generated storyboard remains a reference, never a runtime background.


**Final bounded corrections:** The lowest solid tower body now meets `GROUND_Y` without changing its top height. The portrait scene 06 camera and invitation rise together by up to 26 units with a smoothstep blend, revealing more city beyond the near deck. These are working framing and geometry corrections; the desktop reference composition remains unchanged. Current source and review images are packaged as a hybrid environment-source extract, with technical verification distinguished from Timothy’s still-open visual review.


---

## 0034 — Refine the structures, replace the inverted scene, and lowercase the tall sign

- **Date:** 2026-09-08
- **Status:** Accepted correction requirements; resulting implementation remains open to visual review

**Timothy’s feedback:** The city visibly ends and needs geometric distant terrain. Rails appear detached; the tall billboard needs blackletter; the upside-down city and road-stretched lettering should be reworked; the bridge surroundings are boxy with stray bars; and the last terrace feels cheap during the approach. Perspective remains essential.

**Clarification:** Timothy confirmed that the intended blackletter billboard is the tall LOOK / MOVE / WORK sign. After seeing uppercase Jacquard, he explicitly requested lowercase. Its three words now read “look.”, “move.”, and “work.”, retaining the uppercase HOW THEY labels and rules.

**Working implementation:** Faceted terrain closes the sides of the city basin; a vertical oblique civic facade replaces the inverted complex and stretched road lettering; two angular abutments carry the inhabited bridge; and a grounded waterfront building carries a deep roof terrace with solid parapets. The camera passes under the bridge before rising. Detached roof antennas now follow actual roof heights. The final headline begins appearing later in the ascent. These are reviewable implementation choices responding to the request, not additional brand approvals.

**Collaboration instruction:** Timothy explicitly said “no orchestration skill.” Delegated work was stopped; subsequent implementation and review were done directly. Preserve this preference for continuation.

**Validation:** The geometry revision passed `pnpm check` (zero errors/warnings), the production build, 125 browser checks covering desktop, 390px/320px and fallback modes, and seven navigation/remount/reverse-scroll checks. Sixteen desktop and sixteen mobile travel positions were captured without browser errors before the final antenna and headline-entry corrections; a targeted desktop .96 capture verified the corrected headline entry. An instrumented browser audit sampled 1,001 actual rendered camera positions per desktop/mobile viewport against candidate solid geometry, using local boxes and ray-intersection parity for extrusions; no camera-center intersections were found. This is a sampled clearance check, not a continuous-volume proof. The final lowercase text edit was confirmed in the live DOM with Jacquard 24. Technical checks support behavior, not visual acceptance.


---

## 0035 — Give the experience bridge context, windows, and blackletter

- **Date:** 2026-09-08
- **Status:** Accepted correction request; implementation remains open to visual review

**Timothy’s feedback:** Scene 05 still feels boring and disconnected from the surrounding city. Its walls read as black rectangles, with no scattered windows or blackletter.

**Working revision:** Correction 0035 refines scene 05 after Timothy said it still lacked context, scattered windows, and blackletter. The bridge now includes windowed side sections and visible angled supports; nearby front and side facades carry irregular clusters of recessed, lit windows. A farther tower adds another depth layer. The camera stops farther back with a wider desktop lens and a lower look target so the turning road and bridge underside are visible. “products.” and “theirs.” now use lowercase Jacquard, with the same narrative and aligned rules. This is an implementation response for review, not visual approval.

**Verification:** Code check and production build passed. Desktop and 390px scene-05 captures passed seven structural checks each, as did the desktop final overlook. The rendered-camera audit sampled 1,001 points at each of desktop and mobile sizes and found no camera-center intersections with candidate solid geometry. The new wider scene-05 lens is local to its reading neighborhood. Earlier 125-check runs belong to 0034; they are not claimed as a new full-suite run for this correction.


---

## 0036 — Connect the bridge cleanly and open the road corridor

- **Date:** 2026-09-08
- **Status:** Accepted correction request; implementation remains reviewable

**Timothy’s feedback:** Refine the bridge’s connection to the buildings, show the city beyond through the underneath opening, and correct the road’s strange ending.

**Implementation:** Correction 0036 refines the bridge-to-tower connections and opens the underpass. The bridge ends sit in recessed collars on short bearing seats; the long hanging braces are removed. Tower bases are set outside the road corridor. The obstructing nearby lot is removed, the setback landmark is relocated, and the terrace is carried by side wings around an open arcade. The road continues straight beneath it before turning farther out in the city. Distant district towers now respect a reserved road corridor, and the narrow landmark previously intersecting the bend is moved aside. The city behind the bridge is visible through the opening. This is a working implementation responding to Timothy’s correction, not visual approval.

**Cause found:** The road mesh already continued, but the next building lot, setback tower, terrace body, and right tower base blocked the view and intersected parts of its width. Checking only camera clearance did not catch the road-width problem. The revised street and architecture now share a clear corridor.

**Verification:** Six approach/lockup/exit/overlook positions were captured at desktop and 390px with no browser errors. The code check and production build passed. An actual rendered-camera check found no camera-center intersections at 1,001 sampled positions per viewport. A separate road-width probe caught a narrow distant landmark on the new bend; it was relocated before the final probe. These geometric samples and visual captures support implementation checks, not a claim of visual acceptance.

**Final checks:** All 3,378 road probes (center and two lane offsets) found no solid intersections after moving the landmark. Seven navigation/remount/reverse-scroll checks passed.


---

## 0037 — Blackletter and scattered windows for the civic lockup

- **Date:** 2026-09-08
- **Status:** Accepted correction request; implementation for review

**Timothy’s request:** Add blackletter and probably scattered windows to scene 04, “From the first idea to something people use.”

**Working implementation:** Scene 04 now emphasizes “people use.” in lowercase Jacquard. Scattered window clusters occupy the civic building above and below the lettering bay and along its side return, with matching windows on the neighboring tower. The windows follow the actual building planes; the central typography area remains clear. This follows Timothy’s explicit request for blackletter and scattered windows in the civic lockup.

**Verification:** Code check and production build passed. Targeted desktop and 390px captures each passed seven structural checks; both images were visually reviewed for typography and window placement.


---

## 0038 — Narrow the road to support the monumental city scale

- **Date:** 2026-09-08
- **Status:** Accepted correction request; scale proportions remain reviewable

**Timothy’s feedback:** Given the intended scale of the city and buildings, the road feels too wide, or the buildings feel too small.

**Working implementation:** Correction 0038 responds to Timothy’s concern that the road is too wide for the intended monumental city scale. The main road is reduced from 42 to 18 world units (about 57% narrower); its depth changes from 8 to 3.5, with finer markings, lower/slimmer barriers, and proportionate piers and footings. The cross viaduct is narrower too. A shared `ROAD_HALF_WIDTH` controls geometry and the distant district’s clearance. One additional camera key follows the narrower bend precisely. The tower and type dimensions remain the same in this scale trial.

**Verification:** Code check and production build passed. All six desktop lockups were captured and reviewed. A road-width audit sampled 3,378 center/lane-offset positions without solid intersections; the rendered-camera audit sampled 1,001 positions per desktop/mobile viewport without camera-center intersections. The road footprint, surface markings, barriers and supports were changed together rather than only reducing the lane paint.

**Mobile travel check:** Sixteen positions across the full 390px journey completed without browser errors. The bridge lockup was visually reviewed at that width; the desktop before/after uses the same camera and tower dimensions.


---

## 0039 — Refine the active city models across the full journey

- **Date:** 2026-09-08
- **Status:** Accepted refinement request; implementation remains open to visual review

**Timothy’s request:** Go through all the models and loop through refinement until the environment feels polished. This continues the scale, structure, windows, blackletter, and perspective corrections. Work is direct, respecting his instruction not to use the orchestration skill.

**Working implementation:** Four extruded district profiles replace the repeated block stacks. Sparse window recesses and lit panes articulate the faces, upper portions, and selected rear/side views. SVG landmark outlines stay intact while gaining bounded façade accents. Canal coping and fine water marks, tapered road piers, billboard frame/base connections, canyon window bays, and terrace arcade/deck/soffit details carry the finish through the environment. Small district and landmark accents are batched by color; the primary structural solids stay individually editable.

**Review loop:** Refinement 0039 completed three visual iterations: a city-wide profile/detail pass, a correction for blank upper and return faces revealed by the overlook, and a terrace-edge/soffit pass after travel review. The final review checked the six reading compositions and the intervening route at desktop and mobile sizes. The narrower angular road and current perspective route are retained. This records implementation work and observed issues, not a claim that Timothy has approved the result.

**Verification:** Code checking finished with zero errors or warnings, and the production build passed (with the existing chunk-size advisory). During this pass, 125 browser checks passed across desktop, 390px, 320px, reduced-motion and unavailable-JS/WebGL modes. After the final terrace detail adjustment, all six desktop lockups and sixteen travel positions per desktop/mobile viewport were recaptured without browser errors; seven navigation/remount/reverse-scroll checks passed. The final geometry audit sampled 1,001 camera positions per desktop/mobile viewport without camera-center intersections. A road-width audit sampled 3,378 center/lane-offset positions without solid intersections. These are sampled implementation checks, not continuous-volume proofs or visual acceptance. Decorative instanced windows are excluded from the structural-solid audit.


---

## 0040 — Make the bridge-to-overlook transition continuous

- **Date:** 2026-09-08
- **Status:** Accepted correction request; revised motion for review

**Timothy’s feedback:** The movement path between the second-to-last lockup and the final lockup feels awkward.

**Cause found:** Straight position segments changed direction sharply at the turn and at the start of the rise. Intermediate look targets pitched the camera up toward the terrace edge, while lens and portrait-height adjustments followed separate schedules.

**Working revision:** Correction 0040 revises the bridge-to-overlook movement after Timothy described its path as awkward. From scene 05, the camera follows a continuous, distance-sampled crane path through the opening and forward over the terrace. It stays farther from the right tower and arrives 56 units deeper into the city. The viewing direction levels gradually toward the skyline, and the desktop lens and portrait lift follow the same travel phase. The invitation moves by the same depth offset to retain its reading scale; final links and the completion label appear at progress .97. This is an implementation response for review, not Timothy’s visual approval.

**Review loop:** The first continuous-path revision still passed too near the right tower in the portrait capture. The second pass moved the clearance points left into the opening and extended the approach over the terrace, replacing the near-stationary rise with forward travel. Geometry and the road centerline were not changed.

**Verification:** The code check passed with zero errors/warnings; the production build passed with the existing chunk-size advisory. Eleven transition positions were captured and reviewed at desktop and 390px without browser errors. All six desktop lockups were recaptured. Seven navigation/remount/reverse-scroll checks and seven targeted 320px endpoint checks passed. The camera audit evaluated 1,001 positions at desktop and mobile sizes against structural solids with no camera-center intersections. During this audit, GPU/CSS draw submission is suppressed while the actual camera-update function runs; this avoids queuing thousands of unnecessary frames. This is a sampled clearance check, not a continuous-volume guarantee. The earlier 125-check suite belongs to 0039 and was not rerun for this route correction.


---

## 0041 — Finish the opening foreground and clear the navigation

- **Date:** 2026-09-08
- **Status:** Accepted correction request; implementation for review

**Timothy’s feedback:** The bottom half of the first lockup looks grey, empty, and unfinished. The introduction sits too close to “Timothy Ali” in the fixed navigation.

**Working implementation:** Correction 0041 refines the opening foreground and separates the introduction from the fixed wordmark. A low angular quay hall and a basin connected to the eastern canal give the lower view waterfront structure; the cross viaduct reaches the far quay. Ground and water shift toward warmer yellows. The large ground surface is subdivided so it no longer visually covers nearby water. The opening type is modestly smaller and its initial world-space position adapts to the viewport, leaving a clear navigation gap and preventing left-edge clipping on taller desktop windows. It stays anchored in the city during scroll. This implements Timothy’s requested correction; it is not visual approval.

**Review findings:** Moving the text alone revealed an existing left-edge clipping issue at taller desktop aspect ratios. Its opening placement now adapts to screen size. The initial basin still looked like ground; a ray/pixel comparison showed that the ground was visually covering the nearer water. Replacing the huge ground surface with a subdivided plane corrected the observed rendering problem. No depth-test bypass is used.

**Verification:** Code checking passed with zero errors/warnings and the production build passed with the existing chunk-size advisory. The opening text fits at 1600×900, 1440×1000, 1280×720, 1024×768, 768×1024, and 390×844; measured text bounds leave at least 28px below the wordmark. All six desktop lockups were recaptured and reviewed, including the effect of the shared ground/water colors. Seven navigation/remount/reverse-scroll checks passed, and the camera audit sampled 1,001 positions per desktop/mobile viewport without camera-center intersections. Earlier targeted arrival captures passed seven structural checks each at desktop and mobile. The ground/water correction was additionally checked using a ray hit and the corresponding rendered pixel before and after subdivision. These checks do not imply Timothy’s visual acceptance.


---

## 0042 — A type-focused reduced-motion edition

- **Date:** 2026-09-08
- **Status:** Requested refinement, implemented for visual review

**Latest direction:** Timothy requested a reduced-motion refinement, considered matching the animated views, then authorized the more composed still version. After reviewing the illustrated version, he said it looked weird and asked for this version to be more type-focused. That latest instruction governs the implementation.

**Working revision:** The reduced-motion/no-JavaScript edition now has six typographic chapters: a large lowercase introduction, an oversized “invested,” three ruled look/move/work lines, an offset idea-to-use statement, staggered founder/team statements, and a large final invitation. Jacquard carries lowercase emphasis; Anton carries supporting display copy. Yellow and black sections alternate. Large city illustrations are removed from the active implementation.

**Behavior:** Reduced mode imports no Three.js and has no animated camera. The narrative remains readable without JavaScript. Chapter navigation works in both modes. Switching modes and automatic OS preference changes preserve the current chapter; stored explicit choices take precedence. The motion button has an action label rather than a contradictory pressed state.

**Scope:** src/routes/+page.svelte contains the implementation. The animated geometry and route are unchanged. Earlier illustration and screenshot studies remain in the import workspace only. The Tyrell pyramid is still staged separately and has not been applied.

**Verification:** Svelte check passed with zero errors/warnings and the production build passed with the existing chunk-size advisory. Twelve behavioral checks cover reduced preference, no Three.js import, chapter navigation, mode changes, persisted preference, live OS changes, keyboard Work navigation, Contact navigation, and no-JavaScript content/text fit at 320px, 390px, and 800px. Six chapters were captured at 1600px, 390px, and 320px, with no browser errors or page-width overflow. These checks support implementation; Timothy has not visually approved the result.


---

## 0043 — Save the city version before alternate-version work

- **Date:** 2026-09-08
- **Status:** Requested and completed

Timothy asked to save the entire website, including Three.js, in a folder before building an alternate version. An independent 135 MB snapshot was created at `/Users/twocakes/Desktop/PROJECTS/timothyali2-city-v1-2026-09-08`. It includes source through 0042, static assets, docs, lockfile, installed dependencies, production build, and separate staged pyramid/reduced-motion review artifacts. No dependencies symlink outside the snapshot. Fifty-eight source files were hash-verified against the working folder. The saved copy passed Svelte checking with zero errors/warnings and a production build.

The existing `timothyali2` folder remains the working copy; the alternate design direction has not yet been specified. Preserve the saved city folder.


---

## 0044 — Replace the city with a programmatic, typographic direction

- **Date:** 2026-09-08
- **Status:** Direction explicitly requested; first implementation awaiting visual review

**Timothy’s direction:** Keep the color, pixel blackletter, name, tone, and identity. Everything else can go. The alternate should feel programmatic, pixelated, and use kinetic type; no 3D shapes. He wants a shared pixel grid, Swiss influence, and potentially pixel/ASCII art with a terminal, retro-futurist, somewhat dystopian/cyberpunk atmosphere conveyed by type and layout.

**Preserved:** The yellow/black palette, Timothy Ali wordmark, lowercase Jacquard emphasis, established positioning, first-person voice, factual project content and existing case-study destinations.

**Implementation choices, not separately approved decisions:** An 8px spacing basis and modular SVG mark, system monospaced supporting type, numbered navigation/index rows, hard rules, restrained ASCII iteration diagram, and finite stepped type reveals. Home, Work and Contact now share the visual system. Main project rows link to the corresponding anchor on Work. Three.js, its type package and the old active city sources/assets have been removed from the working copy; the independent city snapshot remains intact.

**Copy still open to review:** Supporting labels such as “Human input required,” “No half measures,” “Every detail counts,” and “A little human. A little machine.” were introduced as design proposals. They are not quotes from Timothy or independently approved voice decisions.

**Limits:** The layout uses an 8px spacing basis; responsive font sizes and glyph outlines do not literally lock every rendered pixel onto one screen-resolution grid. The pixel mark uses 8-unit SVG cells.

**Evidence:** See `docs/iteration-log.md`, with screenshots and source archives in `docs/iterations/pixel-v2/`. This entry records the requested direction, not visual acceptance of a finished site.

---

## 0045 — Keep a record of decisions and iterations

- **Date:** 2026-09-08
- **Status:** Explicitly requested

Timothy asked to document the decisions “like we were before,” and then explicitly added the iterations. Continue the numbered decision history and add an iteration log with the trigger, visible changes, review findings, validation and saved artifacts for each meaningful version. Preserve superseded approaches. Attribute the reasons Timothy actually gives; label assistant choices and do not manufacture approval.

---

## 0046 — Rebuild the alternate on one measured pixel grid

- **Date:** 2026-09-08
- **Status:** Direction reaffirmed by Timothy; type system and textures are implementation proposals awaiting his review

**Timothy’s direction:** Restated 0044 in full: keep the colour, the pixel blackletter, the name and the tone; everything else goes. Programmatic, pixelated, kinetic type, no 3D, ideally everything on the same pixel grid, Swiss influence, ASCII art, terminal, retro-futurist, programmatically generated textures, dystopian/cyberpunk conveyed through type and layout, potentially everything in a pixel font.

**Assistant assessment of PX-02:** It did not meet the brief. Supporting type was a system monospace (not pixel), there was no shared grid, one small ASCII box, no generated textures and the “kinetic” type was a single wipe. Saying so is the reason PX-03 is a rebuild rather than a refinement.

**Options considered for “everything in a pixel font”:**
1. Rosetta variable pixel monos (Workbench, Sixtyfour) for terminal text — rejected: measured outlines and renders show rounded dot-matrix / scanline pixels, so they never sit on the same hard grid as Jacquard.
2. VT323 — rejected: curved outlines, not a bitmap.
3. Jersey 10 — rejected: 18.667 cells/em, so no integer pixel size exists.
4. **Chosen:** Jacquard 24 (43 cells/em) for emphasis, Jersey 25 (41) and Jersey 15 (27) from the same family for display and body, Silkscreen (8) for labels, Press Start 2P (8) for the few monospace needs. All free, all on Google Fonts / fontsource, all square-pixel bitmap designs with integer cells per em.

**Grid rule adopted (proposal):** font-size = cells-per-em × cell size; spacing in 8px units; canvas textures in 8px or 16px cells with 2px pixels. Verified by a screenshot audit: 0% anti-aliased pixels across ten text regions. A Grid toggle in the footer overlays the 8px/64px grid so the system can be shown, not described.

**Textures and motion (proposal):** Bayer ordered dither, bitmap ASCII fields and two-colour dithered photographs, all seeded and deterministic; type that types, scrambles and steps by whole cells; all motion discrete, all of it off under reduced-motion or by the footer toggle, and every page fully readable without JavaScript.

**Removed:** the PX-01/02 SVG pixel mark and the “Human input required” label (assistant inventions, not identity). Preserved: palette, wordmark, Jacquard emphasis words, version-02 copy, project facts and external case-study links, the Motion toggle.

**Open for Timothy:** approve or swap the four supporting faces; keep or cut the carried-over supporting labels and the new terminal chrome strings (see Q31); decide whether the dithered Work photographs are a feature or a loss of information.

**Evidence:** `docs/iteration-log.md` entry PX-03 and `docs/iterations/pixel-v2/03-one-grid/`. This entry records the reaffirmed direction and the implementation proposal; it is not visual acceptance.

---

## 0047 — Accept the pixel-grid direction; go yellow on black, drop the rules, quiet the landing

- **Date:** 2026-09-08
- **Status:** Direction confirmed by Timothy; layout corrections requested and implemented for review (PX-04)

**Timothy’s feedback on PX-03:** “i like the direction. much better than what we had before.” That confirms the PX-03 system proposed in 0046: bitmap faces sized to one measured pixel grid, seeded canvas textures, stepped kinetic type, terminal chrome. It is now the working direction, not a proposal.

**Corrections he asked for, in his words and order:**
1. The landing layout needs work; drop the Swiss hairlines and embrace something more modern.
2. Swap to yellow on black.
3. Selected works become cards.
4. The hero band and the personal-commitment band use the programmatic texture as their background.
5. The hero is only “i’m tim” animating in on top of the texture; landing felt too busy immediately.
6. Mid-build: “these are hard to see and also pointless. ditch these eyebrows” — the numbered section labels (01 / Personal commitment, etc.) are removed everywhere.

**Implementation (assistant choices within that direction):**
- Base is black with yellow type site-wide. All 2px rules, bordered panels and ruled rows are gone. Separation comes from spacing (96–160px between bands), filled yellow blocks and texture.
- Primary actions are solid yellow blocks with black type; the active nav item is the same block.
- Secondary text (readout, footer, card labels) sits at 55% opacity. This introduces a dimmed yellow as a third tone; it is the one concession to hierarchy without rules.
- Cards: a two-colour pixel “surface” (a 4px conic checker of 16% yellow) with the dithered image, a small label, the title and an arrow. Hover coarsens the surface to 8px and steps the arrow. Used on the home index and on the Work page.
- Hero: full-viewport band, a new `sky` dither field dense at the top-right and empty at the bottom-left, and nothing on it but the typed name and a small “Scroll”. The statement, body copy and button move to their own band below.
- Personal-commitment band: the ASCII noise field is the full-bleed background behind “I get / invested. / in what I make.”; the diagram and copy follow on plain black.
- Ticker removed (busyness). Section eyebrows removed. Grid and Motion toggles retained.

**Still open:** the carried-over supporting copy strings (Q31, now only the footer line, “Think / make / repeat” was removed with the ticker), whether the dimmed-yellow secondary tone stays, and whether Work keeps two cards per row or goes to one wide card each.

**Evidence:** `docs/iteration-log.md` entry PX-04 and `docs/iterations/pixel-v2/04-yellow-on-black/`. Layout is implemented for Timothy’s visual review; the direction itself is confirmed.

---

## 0048 — Texture on every band, type knocked out of it, hero kept as it was

- **Date:** 2026-09-08
- **Status:** Direction from Timothy, implemented for review (PX-05)

**Timothy’s feedback during PX-04 review, in order:**
1. The diagram/copy and look-move-work area “feels disconnected”.
2. The invitation/footer band gets “the same treatment as the hero and get invested bands. texture background”.
3. “make sure everything is still staying aligned to the unified pixel grid.”
4. “i also still want to refine the look move work band … and all the others as well. we need to keep the text readable on top of the textures.”
5. “the way the hero was before was perfect. revert just the hero.”

**Implementation:**
- The diagram, the founder copy and the three words are one band on a bands-dither background: “How they” as a lead, look./move./work. stacked, diagram and copy alongside. The three separate texture strips and the row labels are gone.
- The invitation is a full-bleed rain dither with the heading and the yellow CTA on it; the footer follows directly.
- Readability: textures now take an `avoid` selector and knock themselves out around the text they sit behind. The knockout measures each text line box (via a Range), not the block, and fades over a few cells through the same Bayer threshold, so the edge is dithered rather than masked. Applied to the invested, look-move-work, invitation and contact bands. The hero deliberately has no knockout: it is back to the PX-04 version Timothy called perfect.
- Grid: an audit script checks that every font size is on the cell table, every text box has an integer origin, and every canvas starts on a multiple of its cell relative to the page. Fixes it drove: texture and image canvases snap their origin to the page grid and re-snap on any document reflow; card images get an integer height instead of a fractional 16:9 box and use an explicit 2px cell; the hero height rounds down to 8px; body line-height moves from 36 to 32; header items sit on 8px offsets. Result at 1440 and 390 on all three routes: 0 misaligned canvases, 0 fractional text boxes, 0% anti-aliased pixels on solid type.

**Still open:** density of each band’s texture is a taste call (currently sky 0.8, ASCII 0.5, bands 0.45, rain 0.55, contact fall 0.55); the Q31 items.

**Evidence:** `docs/iteration-log.md` entry PX-05 and `docs/iterations/pixel-v2/05-texture-bands/` including `grid-audit.txt`.

---

## 0049 — Black and white with a theme toggle; yellow becomes the accent; photographs in colour

- **Date:** 2026-09-08
- **Status:** Timothy’s direction; implemented for review (PX-06). Supersedes the yellow/black base from 0013/0015/0018 and 0047.

**Timothy’s reasoning:** “Starting to think the yellow is a bad idea. I think we switch to black and white. With a toggle for theme. And then we can add color as an accent sparingly. This also makes it easier to make the images full color without it looking weird.”

**Assistant’s view, stated before building:** yellow/black was the one thing on this site nobody else has, and black-and-white pixel brutalism is a crowded room. The image argument is real, though, and the identity survives if yellow is the accent rather than the ground. Built on that basis.

**Implementation:**
- Two themes on CSS tokens: dark (near-black `#11110e` ground, off-white `#f4f4f0` type) is the default; light inverts them. A Theme toggle sits in the footer beside Motion and Grid, persists per browser, and an inline script applies the stored choice before first paint. The OS colour-scheme preference is deliberately not consulted: dark is the site’s default, the toggle is the user’s override.
- Yellow is used in exactly three places: the two block cursors, the active navigation item, and primary actions (the buttons and the full-width “Get in touch” bar). Nothing else is coloured.
- Photographs are full colour, resampled to one colour per 2px grid cell so they sit on the same pixel grid as the type. On desktop this reads as a normal image; the two-colour dither is gone.
- Textures, card surfaces and the grid overlay all derive from the current foreground token, so both themes render from one stylesheet.

**Open:** whether the accent belongs on the CTAs or only on the cursors and nav (Timothy said “sparingly”; three uses is the assistant’s reading). Whether dark or light should be the default. Q31 items.

**Evidence:** `docs/iteration-log.md` entry PX-06 and `docs/iterations/pixel-v2/06-black-white/` (dark and light captures, grid audit, source).


---

## 0050 — Copy: “How it looks. moves. works.”

- **Date:** 2026-09-09
- **Status:** Timothy’s wording; applied

Timothy set the copy for the third band: “HOW IT / looks. / moves. / works.” This replaces the version-02 passage “How they look. How they move. How they work.” (landing-copy-v2.md, passage 3) and the PX-04 lead “How they”. The subject is now the product being made rather than the things; the three Jacquard words keep the trailing full stops. `docs/landing-copy-v2.md` passage 3 is superseded by this entry.

---

## 0051 — Accept all six recommendations of the independent home-page critique

- **Date:** 2026-09-09
- **Status:** Accepted by Timothy (“lets do all 6 recommendations”); implemented as PX-07 on 2026-09-09 (see the iteration log), awaiting his visual review

Timothy commissioned a fresh-context review of the home page arc (`docs/reviews/2026-09-09-home-arc-critique.md`) and accepted its six recommendations in full:

1. Fold the “I get invested.” band into the looks/moves/works band as one beat: “I get / invested. / in how it / looks. moves. works.” One texture, one composition.
2. Give the home card grid a heading, “Selected work”, matching the Work page.
3. Move “I’ve cofounded products. Helped teams ship theirs.” up into the statement band’s right column, replacing “From the first idea to something people use.” Drop the ASCII IDEA/ITERATE/SHIP diagram.
4. Put a small label under each of the three words mapping them to the disciplines: looks → Brand, moves → Motion, works → Product / front end.
5. Make the hero “Scroll” hint visible (full opacity or a yellow cursor). The reviewer’s optional idea of typing the statement into the hero was not adopted; the quiet hero stands (0047).
6. Card labels at full opacity, not 55%.

Consequences: the version-02 passage “From the first idea to something people use” leaves the home page (it remains in the copy doc as superseded); the diagram from PX-03 is retired; the invested/looks overlap and fades from 2026-09-09 become moot because the two bands merge.

## 0052 — Cut “I get invested.”; the middle band is “How it / looks. moves. works.” in a row, with no texture

- **Date:** 2026-09-09
- **Status:** Accepted by Timothy (“i think 4 is my favorite. and im thinking maybe we ditch the texture. its really distracting”)

**Context.** After PX-07 merged the two middle bands per 0051, Timothy reviewed it: “the get invested and looks moves works sections still need work. its really tall. and the layout still feels like we stuck two sections together on top of each other.” The band was 1,218px tall at 1440 and held two “small lead → giant blackletter” pairs at two scales (258 and 172) in one left column, which is two headlines in a list. Four options were mocked on the live page with the real texture and type (`docs/iterations/pixel-v2/07-arc/mocks/`), with references from Studio Freight, Phantom Studios, Vucko, Koto and Büro.

**Options.**
1. Triad row: “I GET invested.” on one line, “IN HOW IT”, then the three words across in three columns with labels (696px). The assistant’s recommendation.
2. Staggered sentence: the whole sentence as one ragged poster composition, words stepping across the width (824px). Most character; “IN HOW IT” floated and the stair sent the eye to the far right.
3. Numbered rows: “I get invested.” lead, then three rows of label / word / one-line copy (919px). Clear, but a list, and it brought body copy back into the band.
4. Cut “I get invested.”: “HOW IT” lead and the three words across in a row with labels (422px).

**Choice.** Option 4, and the band loses its ASCII texture entirely.

**Reasoning (Timothy’s).** Option 4 was his favourite. The texture was “really distracting” behind the type.

**Consequences.** The line “I get invested.” leaves the site; the copy doc keeps it as superseded. The home page now alternates textured and plain: hero (texture) → statement → how it → selected work → invitation (texture). The `bands` field mode in `Ascii.svelte` is unused. The page is 3,670px tall at 1440, down from 4,466px. The three columns are sized with `round(down, …, 8px)` so their origins stay on the pixel grid. Supersedes the “merge the two bands” part of 0051 item 1; items 2–6 stand.

## 0053 — Statement and “how it” become one sentence: the annotated paragraph

- **Date:** 2026-09-09
- **Status:** Accepted by Timothy as a starting point (“p is a good starting point”)

**Context.** After 0052 Timothy diagnosed the remaining problem: “theres too many story beats happening on the screen at once. either designer for teams and how it looks need to be there own full viewport sections or they need to be combined into a cohesive layout that doesnt look like two things stacked ontop of each other.” A first pair of mocks (one beat per viewport; one combined composition) was rejected as “the same thing just resized”. A second round mocked four different structures on the live page (`docs/iterations/pixel-v2/07-arc/mocks/beats2-sheet-*.png`).

**Options.**
- P, annotated paragraph: one running sentence, “Designer for teams that don’t have one yet. I care how it looks. moves. works.”, the blackletter words inline as emphasis, the discipline labels hanging off each word, proof and CTA closing the block.
- S, split panels: thesis left at 123px, the three words right-aligned on the right, read across.
- T, inverted tiles: thesis over three paper tiles, each with a number, a word and a line of copy.
- K, ticker strip: thesis over a full-bleed strip of the words stepping one cell at a time.

**Choice.** P.

**Reasoning.** Timothy’s: it is a good starting point. The assistant’s recommendation was P because it is the only option in which the two beats stop being two objects and become one sentence. T was argued against for reading as a features row and stacking three tiles above four work cards; K for reintroducing the movement Timothy had just called distracting.

**Consequences.** The statement band and the “how it” band are gone; one `.who` section holds the sentence, the labels, the proof and the CTA. The line “I care how it” is new copy (the “I care about the whole thing” sentiment returns in three words). “Brand. Product. Motion. Front end.” is no longer on the page; the labels under the words carry it. Line breaks are set by hand at desktop (“Designer for teams that don’t / have one yet. I care how it / looks. moves. works.”) and free under 700px. The home page is hero → sentence → selected work → invitation, 3,520px at 1440. Assistant choice pending Timothy’s reaction: the sentence at 82px with the words at 129, not 41/86 (captured for comparison in `mocks/para-small-1440.png`), because the beat is the thesis and should keep headline weight after a 344px hero. Supersedes the middle-band composition of 0052; 0051 items 2, 5 and 6 stand, items 3 and 4 are absorbed into the paragraph.


## 0054 — Images are not resampled to the pixel grid

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“we need to make sure that images arent getting made pixelated”); applied

**Context.** Since PX-03 (0046) work photographs were resampled to one sample per 2px cell so they sat on the same grid as the type; PX-06 (0049) kept that in full colour. The PX-08 case studies put dense UI screenshots, brand spreads and photographs through the same treatment, and Timothy reviewed the result.

**Decision.** Images and video render at their own resolution. Only the generated textures (canvas) keep `image-rendering: pixelated`. `PixImage`/`PixVideo` are replaced by `Picture`/`Clip`, plain `<img>`/`<video>` in a figure that still sets an integer height on the 2px grid so the type below stays aligned. Case-study images ship at 1600px with a 2800px `@2x` JPEG in `srcset` where the source allowed (20.8MB extra); covers stay at 1600.

**Reasoning (Timothy’s).** The images were coming out pixelated.

**Consequences.** Supersedes the photograph part of 0046 and 0049; the type, textures and layout stay on the grid. Video now plays natively (paused off screen and under reduced motion) instead of stepping at 12 frames a second on a canvas. The grid audit no longer counts image canvases; the seven routes still pass 0/0.

## 0055 — Pocketwatch leaves the index; Do Androids Dream takes its place

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“i want to remove pocketwatch from my selected works” … “i want it replaced with another project”); the replacement project is the assistant’s pick, awaiting his confirmation

**Context.** Pocketwatch was project 01 on Home, Work and the case studies. Timothy asked for it to be removed and then replaced with another project, without naming one. The old site holds six more: FirstStrike, Gridform, Gridform Studio, Sonde, Jade Aesthetics, Do Androids Dream, plus the PARC site build.

**Decision.** Pocketwatch is removed from `src/lib/work.ts` and its assets from `static/work/`. Do Androids Dream (the 2023 title sequence, motion and art direction) is added as project 04; PARC, xrp.cafe and First Ledger move up to 01–03. The Pocketwatch content stays in `docs/iterations/pixel-v2/08-work/source.zip` should it return.

**Reasoning.** Timothy’s: remove Pocketwatch, replace it. The assistant chose Do Androids Dream because the remaining three are all brand studies, the Home sentence claims “moves.”, and it is the only motion piece on the old site; it is also yellow and black, which sits naturally in this system. FirstStrike was the runner-up (a full identity, but a fourth brand study).

**Consequences.** Counts in the chrome derive from the data (`01–04`, `End of index / 004`). The order is now the cofounder track record then the motion piece; Timothy may want a different order or a different fourth project, which is a data edit. Q33 (a second tier of projects) stays open.

**Correction (2026-09-10, decision 0080).** The assistant misread “remove pocketwatch from my selected works” as removal from the site. Timothy: “i didnt want it removed, just not in the 4 selected works”. Pocketwatch returns as an index entry with its study; the replacement of the fourth selected slot by Do Androids Dream stands. The claim above that the content survived in the PX-08 archive was also wrong — that archive was refreshed after the removal — so the study was re-ported from the old site.


## 0056 — Refine the landing statement and experience copy

- **Date:** 2026-09-09
- **Status:** Explicit wording accepted by Timothy; applied

Timothy selected:

> Designer for teams that don’t have one yet.
> Whatever you’re building, I care how it **looks. moves. works.**
> I’ve built products of my own,
> and helped teams ship theirs.

Replaces the statement transition and cofounder proof wording from 0053. The lowercase blackletter words, discipline annotations, and existing section structure remain. The experience sentence keeps Timothy’s comma and line break. This accepts the wording, not a new layout direction.


## 0057 — Experience copy introduces selected work

- **Date:** 2026-09-09
- **Status:** Accepted by Timothy (“lets do it”); implemented for visual review

Move “I’ve built products of my own, and helped teams ship theirs.” from the statement footer into the work section as its headline. Emphasize “of my own,” and “theirs.” in lowercase Jacquard. “Selected work / 01–04” becomes a small label above it. Remove the preceding “See my work” button and put “All work →” after the cards. Keep the background plain. Timothy described the previous footer row as feeling added on; this ties the experience claim directly to its project evidence. Exact copy from 0056 stays intact.


## 0058 — Inverted statement panel

- **Date:** 2026-09-09
- **Status:** Timothy selected “inverted panel”; implemented

The designer / looks / moves / works section uses the current foreground as its solid background and the page background as its text colour. This automatically inverts in both themes. Selected work remains on the normal page background, creating a clear boundary between positioning and projects. No dither transition or texture is added. This follows Timothy’s concern that the two sections blended together.


## 0059 — Continuous rain behind work and invitation

Timothy requested that the footer’s Matrix rain start at the top of Selected Work and continue behind the project cards into the closing section. Implemented as one shared ASCII fall canvas, preserving its existing cadence and theme colours. Cards have an opaque page-colour base; headings and links retain text knockout for readability. The inverted statement panel remains separate.


## 0060 — Lowercase navigation wordmark

- **Date:** 2026-09-09
- **Status:** Timothy’s explicit request; applied

The shared top-navigation wordmark now reads “timothy ali” in lowercase Jacquard. The professional name, page metadata, and footer spelling are unchanged.


## 0061 — Direction-aware navigation

- **Date:** 2026-09-09
- **Status:** Timothy’s explicit request; implemented

On downward scroll, hide the main navigation row while retaining the status readout at the viewport top. Any upward scroll reveals the full navigation. At the top and after route navigation the full header is visible. The actual header height is measured for mobile layouts; keyboard focus reveals the navigation. The change is instantaneous, with no added motion.


## 0062 — Route path in the persistent status strip

- **Date:** 2026-09-09
- **Status:** Timothy’s explicit request; applied

Replace “Design + build” in the status strip with the existing live terminal path and yellow cursor. Move it out of the upper navigation row so the path remains visible when the navigation collapses. Retain dynamic route names and clipping for long case-study paths.


## 0063 — Accent-yellow discipline labels

- **Date:** 2026-09-09
- **Status:** Timothy’s explicit request; applied

Brand, Motion, and Product / front end beside “looks. moves. works.” use the shared accent-yellow token in both themes.


## 0064 — Remove the Work header eyebrow

- **Date:** 2026-09-09
- **Status:** Timothy’s explicit request; applied

Remove “Selected” above “work.” on the Work page. The project index remains alongside the title.


## 0065 — Work-page accent details and case-study hover

- **Date:** 2026-09-09
- **Status:** Accepted by Timothy; applied

Keep “work.” in the main text colour. Use accent yellow for the header’s project range and the case-study arrows. Timothy additionally requested that “View case study” become a yellow button on hover. The label receives a solid yellow background and dark text/arrow when its project link is hovered or keyboard-focused. Padding is reserved in the resting state to prevent layout shift.


## 0066 — Separate text plates on Work cards

- **Date:** 2026-09-09
- **Status:** Timothy’s explicit direction; applied

Give the small metadata at the top of each Work card its own solid page-colour plate, leave the project title floating on the dither, and give the body copy a separate solid plate. This supersedes the assistant’s proposed single plate for the whole text column. Existing yellow CTA hover remains.


## 0067 — Discipline labels sit on an ink plate

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (assistant review finding, Timothy: “have an opus agent address all 3”); applied

**Context.** 0063 set the three discipline labels beside “looks. moves. works.” to accent yellow, and 0058 made the statement panel an inversion of the page. In the default dark theme the inverted panel is white, so yellow text on it measured 1.32:1 — effectively unreadable. Only the light theme, where the panel is ink, was legible.

**Decision.** Each `.para .note` keeps its yellow text and gains a solid plate in `var(--ink)`, with 8px padding and a 16px gap to the next word (the first pass used 8px 16px and 32px, which pushed “Product / front end” onto its own line at 1440; the tighter spacing restores the one-line row). The tokens are explicit (`--ink` / `--yellow`) rather than theme-relative, so the plate is dark in both themes; in light theme it coincides with the panel and is invisible.

**Reasoning.** Timothy asked for the labels to stay yellow. Yellow on ink is the pairing the site already uses for its action blocks, and it measures 12.96:1. A plate in `var(--paper)` would have inverted with the theme and reproduced the same failure in light. The labels remain inline on the baseline, and the 32px boxes fit inside the 128px (96px on phone) `.words` line-height without moving any text box off an integer pixel.

**Consequences.** The labels now read as small chips on the white panel in dark theme and as plain yellow text on the black panel in light theme. Extends 0063 rather than replacing it; the panel inversion of 0058 is unchanged. This is the first place on the site where a literal `--ink`/`--yellow` pair is used instead of the theme tokens.


## 0068 — Work header stacks below 700px

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (assistant review finding, Timothy: “have an opus agent address all 3”); applied

**Context.** The Work header (0064) puts “work.” beside a right-aligned project index. On a 390px phone the index column was about 100px wide, “Project index” wrapped to two lines and ran into the title; the wrapped span was also the only fractional text box left in the grid audit.

**Decision.** Below 700px the header becomes a column: the title first, then a single index row with “Project index” on the left and the yellow range on the right, set `white-space:nowrap`, with 16px gaps and no extra bottom padding. The desktop layout is unchanged.

**Reasoning.** At phone widths the two-column relationship has no room to work; stacking gives the label its natural width and keeps the range paired with it. The full-width row keeps both items on the 8px unit and removes the wrap, and with it the last fractional text box on the site.

**Consequences.** The Work header is 233px tall at 390 and 190px at 360, one line for the index at both. The grid audit is now 0 fractional text boxes on every route at both widths. Nothing above 700px changed.


## 0069 — Work CTA follows the body plate

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (assistant review finding, Timothy: “have an opus agent address all 3”); applied

**Context.** Each Work row stretches to its cover’s height, and `.row-body .body` carried `margin-bottom:auto`, which pinned “View case study” to the bottom of the text column. Projects with short descriptions (First Ledger, Do Androids Dream) showed a short body plate, about 118px of empty dither, then the CTA.

**Decision.** Remove `margin-bottom:auto`. The CTA now follows the body plate at the same 16px gap as the other items in the column. The row still stretches to the cover’s height, so the empty space moves below the CTA.

**Reasoning.** Timothy read the gap as dead space. Grouping the metadata, title, body and action as one block makes the text column read as a unit and matches the rhythm of the other gaps; trailing space under a left-aligned block is ordinary, a hole inside it is not.

**Consequences.** The measured body-to-CTA gap is 16px on all four rows. The reserved padding and yellow hover fill from 0065 and the separate plates from 0066 are untouched; hovering still fills the label in place with no shift.


## 0070 — Phone header sits on the 8px unit; tabs stay

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“lets fix the header height then”, choosing the assistant’s leaning on Q35 over a hamburger menu); applied

**Context.** Below 700px the header was `height:auto`: 8px padding, the 43px wordmark, an 8px gap, the 32px nav row and 8px padding — 99px. With the 32px status strip, every page’s content began at 131px, 3px off the 8px unit. Timothy had suggested a hamburger menu; the assistant argued that three destinations do not justify a hidden menu and that the real fault was the height.

**Decision.** The phone header is a fixed 104px grid: a 48px wordmark row (the 43px wordmark aligned to its bottom, so its box starts on an integer pixel), an 8px gap, the 32px nav row, 8px padding above and below. Header plus status strip is 136px. The three full-width tabs remain; no hamburger.

**Reasoning.** Timothy’s: fix the height. The assistant’s: the tabs are one tap and read as terminal chrome; a menu would add a tap to every visit on a three-page site.

**Consequences.** Content on phones starts at 136px on every route. The collapsing nav measures the header, so it hides 104px on downward scroll. Q35 is resolved unless Timothy returns to the hamburger.



## 0071 — The design system is extracted into layers, tokens and components

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“then do the design system stuff”); the structure, names and the four unifications are the assistant’s proposal awaiting his confirmation

**Context.** Timothy asked for “tokens for color type etc. components we can reuse etc.” (Q34). The read-only survey in `docs/design-system-inventory.md` found one `:root` holding every token, `--u:8px` declared and never referenced, `--header-height` consumed with no declaration, `.xl` written out three times with three different small-screen ladders, six near-identical action blocks, two cursor implementations with two copies of the same `@keyframes`, five formats for the same label/value row, arrows in two faces, and two dead components. He has not answered the survey’s open decisions.

**Decision.** Extract the system from the code as it stands, without redesigning it. Five layers: `src/lib/styles/primitives.css` (raw colour, an `--s1…--s16` spacing scale on the 8px unit, the three grid cells, the five face stacks, `--tick-cursor` and `--nudge`, breakpoints as documentation), `tokens.css` (semantic ground/type/accent, the two card surfaces, the two Grid-overlay line colours, six `--z-*` steps, `--gutter`, `--header-height:64px`, `--texture-fallback-opacity`), then `base.css`, `type.css`, `chrome.css`, `layout.css`, `blocks.css`; `src/app.css` keeps only the cell table and the import list. `src/lib/tokens.ts` mirrors the primitives for JavaScript. Nine components — `Arrow`, `Cursor`, `Plate`, `Cta`, `IndexRow`, `MetaLine`, `PageFoot`, `QuietLink`, `Band` — emit class names defined in `blocks.css` rather than carrying scoped styles. `.xl` becomes one `.display-xl`; `.display-l`, `Dither.svelte` and `Ticker.svelte` are removed. Four visual unifications are accepted as part of the pass: the `.display-xl` ladder settles on Work’s (129 at ≤700, 86 at ≤380), `.page-foot` arrows move to Press Start like every other arrow, Contact’s ≤700 section padding drops 64 → 48 like every other route, and Decode’s cursor becomes the shared `Cursor` component.

**Reasoning.** Timothy’s: he asked for it. The assistant’s: the duplication was already producing bugs of the “same idea, two behaviours” kind, and every one of them is cheaper to fix once a name exists. Keeping the CSS in a global layer and letting components choose class names — rather than moving styles into scoped component `<style>` blocks — keeps the cascade flat and made the whole refactor verifiable pixel-for-pixel, which is the only way to change this much of a hand-tuned grid without losing it. Font sizes stayed literal because they *are* the cell table; a token there would hide the arithmetic that keeps glyph pixels on device pixels.

**Consequences.** The site renders identically except for the four unifications, each measured: Home at 1440 diffs at 0 pixels in dark, light and no-JavaScript; the `.page-foot` arrow costs 2px of page height on five pages (the footer line box goes 16 → 18); the `.display-xl` and Contact-padding changes alter a band’s height at 390, which re-seeds the ASCII `fall` field through that band. Two hover directions survive as two named roles rather than being unified, and `Cursor` carries two sizes, because unifying either would have changed the design rather than the code. `docs/design-system.md` is the reference and lists all thirteen assumptions awaiting Timothy. Q34 stays open until he confirms the names and the four unifications.


## 0072 — The status strip sheds items by priority instead of shrinking

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“we also need to rethink the status bar under the nav for tablet and mobile” … “lets do your proposed changes”); applied

**Context.** Press Start 2P advances one em per character, so at 16px the five status items (path, Denver, coordinates, clock, SYS.OK) need about 1,040px with gaps and gutters. Every tablet width clipped the clock and SYS.OK off the right edge; the Do Androids Dream path alone is 448px and clipped below about 1,300px; below 700px the strip dropped to 8px type, which is unreadable on the site’s own terms.

**Decision.** The strip never goes below 16px and stays 32px tall and pinned (0061, 0062). It sheds items by priority: at or below 1100 the coordinates go; at or below 900 Denver and SYS.OK go and the path shows only its home and last segment (`~/…/do-androids-dream`); at or below 420 the clock goes and the path stands alone.

**Reasoning.** Timothy’s: rethink it for tablet and mobile. The assistant’s: readable type over complete chrome; each step is what fits at 16px with the gutters, measured. The ellipsis renders on the grid (a 16px advance, checked by the audit).

**Consequences.** Measured on Home and the longest study path at 1440, 1100, 1024, 900, 834, 768, 700, 420, 390, 375 and 320: every visible item sits inside the gutters at every width. The only clipping left is the Do Androids Dream slug at 375 (9px) and 320 (64px), where even the short path is longer than the strip; it clips inside the path box rather than pushing anything. The 700–900 step was widened from the first proposal (Denver alone) to Denver plus SYS.OK, and the clock step moved from 400 to 420, because the measured widths did not fit otherwise. `.hide-m` no longer appears in the strip. Q36 resolved.


## 0073 — The footer becomes a settings list on phones

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“the footer also needs refinement/rethink on mobile”); the list layout is the assistant’s proposal awaiting his confirmation

**Context.** Below 700px the footer’s three toggles wrapped: Motion and Grid on one line, Theme orphaned below at 390, all three stacked ragged-left at 320. Silkscreen at 16px is about 10.7px per character, so three cells across only fit above about 400px.

**Decision.** At or below 700px the toggles come first as a list: each is a full-width 32px row with the label at the left and its state (`[on]`, `[off]`, `[dark]`) at the right; the copyright/EOF line follows. The button markup now wraps the state in a span for both layouts; desktop renders identically (parity 0 pixels at 1440).

**Reasoning.** Timothy’s: refine it. The assistant’s: a settings list is the honest terminal form for three switches, reads at 320 without wrapping, and lands every row on the 8px unit (footer 184px). Tabs across, like the nav, did not fit the longest label at 320.

**Consequences.** Phone pages grow 24px at the bottom; nothing above the footer moves (parity first-differing row is the footer top on all seven phone captures). Timothy has not yet seen it.


## 0074 — Work rows lose their surface and plates

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“the plates behind the text feels weird. lets brainstorm a bit” … of four options, “yeah lets go with first”); applied. The two sub-calls (title sizes unchanged; the dither kept only as a hover mat around the cover) are the assistant’s.

**Context.** Since 0066 each Work row was a dithered card with the metadata and body copy on separate paper plates and the title floating. The plates existed because small type is unreadable on the dither; that made three nested surfaces, inverted the hierarchy (the smallest text most protected, the title least) and the plates’ ragged edges read as highlighter marks. On Work the photographs are already the texture.

**Decision.** The row has no surface and no plates: the cover on the left, the type on the page ground on the right, the 64px gap between rows (48 on phones) does the separating. The dither survives only as a hover state, a 16px mat drawn around the cover in the gap by a negative-margin frame, so the image stays exactly the column width at rest and on hover. “View case study” keeps its yellow hover fill (0065) and is pulled 16px left so its text aligns with the column. `Plate.svelte` and its classes are removed; `MetaLine` loses its `plate` prop. Home’s cards (solid paper on the rain) are unchanged.

**Reasoning.** Timothy’s: the plates felt weird; he chose “kill the surface” over a dither mat, a canvas knockout, or one solid panel. The assistant’s: remove the cause rather than dress it; space does the separating, per the system’s own rule; the mat gives the dither a job.

**Consequences.** Work is 56px taller at 1440 (bigger row gaps) and 369px shorter at 390 (no padding or plates). Rows and cards are now different things on purpose: Work is an index, Home is cards. 0066 is superseded; 0065 stands. Q31 (rows vs cards) leans further toward rows.


## 0075 — The design system is accepted; three token decisions applied

- **Date:** 2026-09-09
- **Status:** Accepted by Timothy (“everything sounds good to me”, after the assistant walked him through `docs/design-system.md` and its list of proposals); applied

**Context.** PX-14 extracted the design system as the assistant’s proposal (0071) with thirteen structural calls and three open token questions. The assistant presented the document and voted on each open item.

**Decision.** Everything in 0071 stands as built: the seven-file layer split, the token names (`--s1 … --s16`, `--cell-*`, `--face-*`, `--surface-card*`, `--grid-*`, `--z-*`, `--tick-cursor`, `--nudge`), font sizes staying literal as the cell table, two CTA hover directions as two roles, one `Cursor` with two sizes, `Dither`/`Ticker` deleted, the four rendering unifications. Three further calls, each the assistant’s vote that Timothy accepted:

1. **A light-theme accent for text.** New primitive `--yellow-deep:#6f6200` and semantic token `--accent-text`, yellow on the dark ground and deep yellow on the light one (5.6:1 on `--white`). Used wherever the accent is type: the Work index range, the quiet-CTA arrow, the quiet link hover, the footer toggle state. Fills (`--accent`) stay pure yellow in both themes.
2. **Breakpoints.** 1300 folds into 1100 (the Work row title now steps to 41 at ≤1100; at 1101–1300 it stays 82 and wraps to two or three lines). The phone floor for `.display-xl` moves from 380 to 420, which the status strip already uses, so the set is 420 / 700 / 900 / 1100. The assistant had recommended cutting the floor entirely; measuring showed “building.” is 372px at 129, wider than a 375 phone, and had been clipping since the PX-14 ladder unification. The correction is the assistant’s.
3. **The index counter is read by screen readers on both pages.** `IndexRow` loses `valueHidden`; Home’s `01–04` is no longer `aria-hidden`.

A `/system` specimen page is accepted in principle and deferred until the remaining page work is done (Q37).

**Reasoning.** Timothy’s: it all sounds good. The assistant’s: yellow on white was the one token gap with a visible cost; fewer breakpoints with one shared phone floor; the counter is information.

**Consequences.** Q34 closes. Phone pages are shorter where `.display-xl` is 86 below 420 (Home, Work, Contact at 390). Work in light theme shows the deeper yellow for its range and arrows; dark theme is unchanged. Parity against PX-16: every 1440 dark capture and every study at 0 pixels.


## 0076 — The third discipline label shortens to “Product” on phones

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“would like for product/frontend to not wrap to another row on mobile. maybe just shorten to ‘product’ instead”); applied

**Decision.** Below 700px the chip beside “works.” reads “Product”; above, “Product / front end” as before. The screen-reader sentence still says “product and front end”. At or below 420 the words drop their 8px trailing margin so “moves.” plus its chip fits the 288px box at 320; the chip’s own padding keeps the gap.

**Consequences.** On phones each word and its chip share a line (measured at 700, 390 and 375). At 320 “works. [Product]” is one pixel over the 288px box and the chip wraps; the assistant left that rather than break the 8px padding unit for a width no current phone uses. Desktop unchanged (parity 0 at 1440).


## 0077 — The Work page carries the whole index in two tiers; every visible project gets a study

- **Date:** 2026-09-09
- **Status:** Timothy’s direction (“i also want to bring in all the other projects. so we need to figure out a good way to display them in teh works page” → after the mock, “studio gridform and gridform studio should be hidden. keep them in code but just not shown. everything else looks good to me” → “all of them should have case studies. whether theyre the 4 at the top or not”); applied in PX-18

**Context.** The old site has six projects beyond the four on the new one, each with a case study and assets. The assistant mocked a two-tier Work page (the selected four as wide rows, then a typographic index of the rest) and asked which four stay selected, whether to port the studies now, and whether index entries want a cover on hover.

**Decision.** Two tiers on Work: PARC, xrp.cafe, First Ledger and Do Androids Dream stay the selected rows; FirstStrike Research, Sonde, PARC Website and Jade Aesthetics follow as index entries 05–08 (number, title, one line, year, scope, no cover). Gridform Studio and Studio Gridform stay in the data with `hidden: true` and appear nowhere. Every visible project, selected or index, has an on-site case study at `/work/<slug>/`, ported from the old site with the PX-08 pipeline; index entries link to theirs. Counts run to 008. Pocketwatch stays out (0055). Home keeps the selected four.

**Reasoning.** Timothy’s, as quoted. The assistant’s: unequal projects want unequal weight; the index reads as the terminal listing the page already names; a hover cover would pull the second tier back toward the first.

**Consequences.** Four new studies and their assets; the study “Next” chain runs through all eight in order. Q33 and Q38 close. The hidden two have no pages; adding them later is a data flag.

**Applied (PX-18, 2026-09-09).** Built as decided, with three assistant calls worth recording. (1) **Jade Aesthetics’ images.** The old study showed no images at all — a `LiveEmbed` iframe of the live site was its only visual, and interactive components are dropped. The fourteen screenshots in `../timothyali/src/lib/images/jade-aesthetics/` were never displayed there; they are used here rather than shipping a text-only study. (2) **`word` values follow the existing pattern**, the full lowercase title: `firststrike research`, `sonde`, `parc website`, `jade aesthetics`. `firststrike research` measures 1120px at 172 in a 1376px box, so no shortening to `firststrike` was needed. (3) **The index tier still has no cover** (as decided), so the four new `cover` fields are data only; the type requires one and they are the natural OG image if that ever lands. One line of old-site copy was reworded: the PARC Website “notch” section ended “The same parts build this page”, true of the old page which was built from the live PARC components, so it now reads “…build every page on the site”. See the PX-18 entry in `docs/iteration-log.md`.


## 0078 — PARC Pixel replaces Jersey 25 and Silkscreen; the typeface gains seven glyphs and a new ampersand

- **Date:** 2026-09-09 / 2026-09-10
- **Status:** Timothy’s direction, applied in PX-19. His words: “can we replace all these all caps section titles and project names etc with parc pixel bold?”; “then whatever this font is [Silkscreen labels] replace with parc pixel medium everywhere” → “regular”; on size, “56”, read as the 55/56 option the assistant offered (Bold is crisp only at 41.25, 55, 82.5 and 110); “add the glyphs to the font”; the ampersand: “basically a backwards 3 with a line through it” → “just use the 3 glyph and flip it. the bold glyph looks broken” → “instead of a vertical stroke, just make it come out the top and bottom. not all the way through” → “scoot it over 1 pixel” → “for regular scoot it left 1. and for bold reduce the height of the stubs” → “good”.

**Context.** The display role (uppercase section titles, project names, the statement) was Jersey 25; the label role (metadata, nav, buttons, CTAs) was Silkscreen. PARC Pixel is Timothy’s own typeface from the PARC brand (`../timothyali/static/parc/`, six cuts, caps only, 58 glyphs). Its Regular draws caps on 5 cells, its Bold on 11, so each weight is crisp at its own sizes, and it is wide: a label line is 30% wider than Silkscreen at matching cap height, and Bold at 55 matches Jersey 82’s width with a quarter less cap height. Seven glyphs the site uses were missing: `[ ] · – — ’ ×`.

**Decision.**
- `--face-display` is PARC Pixel Bold: `.display` 55/56 (41.25/48 ≤700), `.display-s` 41.25/48 (27.5/32 ≤700), Home’s statement 55/64, the Work row title 41.25 ≤1100 and 27.5 ≤420. `--face-label` is PARC Pixel Regular: `.lbl` 12.5/16 everywhere Silkscreen was; the Work index range 25/32 (12.5/16 on phones). The status strip stays Press Start 2P; the blackletter and body faces are unchanged. Jersey 25 and Silkscreen are no longer loaded.
- The site ships its own build of the family (`static/fonts/`, “PARC Pixel Web” / “PARC Pixel Bold Web”, one family name per weight because each sits on its own grid), generated by `tools/fonts/extend-parc-pixel.py` from the untouched originals: the seven glyphs drawn on each weight’s grid (1-cell strokes and 1-cell gap for Regular, 3-cell strokes and 2-cell gap for Bold); the ampersand in all six cuts is the cut’s own 3 mirrored, with a stub one stroke tall out of the top and the bottom on the centre column — Regular on the centre, Bold one cell right with 2-cell stubs, Light one cell right; and the Bold rescaled to an 1100-unit em so its cell is exactly 80 units, because its original 800/11-unit cell rounded every advance and put inline text after bold type on fractional pixels.
- The cell table gains two rows: PARC Pixel 6.25 cells/em (12.5, 18.75, 25, 37.5, 50) and PARC Pixel Bold 13.75 cells/em (27.5, 41.25, 55, 82.5, 110). Fractional font sizes are on the table; the line boxes stay on 16/32/48/56.

**Reasoning.** Timothy’s: his own typeface on his own site. The assistant’s on sizes: 12.5 is the only label size (25 doubles every label’s width); 55 keeps every title its current width. Adding glyphs rather than changing formats was his call.

**Consequences.** Every page changes; no parity claim. The statement’s forced line break after “don’t” is gone (it landed mid-wrap at 55). Index entries stack their number above the title below 700 so “FIRSTSTRIKE” fits. Regular is exact on its grid already; Light and the Mono cuts carry only the new ampersand and are not used on the site. Supersedes the faces in 0046/0049; the cell-table rule stands.


## 0079 — Case-study titles set in PARC Pixel Bold

- **Date:** 2026-09-10
- **Status:** Timothy’s direction (“i think these should be parc pixel bold”, on the blackletter study title); applied

**Decision.** The study `h1` is `.display` (PARC Pixel Bold, uppercase) instead of the lowercase blackletter word: 110/112 at desktop, 82.5/88 ≤1100, 55/56 ≤900, 41.25/48 ≤700. The title may wrap between words; a single word cannot, so the hidden probe now measures the longest word and steps the visible text one cell down the Bold ladder when it would not fit (110 → 82.5 → 55 → 41.25 → 27.5). The step applies to the visible text only; the probe keeps the base size, otherwise it measures itself small and oscillates (found and fixed in the build). The `word` field keeps its lowercase strings; CSS uppercases them.

**Consequences.** Home’s “i’m tim.”, “building.” and Work’s “work.” stay blackletter (not asked). “FIRSTSTRIKE RESEARCH” and “DO ANDROIDS DREAM?” wrap to two lines at 1440; FIRSTSTRIKE and AESTHETICS step down on phones. Title fit verified on all eight studies at six widths; grid audit 0/0.


## 0080 — Pocketwatch returns to the index

- **Date:** 2026-09-10
- **Status:** Timothy’s direction (“wheres pocketwatch?” … “i didnt want it removed, just not in the 4 selected works”); applied

**Context.** 0055 recorded Pocketwatch as removed from the site. That was the assistant’s misreading: the instruction was to take it out of the four selected works. The full-index build (0077) then left it out on the same misreading.

**Decision.** Pocketwatch is index entry 09 with a full case study at `/work/pocketwatch/`, re-ported from the old site (copy, thirteen images at up to 1600px, 3.6MB, no video); the selected four are unchanged. Counts run to 009. Its position at the end of the index is the assistant’s default; moving it is a one-line reorder.

**Consequences.** Nine studies; the Next chain runs 01 → 09 → 01. 0055’s consequences paragraph carries the correction.


## 0081 — Landing selected work and closing footer refinement

- **Date:** 2026-09-10
- **Status:** Assistant proposal implemented under Timothy’s request to review, propose, implement and verify; awaiting visual acceptance.

**Direction.** Preserve the accepted design system, four selected projects and current copy. Review desktop/mobile views and document the iteration.

**Implementation choices.** Keep the two-column card gallery and continuous rain field. Separate cards with 32px column / 48px row gaps, retain dither frames around full-resolution covers, and give captions a solid page-colour background. Align caption titles at the top, with matching hover/focus arrow feedback. Use the existing 27.5px Bold cell size for card titles through 900px and the mobile work introduction, with 40px line-height around its 43px blackletter. Make All work a quiet action occupying the right column; align Get in touch to that column. Let the closing heading sit across the desktop width and wrap naturally when needed. Home’s footer gets grid-aligned controls with accent states, 48px mobile rows and balanced copyright wrapping. Inner-page footers retain their geometry.

**Preserved.** PARC, xrp.cafe, First Ledger, Do Androids Dream, their order, covers and labels; all other copy; tokens, font files, shared type roles, breakpoint set, theme/motion/grid behavior and navigation. No approval of this visual proposal is inferred from implementation authorization. Evidence and limitations are in PX-22.

## 0082 — Favicon and page-specific social images

- **Date:** 2026-09-10
- **Status:** Timothy requested updating the favicon and creating Open Graph images; implemented assistant visual proposal awaiting review.

Timothy put the additional landing typography exploration aside. No proposed word behaviors were implemented.

The favicon uses the actual Jacquard lowercase t in white on ink with a small yellow cursor, supplied as self-contained SVG, 16/32/48 ICO and 180px Apple touch icon. Twelve share images cover Home, Work, Contact and all nine visible studies. Existing typography, colours and covers form the compositions; no changes to page copy or selected projects. Public URL configuration retains `https://www.timothyali.com` from the previous site's `src/lib/site.ts`. Canonical, Open Graph and Twitter card metadata are emitted in prerendered HTML and update on client navigation. These are local assets, not a deployment. See PX-23.

### 0082 correction — uppercase favicon (2026-09-10)

Timothy requested the uppercase T from the same font on a yellow background. Favicon now uses the actual Jacquard uppercase T in ink on yellow, without the cursor. All SVG/ICO/PNG/touch-icon sizes regenerated. Open Graph designs unchanged.

## 0083 — Social previews match the terminal aesthetic

- **Date:** 2026-09-10
- **Status:** Timothy’s direction implemented; revised compositions are assistant proposals awaiting visual review.

Timothy found the first OG set boring compared with the site and requested the terminal aesthetic and larger type. All twelve images now use the site's actual ASCII glyphs as a falling texture, Press Start readouts, and a full-width yellow path/action strip. Home and Contact use 344px Jacquard; study titles use 82.5/88 PARC Pixel across the top instead of the small side label. Existing project imagery stays in colour. The uppercase T favicon, page content and metadata mapping remain unchanged.

## 0084 — Share images are rendered by the site, not drawn to look like it

- **Date:** 2026-09-10
- **Status:** Timothy’s direction (“need to make new opengraphs that actually match the aesthetic and the vibe of the site”); implemented, compositions awaiting his visual review

**Context.** Two passes (0082, 0083) hand-drew the share images in a standalone generator: fonts and colours were the site's, but the chrome, the texture and the layouts were approximations. Timothy rejected both. The site's look is mostly its running parts — the canvas field with its knockout, the cell-snapped type, the numbered nav and readout — and a static imitation of those reads as a knock-off.

**Decision.** The images are screenshots of a dev-only route, `/og/[id]`, built from the real components inside the real layout. Every image is the site's chrome plus one Band: Home is the hero at share size, Work is the page head with the four cards, Contact is its own head, each study is a Work row. The generator only starts a dev server, freezes time and motion, and screenshots. Two small pieces of site code exist to serve this: the layout reads an optional `chromePath` from page data for its path and active nav, and `svelte.config.js` permits `/og/[id]` as the one un-crawled prerenderable route (it declares no entries, so it never ships).

**Consequences.** The images cannot drift from the site: a change to the chrome, the texture, a face or a project flows into them on the next `pnpm social:generate`. The tradeoff is that the images are the site rather than a poster of it — no larger-than-life type beyond what the pages already carry. Regeneration needs Node, Playwright's Chromium and a free port 4174; it is still deterministic and local. Study images shed the coordinates from the strip, as the site does below 1100px, so long slugs fit at 1200.

## 0085 — The rebrand goes live; this folder is the repo

- **Date:** 2026-09-10
- **Status:** Timothy’s direction (“push this to the Timothyali repo and push live? I think we’re good to go”); done

**Context.** `timothyali2` had never been a git repository or deployed. The previous site lived in the sibling `timothyali` checkout of `github.com/tasyusef/timothyali`, whose `master` Vercel deploys to production at `www.timothyali.com`.

**Decision.** This folder became the checkout: `git init`, fetch the remote’s `master`, and commit the rebrand on top of it (`2469f7c`), so the old site stays in history and the sibling folder is untouched (it can be deleted). The site keeps `adapter-static`; `vercel.json` sets `framework: null`, `outputDirectory: build` and `trailingSlash: true` so the deploy matches the canonical `/…/` URLs, and redirects the old URLs: `/about` → `/contact/`, `/blog` → `/`, `/art` → `/work/`, `/work/rowboat-racer` → `/work/parc-site/`, the hidden Gridform pair → `/work/`. Redirects, the trailing-slash rule and the 404 fallback are one explicit `routes` list: Vercel’s file-based `404.html` never triggered on this deployment and the `rewrites` alternative returns a soft 200, so `routes` (filesystem first, then `status: 404` → `dest: /not-found/`). Two Vercel quirks cost three deploys: a file literally named `404.html` is never served by that name, and a `dest` must be a path the filesystem phase resolves (`/not-found/`, not `/not-found.html`). is the way to get a real 404 with the site’s page (0086). `static/robots.txt` allows everything; there is no sitemap yet.

**Consequences.** Every push to `master` is a production deploy. Regenerating the OG set is `pnpm social:generate`, then commit and push. Open: a sitemap, and a 404 page (Vercel’s default serves for unknown paths).

## 0086 — SEO pass: sitemap, structured data, 404, font preloads

- **Date:** 2026-09-10
- **Status:** Timothy’s direction (“make the sitemap and a full seo pass on the site”); implemented and deployed

**Audit.** The shipped HTML already had unique titles (20–38 chars) and descriptions (75–157 chars), one `h1` per page with `h2` sections, alt text on every image, canonical + Open Graph + Twitter tags, `lang`, viewport and theme-color. Missing: a sitemap, structured data, an author tag, a 404 page, and font preloads (five bitmap faces, `font-display: block` on PARC Pixel, so the first paint waited on them).

**Decision.** `src/routes/sitemap.xml/+server.ts` prerenders the twelve public URLs from `socialPages` (no `lastmod`: a build date would be a lie); `robots.txt` points at it. `src/lib/seo.ts` emits one JSON-LD graph per page through `SocialMeta`: Person + WebSite on Home, a BreadcrumbList on every inner page, a CollectionPage on Work, and a CreativeWork per study (cover image, first year, scope, live URL, author → the Person). The Person carries the site’s own positioning, Denver, and the two public profiles the old site listed (LinkedIn, GitHub). `meta name="author"` on every page. A 404 page in the system (`/not-found`, prerendered without a trailing slash to `build/not-found.html`, `noindex`), which the 404 route in `vercel.json` serves for unknown paths. The layout preloads the five faces the chrome and first fold use (68KB together). `pnpm social:verify` now also checks the sitemap, parses every page’s JSON-LD, and expects `404.html`.

**Not done, on purpose.** No `og:type: article` on studies (they are portfolio pages, not articles); no Twitter handle (none given); no analytics.

## 0087 — Launch story, rendered by the site

- **Date:** 2026-09-10
- **Status:** Timothy’s request (“lets make a post for my instagram story”); assistant composition awaiting his eye

**Decision.** The story is one more id on the dev-only `/og/` route (`/og/story`), so it is drawn by the same components and field as the site: the sky hero field, wordmark and a “New site” chip, “i’m tim.” at 258 with the cursor, the positioning line at 55/64 on three deliberate lines, the selected four as cards, and a yellow `timothyali.com ->` block. The frame is 1080×1920 with the layout chrome hidden by the generator, and every element sits inside Instagram’s safe zone (y 256–1540). Because a story is viewed at about a third of its pixels, the two small roles step up their own ladders rather than being scaled: label 12.5 → 25 (the index accent size), arrow 16 → 24 (three cells). Output: `docs/social/story-launch.png`, regenerated by `pnpm social:generate`.
