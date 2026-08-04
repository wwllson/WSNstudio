# Handoff: WSN × FHP Marketing Landing Page

## Overview
A single-page marketing site for **WSN × FHP**, a UK agency offering **web design** and **social media management** ("one agency, two doors in"). The page builds trust/credibility, explains the three ways to work (website / social / both), presents package tiers **without pricing**, and drives visitors to book a call via a contact form.

`FHP` is a **placeholder** for the social-media arm's brand name (a business partner's name), meant to be swapped in one place later.

## About the Design Files
The file in this bundle (`WSN x FHP.dc.html`) is a **design reference created in HTML** — a prototype showing intended look and behavior, **not production code to ship directly**. It is authored as a "Design Component" (a proprietary streaming-HTML format with `<x-dc>`, `{{ }}` template holes, and a `Component`/`renderVals()` logic class); **do not copy that structure**. The `{{ }}` holes and the logic class are documented below as plain values/behavior.

The task is to **recreate this design in the target codebase's existing environment** (React, Vue, SwiftUI, etc.) using its established patterns, component library, and tokens. If no environment exists yet, pick the most appropriate framework and implement there. Standard semantic HTML + CSS (flexbox/grid) reproduces this design directly.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all specified. Recreate the UI pixel-accurately using the codebase's libraries/patterns. Exact values are in **Design Tokens** below.

---

## Global Layout & Shell
- **Background:** solid black `#000000`. Body text `#F5F5F5`. Font smoothing: antialiased. `overflow-x: hidden`.
- **Content container:** every section centers content with `max-width: 1240px; margin: 0 auto; width: 100%` and horizontal padding `6vw`.
- **Vertical rhythm:** most sections use `padding: 90px 6vw`. Hero: `120px 6vw 130px`. Contact: `90px 6vw 110px`. Footer: `56px 6vw 60px`.
- **Aesthetic:** premium/minimal, Apple-like. Dark glassmorphism — translucent white cards with blur, hairline borders, generous spacing.
- **Ambient glow (toggleable):** three large blurred radial-gradient circles positioned behind content, tinted with the accent color at low opacity. `filter: blur(40px)`, `border-radius: 50%`, `pointer-events: none`, `z-index: 0`. All real content sits at `z-index: 1`. Positions (absolute, relative to page top): (1) top `-160px`, left 50% translateX(-40%), 900×900; (2) top `2600px`, right `-200px`, 760×760; (3) top `4600px`, left `-220px`, 720×720. Circles 1 & 3 use hero glow, circle 2 the softer side glow (see tokens). This is a visual nicety — implement as decorative absolutely-positioned divs or skip on low-end targets.

### Glass card recipe (used throughout)
- Standard card: `background: rgba(255,255,255,0.035)`, `border: 1px solid rgba(255,255,255,0.09)`, `border-radius: 24px`, `padding: 34px`, `backdrop-filter: blur(20px)` (+ `-webkit-` prefix), `display: flex; flex-direction: column`.
- Highlighted / "popular" card: `background: rgba(76,111,255,0.05)` (accent tint at ~0.05–0.06), `border: 1px solid rgba(accent, 0.4)`.
- Grids of cards use `grid-template-columns: repeat(auto-fit, minmax(280–290px, 1fr)); gap: 20px` — this is the entire responsive strategy (no media queries; cards reflow to 1 column when narrow).

---

## Screens / Views
This is one continuously-scrolled page. Sections in DOM order:

### 1. Sticky Nav
- **Layout:** `position: sticky; top: 0; z-index: 50`. Flex row, `space-between`, `align-items: center`, `padding: 20px 6vw`. `background: rgba(0,0,0,0.55)`, `backdrop-filter: blur(18px)`, bottom border `1px solid rgba(255,255,255,0.06)`.
- **Left:** wordmark `WSN × FHP` — "WSN" and "FHP" full-opacity 700 weight; the `×` is `opacity: 0.4`, weight 400. Space Grotesk, 19px, letter-spacing `-0.01em`. Links to `#top`.
- **Center:** nav links — "Ways to work" `#ways`, "Web design" `#web`, "Social" `#social`, "Bundles" `#bundles`, "How we work" `#process`. Flex, `gap: 34px`, 14.5px / weight 500, color `rgba(245,245,245,0.7)`, hover → `#F5F5F5`.
- **Right:** primary pill button "Book a call" → `#contact`. `background: #F5F5F5; color: #000; font-weight: 600; font-size: 14.5px; padding: 11px 22px; border-radius: 100px`. Hover: `filter: brightness(0.9)`.

