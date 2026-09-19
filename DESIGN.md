---
name: Ma (The Saffron Chronicle, theme/ma)
description: Mahdi MirMohamadi's portfolio as one tokonoma alcove. Sage plaster, pine-grey ink, a bronze shelf, and a single lime accent for what is alive.
colors:
  lime: "oklch(0.905 0.2 124)"
  lime-ink: "oklch(0.47 0.13 128)"
  on-lime: "oklch(0.22 0.03 125)"
  plaster: "oklch(0.936 0.013 128)"
  plaster-deep: "oklch(0.905 0.016 128)"
  plaster-lift: "oklch(0.962 0.009 128)"
  ink: "oklch(0.25 0.014 112)"
  ink-soft: "oklch(0.4 0.014 112)"
  ink-faint: "oklch(0.49 0.013 112)"
  rule: "oklch(0.8 0.016 120)"
  rule-strong: "oklch(0.34 0.014 112)"
  bronze: "oklch(0.31 0.022 80)"
  bronze-soft: "oklch(0.43 0.03 80)"
  shelf: "oklch(0.3 0.025 78)"
  shelf-rim: "oklch(0.42 0.03 78)"
  branch: "oklch(0.36 0.03 78)"
  oxblood: "oklch(0.5 0.15 28)"
  night-plaster: "oklch(0.205 0.009 128)"
  night-plaster-deep: "oklch(0.175 0.009 128)"
  night-plaster-lift: "oklch(0.235 0.01 128)"
  night-ink: "oklch(0.93 0.012 115)"
  night-ink-soft: "oklch(0.78 0.012 115)"
  night-ink-faint: "oklch(0.68 0.012 115)"
  night-rule: "oklch(0.33 0.012 120)"
  night-rule-strong: "oklch(0.72 0.012 115)"
  night-bronze-soft: "oklch(0.72 0.05 80)"
  night-shelf: "oklch(0.36 0.02 78)"
  night-shelf-rim: "oklch(0.5 0.025 78)"
  night-branch: "oklch(0.66 0.035 78)"
  night-oxblood: "oklch(0.7 0.14 30)"
typography:
  display:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.75rem + 3.3vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  hero:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.1vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.5rem + 1.1vw, 2.45rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(1.35rem, 1.22rem + 0.6vw, 1.7rem)"
    fontWeight: 400
    lineHeight: 1.08
  subtitle:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(1.15rem, 1.08rem + 0.35vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.15vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.6
  body-strong:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 600
    lineHeight: 1.6
  small:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(0.84rem, 0.82rem + 0.1vw, 0.9rem)"
    fontWeight: 400
    lineHeight: 1.6
  caption-mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    fontFeature: "tnum"
  persian:
    fontFamily: "Vazirmatn, Tahoma, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.15vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.9
  persian-display:
    fontFamily: "Vazirmatn, Tahoma, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "0"
rounded:
  tag: "3px"
  sm: "4px"
  md: "6px"
  key: "12px"
  pill: "999px"
spacing:
  3xs: "0.25rem"
  2xs: "0.5rem"
  xs: "0.75rem"
  s: "1rem"
  m: "1.5rem"
  l: "2.25rem"
  xl: "3.5rem"
  2xl: "5rem"
  gutter-phone: "18px"
  gutter: "32px"
  navbar: "60px"
  page-max: "1200px"
  measure: "68ch"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.on-lime}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.sm}"
    padding: "0.6em 1.3em"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.sm}"
    padding: "0.6em 1.3em"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.plaster-deep}"
  switch:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 0.8rem"
    height: "40px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.caption-mono}"
    rounded: "{rounded.tag}"
    padding: "0.05em 0.6em"
    height: "26px"
  tag-link:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.tag}"
    height: "36px"
  panel:
    backgroundColor: "{colors.plaster-lift}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.m}"
  print:
    backgroundColor: "{colors.plaster-deep}"
    rounded: "{rounded.sm}"
  bud-label-hover:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.on-lime}"
    rounded: "{rounded.tag}"
    padding: "0.2rem 0.5rem"
    height: "32px"
  shelf-rule:
    backgroundColor: "{colors.shelf}"
    rounded: "2px"
    height: "10px"
  dock:
    backgroundColor: "{colors.plaster-lift}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.md}"
    height: "56px"
