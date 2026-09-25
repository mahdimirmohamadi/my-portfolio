# Product

## Register

brand

## Users

Four audiences, in order of weight:

1. **Hiring managers and recruiters**, mostly for remote software engineering roles abroad. They skim in under a minute, want proof of real production work, and decide fast.
2. **Freelance clients** who need a fast, well-built website or web app and want to know they're dealing with a careful professional.
3. **Iranian employers** reading the Persian (RTL) version at `/fa/`. It is a first-class edition, not a translation afterthought.
4. **Developer peers** who arrive through the blog (the web, Linux, AI) and stay for the craft.

They read on phones as often as on desktops, often on slow or throttled connections.

## Product Purpose

The personal site of Mahdi MirMohamadi, an AI-native software engineer in Tehran with 4 years on real products under real load: React, Next.js, TypeScript and Astro, Linux as the daily driver, and AI tools in the loop. The site has to show, not claim, that he is professional with computers and genuinely curious about how things work.

**Success = the visitor calls or emails him.** The phone number and the email are the two most important things on the site; every page should make that next step obvious and easy. Resume downloads and blog reads are supporting signals.

## Brand Personality

**Professional, curious, playful.** Mostly modern and technical, with a light cartoonish edge (a chunky soft display serif and Nix, the small mascot) that shows personality without looking childish. The voice is first person, nerdy and specific, and it sounds spoken: friendly, a little funny ("Before that? I was studying, obviously!"), short sentences, real numbers, no hype. Persian copy is colloquial (محاوره), never formal. It is Linux- and AI-native: a mascot that answers the cursor, a live terminal, real screenshots of shipped work.

## Anti-references

- **Generic AI-generated portfolios**: the pill-badge + giant headline + two CTAs + three stats hero; cursor-following glow "spotlight" cards; dot-grid backgrounds; a glitch/decrypt effect on every heading; purple/blue "AI" gradients.
- **Iranian / Shahnameh / manga theming**: tried on `main` and rejected by the owner. Don't bring those motifs here.
- **Oversized display type** and inflated, poetic section titles ("Where I've shipped", "What's running"). Titles are short and professional.
- **Fake data visualisations**: skill percentage bars and htop-style meters that don't mean anything.
- **Empty half-width layouts** and sections with large dead whitespace.

## Design Principles

1. **Practice what you preach.** A software engineer's site must be fast (Lighthouse mobile ≥ 95), accessible and polished. Performance is part of the pitch.
2. **Real computer metaphors, used honestly.** Terminal, editor and git log are working UI with real content, not wallpaper. If a metaphor makes information harder to scan, drop it.
3. **Show, don't claim.** Specific facts (30% faster page loads, InnoMeet live streaming, AI scoring) beat adjectives. Illustrative content is labelled as such.
4. **Compact and scannable.** A recruiter should get role, experience, stack and contact within one or two screens. Every section earns its height.
5. **Personality in the details, not the volume.** Delight comes from small, crafted moments (the hero arrival, Nix reacting to what you touch, the AI workflow loop, the mascot in many small places), never from effects stacked on every element.

## Accessibility & Inclusion

- WCAG 2.2 AA: 4.5:1 body text contrast (3:1 large text), full keyboard access, visible focus, sensible landmarks and heading order.
- `prefers-reduced-motion` and low-end devices (`html[data-lite]`: Save-Data or ≤ 4 cores) get the calm path with final states always visible.
- Bilingual EN / FA with full RTL: logical properties everywhere, a proper Persian typeface, Persian digits and Jalali dates.
- Mobile-first: 44px touch targets, no hover-only information, and no horizontal scroll from 360px up.