### 2. Hero (`#top`)
- **Eyebrow pill:** inline-flex, `gap: 10px`, `padding: 8px 16px`, `border: 1px solid rgba(255,255,255,0.12)`, `border-radius: 100px`, `background: rgba(255,255,255,0.03)`, 13px/500, color `rgba(245,245,245,0.75)`, margin-bottom 44px. Leading 7px accent-colored dot. Text: `UK web design & social media · WSN × FHP`.
- **H1:** Space Grotesk 600, `font-size: clamp(52px, 9vw, 132px)`, `line-height: 0.94`, `letter-spacing: -0.03em`, `max-width: 14ch`, `text-wrap: balance`. Text: **"One agency. Two doors in."**
- **Subhead:** margin-top 34px, `clamp(17px, 1.7vw, 21px)`, `line-height: 1.6`, color `rgba(245,245,245,0.68)`, `max-width: 56ch`. Text: "Web design and social media management, run by one team. Come to us for a website, for your socials, or for both — and add the other whenever you're ready."
- **CTAs:** flex, `gap: 14px`, margin-top 44px.
  - Primary "Book a call" (white pill, black text, 16px/600, `padding: 16px 30px`, radius 100px) with a trailing 26px black circle containing a white `→`.
  - Ghost "See how we work": `border: 1px solid rgba(255,255,255,0.18)`, `#F5F5F5`, same padding/radius. Hover: `background: rgba(255,255,255,0.05)`.
- **Chip row:** margin-top 64px, `padding-top: 34px`, top border `1px solid rgba(255,255,255,0.08)`. Flex wrap, `gap: 28px`, 14px/500, color `rgba(245,245,245,0.55)`. Items separated by `/` glyphs at `rgba(255,255,255,0.2)`: "Websites", "Social media management", "Bundled packages", "One named strategist".

### 3. Ways to work (`#ways`) — section 01
- **Header block** (pattern reused in every section): eyebrow (Space Grotesk 14px, letter-spacing `0.04em`, **accent color**) reading `01 / Ways to work`; H2 (Space Grotesk 600, `clamp(32px, 4.6vw, 60px)`, `line-height: 1.02`, `letter-spacing: -0.02em`) "Come through whichever door fits"; supporting paragraph (17px, `line-height: 1.6`, `rgba(245,245,245,0.62)`, max-width ~52ch). Header uses flex column, `gap: 14px`, margin-bottom 52px.
- **3 cards** (auto-fit grid, min-height 280px):
  1. **Website only** — kicker "Door 01" (`rgba(245,245,245,0.4)`, 13px), H3 (Space Grotesk 600, 26px), body pushed to bottom via `margin-top: auto`. Copy: "A site that works as hard as you do. A one-off build or an ongoing care plan — no strings, no bundle required."
  2. **Social only** — kicker "Door 02". Copy: "Your social presence, run properly by a named strategist who actually knows your business — not a rotating queue."
  3. **Both, bundled** (highlighted card) — top-right badge "Most popular" (accent bg, white text, 12px/600, `padding: 6px 12px`, radius 100px). Kicker "Doors 01 + 02". Copy: "Your full online presence under one roof — one strategist, one plan, one invoice, priced below buying the two separately."
- H3 style across cards: Space Grotesk 600, 26px, `letter-spacing: -0.01em`.

### 4. Web design (`#web`) — section 02
- Header: eyebrow "02 / Web design"; H2 "Websites built for local business"; paragraph "A core, standalone offer — plenty of clients only ever want a great site, and that's exactly right."
- **3 pricing-less tier cards** (auto-fit grid, minmax 290px). Each: H3 (24px), one-line description (`15px, rgba(245,245,245,0.6)`), a **feature list rendered as hairline-separated rows** (each row: `padding: 13px 0; border-top: 1px solid rgba(255,255,255,0.08); font-size: 15px; color: rgba(245,245,245,0.75)`), then a bottom CTA (`margin-top: auto`).
  - **Starter** — desc "A clean, credible presence to get found and get calls." Features: "3–5 page brochure site" / "Mobile-responsive design" / "Custom-tailored template" / "Contact form" / "Basic on-page SEO". CTA: ghost "Get a quote".
  - **Business** (highlighted, "Popular" badge) — desc "A fully custom site you can run and grow yourself." Feature rows use brighter text `rgba(245,245,245,0.82)` and border `rgba(255,255,255,0.1)`. Features: "5–10 pages" / "Fully custom design" / "CMS you can edit yourself" / "Stronger SEO setup" / "Booking & enquiry forms". CTA: **white** solid "Get a quote".
  - **Premium & E-commerce** — desc "Bespoke design with everything wired to sell and book." Features: "Fully bespoke design" / "E-commerce or booking system" / "Payments, CRM & email integrations" / "Copywriting support" / "Priority build scheduling". CTA: ghost "Get a quote".