---

# Design System: Ma

## Overview

**Creative North Star: "The Alcove"**

The site is a tokonoma, not a landing page. One recessed wall of cool sage plaster holds three things: the owner's photo hung as a scroll, his career drawn as a single git branch rising from a bronze bowl, and the empty wall between them, which points at the email. Everything after the alcove keeps the same quiet: ruled ledgers instead of cards, framed prints instead of tiles, thin ink lines instead of boxes and shadows. The emptiness is load-bearing ("ma"); it is what makes the one lime bloom read.

Density is calm but not sparse. Sections are ruled lists that a recruiter can scan in seconds, set in a plain sans under a chunky soft serif. Personality lives in a few crafted details (the branch that grows, the 1-bit portrait toggle, Nix the mascot, a live terminal) rather than in effects laid over every element. Night is the same alcove after dark: charcoal plaster, bone ink, the lime unchanged.

The world explicitly refuses: hard offset shadows, colour gradients, glow, eyebrows and kickers over headings, card grids, imitation brand marks, and monospace used as costume. PRODUCT.md's earlier "chunky outlines, hard offset shadows" personality belonged to the workstation edition; this world does not carry it.

**Key Characteristics:**
- Sage plaster ground, pine-grey ink, bronze shelf; one accent (lime) for what is alive or current.
- Flat: depth comes from recess (plaster-lift / plaster-deep) and thin ink rules, never shadow.
- Young Serif display at weight 400 over Geist; Geist Mono only for real data, code and captions.
- Ruled ledgers and single framed prints; no card grids.
- One authored motion moment (the branch grows, the buds open); everything else is quiet and state-driven.
- Full RTL parity: logical properties, mirrored arrows via `--dir`, Vazirmatn 800 for Persian headings.

## Colors

A near-monochrome sage-and-ink wall with a warm bronze ground line and one saturated yellow-green bloom.

### Primary
- **Bloom Lime** (lime): the single accent. Fill for the three hero buds and the Experience timeline buds, the one primary button of a block ("My experience" in the hero, "Call me!" in the close), the "you are here" dot in the navbar and dock, the bud that walks the AI workflow loop, the hovered resume choice, bud-label hover, text selection and the blog reading-progress bar. Never a surface, never text on plaster (it fails contrast there).
- **Stem Lime** (lime-ink): the readable form of the accent on plaster. Links, focus ring, caret, terminal prompt, list markers, hover underlines. In night mode it becomes Bloom Lime itself.
- **Seed Ink** (on-lime): text and icons on a lime fill.

### Secondary
- **Bronze** (bronze, bronze-soft): the shelf family. Bronze-soft draws the hollow commit nodes in the Work ledger and the terminal's amber role.
- **Shelf Bronze / Shelf Rim / Branch** (shelf, shelf-rim, branch): the alcove's furniture. The shelf bar under the hero and the shelf-rule divider, its 2-3px lighter rim, and the branch stroke and commit outlines. Night variants lift each so the furniture stays visible on charcoal.

### Tertiary
- **Oxblood** (oxblood): errors and "draft" only (terminal error output, 404, draft tags). Never decorative.

### Neutral
- **Sage Plaster** (plaster): the page ground.
- **Recess** (plaster-deep): ghost-button hover, photo and print backgrounds, inline-code wells.
- **Lifted Plaster** (plaster-lift): panels (terminal), the phone dock.
- **Pine Ink / Soft Ink / Faint Ink** (ink, ink-soft, ink-faint): headings and primary text / leads and secondary copy / captions, metadata, dates. Faint ink still clears 4.5:1 on plaster.
- **Hairline** (rule): default 1px dividers, tag outlines, rail edge.
- **Ink Rule** (rule-strong): ledger rows, print frames, the photo frame, ghost-button border.