- **Care Plan strip** (full-width below cards): standard glass panel `padding: 30px 34px`, flex row wrap, `space-between`. Left: H4 "Care Plan — on every tier" (Space Grotesk 600, 20px) + paragraph "Hosting, security updates, uptime monitoring and small content edits. The easy way to keep your site healthy long after launch — and the natural first step from a one-off build to an ongoing partnership." Right: ghost button "Ask about care plans" (`white-space: nowrap`).

### 5. Social media (`#social`) — section 03
- Header: eyebrow "03 / Social media · FHP, by WSN"; H2 "Social media, built on relationships"; paragraph "One named strategist for the life of the relationship — someone who knows your goals, your seasons and your tone. Not whoever's free that day."
- **3 tier cards** (same card/feature pattern as Web):
  - **Foundation** — desc "A steady, reliable presence, handled for you." Features: "2 platforms" / "8–12 posts / month" / "Templated design" / "Monthly report" / "Monthly check-in call". CTA: ghost.
  - **Growth** (highlighted, "Popular") — desc "For businesses ready to actively grow with paid reach." Features: "3–4 platforms" / "20+ posts / month" / "Custom design" / "Paid ad management" / "Named strategist · quarterly review". CTA: white solid.
  - **Signature** — desc "The highest-touch service, fully hands-off for you." Features: "All relevant platforms" / "40+ posts / month" / "Photo & video" / "Full paid ads & local partnerships" / "Monthly in-person / video review". CTA: ghost.

### 6. Bundles (`#bundles`) — section 04
- Header: eyebrow "04 / The flagship"; H2 "Everything, pulling in one direction"; paragraph "A bundle isn't a discount tacked on. It's one strategist and one Success Plan across your whole online presence — so your site and your socials always work together, priced below buying them separately."
- **3 bundle cards** (auto-fit grid, min-height 250px, `gap: 14px` internally). Each: H3 (24px), an **accent-colored combo line** (14px/600), and body pushed to bottom.
  - **Launch Bundle** — combo "Starter site + Foundation social". Copy: "New to online? A working site and a steady social presence from day one — the whole thing set up and running for you."
  - **Growth Bundle** (highlighted, badge "Most chosen", tint `rgba(76,111,255,0.06)`) — combo "Business site + Growth social". Copy: "Established and ready to grow: a stronger, fully custom site plus paid ads and a named strategist steering both."
  - **Signature Bundle** — combo "Premium site + Signature social". Copy: "A full bespoke presence with the highest-touch social service, and one dedicated strategist for absolutely everything."
- **"Only with a bundle" panel** (full-width glass, `padding: 30px 34px`): small caps label "ONLY WITH A BUNDLE" (Space Grotesk 13px, letter-spacing `0.04em`, `rgba(245,245,245,0.5)`), then a 3-col auto-fit grid (minmax 240px, gap 20px) of items. Each item: leading 8px accent dot (`margin-top: 7px`, `flex-shrink: 0`) + text (`15.5px, line-height 1.55, rgba(245,245,245,0.78)`):
  1. "One named strategist for your site and your socials — not two separate contacts."
  2. "One combined Success Plan and report, so site and social are read side by side."
  3. "One invoice, and priority scheduling for both the build and the ongoing work."

### 7. Where the lines meet — section 05 (no id)
- Header: eyebrow "05 / Where the lines meet"; H2 "Start anywhere. Grow naturally." (no paragraph).
- **3 columns** (auto-fit grid, minmax 280px). Each column: top border `1px solid rgba(255,255,255,0.12)`, `padding-top: 26px`, flex column `gap: 14px`. An **accent-colored label ending in "→"** (Space Grotesk 15px) + paragraph (16px, `line-height 1.62`, `rgba(245,245,245,0.7)`):
  1. **"Website client →"** — "When a refresh or care-plan check-in comes around, that's the natural moment to talk about running your socials too."
  2. **"Social client →"** — "If your site is outdated or underperforming, we bring in web design and move you onto a bundle — one team, one plan."
  3. **"New to both →"** — "See all three doors up front — website, social, or both — and pick what genuinely fits where you are today."