### Named Rules
**The One Bloom Rule.** Lime marks only what is alive or current: the buds, the one primary action per block, the current nav item, and transient state (selection, reading progress, hover on a bud label or resume choice). If a second thing on screen wants lime, it gets ink instead.

**The Brand-on-Hover Exception.** Tool marks sit in ink until touched: hovering a skill lights its logo, border and a 12% tint in the tool's own brand colour (simple-icons hex; near-black brands fall back to ink at night). The AI tools row and the AI workflow nodes show their real colours at rest because they are the subject there. These third-party colours are the only blues and purples on the site, and they never become UI chrome.

**The Plaster, Not Cream Rule.** The day ground is cool sage (hue 128). No warm cream, no pure white, no pure black. Night is the same alcove under a navy sky: plaster oklch(0.215 0.045 262), deep 0.185, lift 0.25, rules at hue 260, cool ink; lime and the bronze shelf stay as they are.

**The No Gradient Rule.** Every fill is a flat token. No colour gradients, no blue or purple anywhere.

## Typography

**Display Font:** Young Serif (with Georgia, serif), weight 400 only
**Body Font:** Geist (with system-ui), weights 400 and 600
**Label/Mono Font:** Geist Mono (with ui-monospace), weights 400 and 600
**Persian:** Vazirmatn 400 / 800 replaces both display and body under `dir="rtl"`

**Character:** a chunky, soft, slightly old-fashioned serif carries the voice; a plain modern sans does the work. The contrast is warmth over precision, never ornament.

### Hierarchy
- **Display** (400, step-5, 1.08): the "Say hi." close only.
- **Hero** (400, clamp 2.25-3.4rem, 1.04, max 13ch): the one hero sentence.
- **Headline** (400, step-3): section titles. Short and plain ("Work", "Projects", "Skills").
- **Title** (400, step-2): company names in the ledger, project titles.
- **Subtitle** (400, step-1): index-line project titles, "Before that", "Elsewhere", prose h3.
- **Body** (400, step-0, 1.6, 56-68ch): leads and prose. Leads in ink-soft.
- **Small** (400, 0.82-0.95rem): metadata, shipped-lists, rail copy, nav.
- **Caption mono** (400, 0.72-0.75rem, tabular): data only: dates, terminal, tags, panel captions, the vertical coordinate caption.

### Named Rules
**The Honest Mono Rule.** Monospace appears only where the content is literally code or data: terminal, tags, dates, file-ish captions. Headings, nav, buttons and prose are never mono.

**The One Weight Display Rule.** Young Serif is set at 400 with -0.015em tracking and balanced wrapping. Emphasis comes from size and position, not bold. In RTL, headings switch to Vazirmatn 800, line-height 1.35, tracking 0.

## Layout

Scrolling to an anchor is smooth (off under reduced motion), and anchors land with the heading just under the navbar (`scroll-padding` 72px; each section cancels its own top padding via `scroll-margin`, plus `--anchor-extra` where a shelf or Nix sits above the heading). A sticky 60px navbar spans the top, closed by a 1px ink rule; content sits in a centred column (max 1200px, gutters 32px, 18px under 768px). At 900px+ the navbar carries the section links; below that they move to a floating five-item dock at the bottom (the footer reserves 80px for it) and the navbar keeps the brand, the call button and the switches.

The hero alcove is a two-column grid at 900px+ (1.15fr copy / 0.85fr arrangement, min-height ~100svh capped at 860px) closed by a full-bleed 22px shelf. On phones the arrangement moves above the words (the person leads) at up to 380px wide. The photo takes 58% of the arrangement's width.

Sections are separated by 5rem (space-2xl) of wall. Inside them, content is ruled rows or the branch: the Experience timeline (a bronze stem on the inline-start edge, story and "what I built there" recess side by side at 960px+), skills as label/chip rows (8rem label column; the list is LTR in both languages), Elsewhere as a two-column ruled list. Projects with screenshots pair up 1fr 1fr; with an odd count the lead print spans the full row with its note beside it (container query at 760px); projects without a screenshot are single index lines. Section leads run the full content width. Spacing follows the 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2.25 / 3.5 / 5rem scale.