### 8. How we work (`#process`) — section 06
- Header: eyebrow "06 / How we work"; H2 "One team, one plan, one point of contact".
- **4 steps** (auto-fit grid, minmax 250px, gap 20px). Each: large ghost number "01"–"04" (Space Grotesk 44px, weight 500, color `rgba(255,255,255,0.14)`, `line-height: 1`), H4 (Space Grotesk 600, 20px), paragraph (15.5px, `line-height 1.6`, `rgba(245,245,245,0.64)`):
  1. **Discovery** — "We learn your goals, your busy and slow seasons, and the tone that's right for your brand."
  2. **Success Plan** — "A short, co-owned plan your strategist actually works to — not a document that gathers dust."
  3. **Build & launch** — "Your site, your socials, or both — delivered by a team that actually talks to each other."
  4. **Ongoing partnership** — "Monthly check-ins, quarterly reviews and an always-open line. We suggest more only when it genuinely helps."

### 9. Contact (`#contact`)
- **2-column layout** (auto-fit grid, minmax 320px, gap 44px, `align-items: start`).
- **Left column:** eyebrow "Book a call"; H2 "Let's talk about your online presence" (`clamp(34px, 4.8vw, 60px)`, `line-height: 1`, max-width 14ch); paragraph "Tell us where you are today and what you want next. We'll come back with the door — or the bundle — that fits." Below, a details list (top border, `padding-top: 26px`, flex column gap 16px) of label/value rows (`space-between`, 15.5px; labels `rgba(245,245,245,0.5)`):
  - Email → `hello@wsn.example` (mailto link, accent colored) — **placeholder**
  - Phone → `+44 (0)000 000 0000` — **placeholder**
  - Based → "United Kingdom · remote-friendly"
- **Right column: contact form card** (glass, `border-radius: 26px`, `padding: 36px`, border `rgba(255,255,255,0.1)`). Fields (each: label 13.5px/600 `rgba(245,245,245,0.7)` + input; inputs `background: rgba(0,0,0,0.35)`, `border: 1px solid rgba(255,255,255,0.14)`, `border-radius: 12px`, `padding: 13px 15px`, `#F5F5F5`, 15px, focus border → accent `#4C6FFF`):
  - Your name (text, required, placeholder "Jane Smith")
  - Business name (text, required, placeholder "Your business")
  - Email (email, required, placeholder "you@business.co.uk")
  - "I'm interested in" (select; options: "A website", "Social media management", "Both — a bundle", "Not sure yet"; option bg `#111`)
  - "Anything else?" (textarea, 3 rows, `resize: vertical`, placeholder "A line or two about where you're at")
  - Submit button (white solid pill, full width, 16px/600, `padding: 15px`): "Book a call"
- **Submitted state** (replaces the form on submit): centered column — 52px accent-filled circle with white "✓", H3 "Thanks — we'll be in touch", paragraph "We usually reply within one working day with the next step."

### 10. Footer
- Top border `1px solid rgba(255,255,255,0.08)`. Inner container flex wrap, `space-between`, `align-items: flex-start`, gap 32px.
- **Left:** wordmark "WSN × FHP" (Space Grotesk 700, 20px, `×` at opacity 0.4/weight 400); paragraph "Web design and social media management for UK local businesses — one agency, two doors in." (`rgba(245,245,245,0.55)`); small line "FHP, by WSN · the social arm." (`rgba(245,245,245,0.4)`, 13.5px).
- **Right:** two link columns (gap 56px). "Services": Web design `#web`, Social media `#social`, Bundles `#bundles`. "Agency": How we work `#process`, Ways to work `#ways`, Book a call `#contact`. Column headers `rgba(245,245,245,0.4)`/600; links `rgba(245,245,245,0.7)` → hover `#F5F5F5`.
- **Bottom bar:** `margin-top: 40px`, `padding-top: 24px`, top border `rgba(255,255,255,0.06)`, 13px, `rgba(245,245,245,0.4)`: "© 2026 WSN × FHP. All rights reserved."

---