**The Ledger Rule.** Lists of work, skills, tools and links are rows divided by 1px rules, not boxes. A row earns its height with content, not padding.

## Elevation & Depth

The system is flat. `--shadow` and every legacy shadow token resolve to `none`. Depth is conveyed by tonal recess (plaster-lift for panels, plaster-deep for wells and photo mats), by thin ink frames, and by the physical metaphor of the shelf: a solid bronze bar with a lighter top rim that things stand on.

The only non-flat effect is the **map-label halo**: bud labels carry a text-shadow in the wall colour (`0 0 2px plaster, 0 0 2px plaster, 0 0 4px plaster`) so the branch stays visible around the words. It is a legibility device, not elevation, and it drops on hover.

**The Shelf, Not Shadow Rule.** Things stand on a shelf; they do not float. No box-shadows, no hard offset shadows, no glow.

## Shapes

Near-square. Buttons, switches, print frames and inline code use 4-6px; tags and bud labels 3px; the shelf-rule 2px. Circles are reserved for the bud family (hero buds, timeline buds and nodes, the AI workflow nodes, the nav "here" dot, the hollow commit nodes in lists). Rules are 1px hairlines for structure, 1.5px (`--bw`) for button borders and bud-dot outlines. The photo is a hanging scroll: a 7px rounded rod over a 3:4 frame with no top border. Arrows are drawn 16px strokes (1.6 width, round caps) and mirror in RTL.

## Components