## Interactions & Behavior
- **Nav & CTAs:** in-page anchor links (`#top`, `#ways`, `#web`, `#social`, `#bundles`, `#process`, `#contact`). `html { scroll-behavior: smooth }`.
- **Hover states:** nav links / footer links `rgba(245,245,245,0.7)` → `#F5F5F5`. Ghost buttons gain `background: rgba(255,255,255,0.05)`. White/solid buttons `filter: brightness(0.9)`. All transitions ~0.2s ease (links explicitly `transition: color .2s ease`).
- **Form focus:** inputs/select/textarea border transitions to accent `#4C6FFF` on focus.
- **Form submit:** `preventDefault`, then swap the entire form for the success confirmation (client-side state flag `submitted`). No real network call is wired — connect to the real endpoint/CRM in implementation. No field validation beyond native `required` + `type="email"`.
- **Selection color:** `::selection { background: rgba(76,111,255,0.35) }`.
- **Responsive:** achieved purely via `clamp()` type and `repeat(auto-fit, minmax(...))` grids — cards collapse to a single column on narrow viewports. Nav is not collapsed into a hamburger in the prototype; **add a mobile nav pattern** from the target codebase for small screens.

## State Management
- `submitted: boolean` — false initially; set true on form submit; toggles form ↔ success message.
- **Configurable/tweakable values** (were design "props"; treat as theme config or CMS fields):
  - `socialName` (string, default `"FHP"`) — the social-arm brand name. Appears in: nav & footer wordmark, hero eyebrow, section 03 eyebrow ("… · FHP, by WSN"), footer sub-line ("FHP, by WSN …"), copyright. **Single source of truth — wire once.**
  - `accent` (enum: `blue` `#4C6FFF` / `purple` `#A78BFA` / `cyan` `#5EEAD4`, default `blue`) — drives eyebrow text, badges, dots, combo lines, focus rings, highlighted-card borders/tints, glows, `✓` circle.
  - `showGlow` (boolean, default true) — toggles the three ambient glow circles.

## Design Tokens
**Colors**
- Background: `#000000`
- Text (primary): `#F5F5F5`
- Text muted tiers: `rgba(245,245,245,0.75)`, `0.7`, `0.68`, `0.66`, `0.64`, `0.62`, `0.6`, `0.55`, `0.5`, `0.4`
- Glass card bg: `rgba(255,255,255,0.035)` (and `0.03`, `0.04`)
- Card border: `rgba(255,255,255,0.09)` (also `0.08`, `0.1`, `0.12`, `0.06`, `0.14`, `0.18`)
- Accent — Electric Blue (default): `#4C6FFF`; accent tint bg `rgba(76,111,255,0.05–0.06)`; accent border `rgba(76,111,255,0.4)`
- Accent alternates: Neon Purple `#A78BFA`, Cool Cyan `#5EEAD4`
- Input bg: `rgba(0,0,0,0.35)`
- Selection: `rgba(76,111,255,0.35)`
- Glow hero: `radial-gradient(circle, rgba(accent,0.22) 0%, transparent 68%)`; glow side: `…rgba(accent,0.16)…`
- (From brand palette, for reference: Deep Charcoal `#111111`, Soft Graphite `#1A1A1A` — used only for `<option>` backgrounds here.)

**Typography**
- Display/headings: **Space Grotesk** (weights 400/500/600/700)
- Body/UI: **Manrope** (weights 400/500/600/700)
- Both via Google Fonts.
- Scale: H1 `clamp(52px,9vw,132px)`/lh 0.94/ls -0.03em; section H2 `clamp(32px,4.6vw,60px)`/lh 1.02/ls -0.02em; contact H2 `clamp(34px,4.8vw,60px)`; card H3 24–26px/ls -0.01em; H4 20px; body 15–21px; eyebrows 13–15px/ls 0.04em; big step numbers 44px.

**Spacing** — section padding block 90px (hero 120/130, contact 90/110); container max-width 1240px, side padding 6vw; card padding 34px (strips 30px 34px); grid gap 20px; header block gap 14px, margin-bottom 52px.

**Border radius** — cards 24px; contact card 26px; inputs 12px; pills/buttons/badges 100px; dots/circles 50%.

**Blur** — cards `blur(20px)`; nav `blur(18px)`; glow `blur(40px)`.

## Assets
- **Fonts only:** Space Grotesk + Manrope (Google Fonts) — swap for the codebase's equivalents/self-hosted if preferred.
- **No images or icon files.** The `→` and `✓` are text glyphs; dots/circles are CSS. Replace glyphs with the codebase's icon set if desired.
- **No logo asset** — wordmark is text. User will supply a real logo, real project imagery, team photos, and real contact details later; the email/phone above are placeholders.

## Files
- `WSN x FHP.dc.html` — the full design (all sections, styles, and behavior described above). Included in this bundle as the visual reference. It is a Design Component file; **read it for exact values, do not port its `<x-dc>`/`{{ }}`/logic-class structure.**