### Buttons
Plain rectangles; lime is spent only on the action that matters.
- **Shape:** gently squared (4px), 1.5px ink border, min-height 48px.
- **Primary:** lime fill, seed-ink text, Geist 600 at 0.98rem, a trailing arrow or a leading icon. One per block: "My experience" in the hero, "Call me!" in the close. At night the border becomes lime.
- **Ghost:** transparent with an ink-rule border; hover recesses to plaster-deep. The partner action: "My blog", "Email me".
- **Resume ticket:** a larger (60px) ghost with a dashed ink border, download icon and an `EN · FA` mono meta; hover turns the border solid. It opens the resume picker, never downloads directly (without JS it downloads the page's language).
- **Hover / Press:** the arrow leans 4px forward (mirrored by `--dir`); press scales to 0.97 in 90ms. No colour shift on the primary.

### Arrow links
Ink text, weight 600, a hairline underline that turns lime-ink on hover while the arrow leans forward. The standard tertiary action ("Read more", "All projects"). External links use the diagonal "out" arrow in faint ink.

### Tags
Thin 1px hairline, 3px corners, Geist Mono 0.75rem in ink-soft, 26px tall (36px when a link or a terminal chip). Hover on a linked tag moves the border to lime-ink. Persian tags switch to Vazirmatn. Oxblood outline only for "draft".

### Panels
A recess, not a window: plaster-lift, 1px hairline, 6px corners, a quiet mono caption line on top (the terminal's `zsh · mahdi@tehran`, `80×24`). No title-bar chrome, no traffic lights.

### Navigation
- **Navbar:** Nix's front-facing head is the mark (46px; hover lifts it 3px). Young Serif name beside it (hidden under 420px). Section links in ink-soft at 0.95rem; the current one goes ink 600 with a 7px lime bud under the word. At the inline-end: the call button (phone icon, and the number itself from 1180px), then the language switch (globe + short code) and the day/night switch (moon or sun, showing the state it switches to), all 40px, 4px corners, hairline.
- **Mobile:** the same bar without the links, plus a floating dock (plaster-lift, ink-rule frame, 6px, 56px items); the current item gets the same lime bud dot.

### The Alcove (signature)
Copy on the open wall (inline-start), the arrangement on the other side: photo scroll hung off-centre, the SVG branch (7 / 4.5 / 3.5 stroke widths, bronze) rising from a bronze bowl, hollow commit nodes on the stem, three lime buds (r 10, 2px ink stroke), and halo map-labels linking to what they mark, with a small mono date. Nix stands on the shelf waving toward the copy (mirrored per direction, tilts on hover). The bowl's foot sits on the shelf. The branch mirrors in RTL with `scale: var(--dir) 1`. The photo is shown as it is: no caption, no filters. Under the two buttons, phone and email are set as a plain labelled pair (icon, faint label, 600-weight value with a hairline underline), never behind a click.

### Nix (mascot)

A raster character cut with real alpha from the owner's generated sheets: sheet 1 by `scripts/nix.mjs` (waving, sleeping, panicked, typing), sheets 2 and 3 by `scripts/nix-sheets.mjs` (head, call, mail, cv, grad, thumbs, tea, music, search, point, think, bonsai), served as WebP through `src/components/art/Nix.astro` (`mood=…`). The front-facing head is the site's mark: the navbar logo and, via `scripts/icons.mjs`, the favicon/apple-touch badge (a plaster tile with an ink edge). One pose per place, each with a job:
- waving: hero shelf, beside "Get in touch", end of every blog post, MDX `<Nix>` asides, the social card
- bonsai (carrying the branch): beside the Experience title; grad: beside "Before that? I was studying"
- point: pointing at "All projects"; thumbs (with confetti): the "Ship it" node of the AI loop
- type: next to the terminal; think: beside the blog heading
- call / mail: at the end of the phone and email lines in the close; cv: on top of the resume picker
- sleep: footer; tea: empty blog; music (headphones): the lab; search (magnifier): the 404
Directional poses mirror with `var(--dir)` so they keep facing what they point at. Always decorative (empty alt). By day he sits directly on the plaster; by night a 1px `--rule-strong` cut line (four stacked 0-blur drop-shadows) keeps his black outline from dissolving into the dark. His own colours (cream body, amber horns, coral tail and blush, lime face) are part of the character, not the page palette, and never leak into UI.

### Experience timeline
The hero's branch carried down the page: a 3px bronze stem on the inline-start edge. Each current employer is a 24px lime bud on the stem; school is a hollow bronze node under the funny line "Before that? I was studying, obviously!" with a napping Nix. Each job: company in Young Serif (step-3) with an out-arrow, a date pill ("Oct 2025 – now" / "از مهر ۱۴۰۴ تا الان") beside place and mode, the role in 600, a one-sentence summary at step-1. "What I built there" sits in a plaster-lift recess (1px hairline, 6px) whose items carry hollow bronze commit nodes.

### AI workflow loop
Five circular nodes (72px, plaster-lift, ink frame) joined by bronze stems: I plan (my photo), an agent drafts (Claude Code + Cursor marks), I review (my photo), tests and CI (the Actions mark), ship (Nix). A dashed bronze U runs under draft and review, "not right? again", with an arrowhead back into the agent. Horizontal at 900px+, a vertical stem on phones (where the loop becomes an inline dashed tag). Motion: when it scrolls into view, the nodes enter with a 260ms stagger and each stem draws toward the next (line drawing, scale from the inline-start); then a lime bud and an ink ring walk the loop in eight 1.1s beats, taking the retry lap once. It pauses off-screen; reduced motion shows the static diagram.

### Browser frame (projects)
Each project with a screenshot shows the whole live page (`<slug>-full.jpg`, from `scripts/shots.mjs`) inside a small browser window: `--radius-key` (12px) corners, an ink frame, a bar with three hollow dots and a pill URL (lock + host). The window is 16:10 onto the top of the page; hovering or focusing the project pans the page to its bottom at reading speed (duration scales with page length, 1.2-14s, ease-in-out) and it glides back in 700ms. Touch screens and reduced motion get a plain scrollable window instead. Used on the home projects and each project page.

### AI toolbox
Four keycaps (the real tool marks, the tool name, a mono number legend, an LED dot) sit on a plaster-deep plate. A key is a cap over a darker skirt; hover or focus presses the cap 4px, click 6px, and its LED lights lime. Each key opens the tool's site; one line under it says what I use it for, always visible. The first time the plate is seen the keys type themselves once, left to right (170ms stagger).

### More nerdy stuff (last section)
Where the technical posts live, set like a chat list inside a plaster-lift panel: the Telegram channel with its own avatar (the owner's channel photo) and a Telegram badge, then X (@mahdimirmo). Each row: 64px round avatar, name, mono handle, a one-line preview, and an arrow CTA. Nix with his tea beside the heading.

### Resume picker
A native `<dialog>` (plaster-lift, ink rule, 6px) opened by any `[data-resume]`. Nix stands on its top edge with a speech bubble ("Pick one. I'll fetch it!"), then the question and two 64px choices (file icon, language, PDF meta, download icon) that fill lime on hover. It rises 14px and fades in (220-320ms ease-out, `@starting-style`), Nix hops in a beat later (scale and a small turn, ease-out), and it closes on Esc, the close button, the backdrop or a choice.

### Framed Prints
Projects with a screenshot are a single print (16:10, ink-rule frame, 4px, top-anchored crop) beside a note: serif title, ink-soft summary (48ch), faint stack line, arrow links. Hover scales only the image, 1.025 over 700ms. Projects without a screenshot become one ruled index line.

### Shelf-rule divider
A 10px bronze bar with a 2px lighter rim, 2px corners. Closes a passage (end of Work, opening the contact close). It is the only heavy horizontal in the system; use it at most once or twice a page.

### Motion
- **The one authored moment:** on load the three stems draw in (1.5s, then 900ms and 700ms, staggered 150/700/950ms, ease-out), then the buds open from 0.2 scale (520ms, 140ms apart) and their labels fade in.
- **Day / Night:** a view transition revealed as a circle from the toggle (620ms, ease-out).
- **Everything else:** hover and press only (90 / 160 / 240ms), a short page lift-and-fade between routes, scroll-driven rise for below-fold blocks.
- **Fallbacks:** under `prefers-reduced-motion` or `html[data-lite]` every animation is removed and final states are shown; theme and page changes become a 120ms crossfade.

## Do's and Don'ts

### Do:
- **Do** keep lime to buds, the one primary action per block and the current nav item (plus transient selection and progress); use lime-ink for any lime text or link on plaster.
- **Do** put the phone number wherever the email is: navbar, hero, the close, the footer, the terminal's `contact`.
- **Do** separate content with 1px rules (rule for structure, rule-strong for ledgers and frames) and let the plaster breathe between sections (5rem).
- **Do** close a passage with the shelf-rule, and let the hero stand on the full-bleed shelf.
- **Do** use Young Serif 400 for headings and Geist for everything readable; switch both to Vazirmatn (800 for headings) in RTL.
- **Do** use logical properties and multiply every directional translate or scale by `var(--dir)`; mirror arrows in RTL.
- **Do** give motion a reduced-motion and `html[data-lite]` path that shows the final state.
- **Do** show tools by their real marks: simple-icons in currentColor (brand colour on hover), official site icons for Antigravity and Hermes Agent, or the name alone when no mark exists.
- **Do** write like the person talks: first person, conversational, a little funny. Persian copy is colloquial (محاوره), not formal.

### Don't:
- **Don't** add box-shadows, hard offset shadows, glow or colour gradients; the world is flat plaster.
- **Don't** put an eyebrow or kicker line above a heading; a caption is for data and places only.
- **Don't** build card grids; use ruled ledgers, framed prints and index lines.
- **Don't** draw imitation logos or placeholder marks.
- **Don't** set headings, nav or buttons in monospace to look technical.
- **Don't** fill surfaces with lime or use it for decoration; don't introduce blue or purple outside the navy night wall and third-party brand marks.
- **Don't** give a section more than one authored animation (the growing branch in the hero, the loop in the AI section); everything else is feedback-sized.
