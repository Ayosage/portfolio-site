# Portfolio Design Direction — "BS-01 Field Terminal" (Solarpunk Cyberdeck)

**Status:** Approved direction (brainstormed 2026-08-17 with visual mockups; mockup files
persist in `.superpowers/brainstorm/`).
**Supersedes:** the generic "distinctive but restrained" note in `docs/BRIEF.md` — brief
constraints (Lighthouse, static-first, content-first) still hold.

## Concept

The portfolio is presented as a piece of handheld field hardware: the **BS-01 Field
Terminal**, a solar-powered cyberdeck. The browser renders the whole rig — a CRT
phosphor screen module set in a visible chassis with working keys, gauges, and
switches. Content (projects, case studies, about, contact) lives on the screen;
the hardware is chrome, never a gate.

Aesthetic lineage: 2026 brutalism (type at viewport scale, edge-to-edge, hard
structure, honest rawness) × CRT/terminal retro-computing × solarpunk
(solar-powered field hardware, repair culture, growth motifs).

Rejected along the way, for the record: editorial solarpunk brutalism on paper
tones (two palette variants, "Sun-bleached" and "Overgrowth" — died at the
deeper page mockups), a typed-command terminal UI (gates content; saturated
genre), and a three.js game portfolio (fights Lighthouse ≥95; tutorial-clone
risk).

## Visual system

### Palette — three phosphor themes via a hardware "theme dial"

| Token | GREEN (default) | AMBER | PAPER (light) |
|---|---|---|---|
| screen ground | `#0D110B` | `#120E08` | `#F2EDDE` |
| phosphor primary | `#D8F26E` | `#FFB454` | `#1A1A14` (ink) |
| phosphor dim | `#8FA05C` | `#B37E3B` | `#5A6050` |
| hairline/border | `#3A4A2A` | `#4A3A22` | `#B8B29E` |
| chassis | `#23261D` (shared) | shared | `#D9D2BE` |
| alert/action (PING key) | `#7A3020` / `#F0D8C8` | shared | `#C24A28` |

- System `prefers-color-scheme: light` defaults the dial to PAPER; dark defaults
  to GREEN. Dial choice persists (localStorage) and overrides.
- No gradients anywhere except CRT glow effects (text-shadow, inset screen
  shadow, vignette) and **lighting** (amended 2026-09-03): the light pool on
  the bench behind the rig, the top-to-bottom sheen on the chassis plate, and
  the domed highlights on rivets and the knob. Lighting gradients describe how
  light falls on a surface; they never decorate one. Zero border-radius on
  screen content; small radii allowed on chassis hardware only.
- **Chassis material (amended 2026-09-03): powder-coated metal, not moulded
  plastic.** Brushed grain runs left to right; a chamfered edge catches light
  top-left and falls dark bottom-right; the coat is worn to bare metal at the
  corners and along the top edge where a hand grabs it; one scratch; domed
  rivets at the four corners with a faint rust bloom under one of them as the
  only oxidation on the rig. Nothing on the chassis glows: the LED and the CRT
  remain the only light sources.
- **The bench (amended 2026-09-03):** on wide viewports the rig sits as an
  object on a darker bench surface. The bench stays empty — no props, no
  cables — so the negative space reads as a lit workspace, not as unfilled
  page. Anything new that needs a home goes on the rig, not the bench.
- All text/ground pairs must clear WCAG AA 4.5:1 — phosphor dim on screen
  ground included.

### Typography

- **Mono** — JetBrains Mono, self-hosted and subsetted (swappable later if a
  more CRT-flavored face is found, but this is the working decision): all
  hardware chrome, headings, metadata, nav, tickers.
- **Sans** (system stack): long-form body text in case studies and about. Mono
  paragraphs at reading length are fatiguing; readable case studies are the
  point of the site.
- Hero/display type: mono at viewport scale (`clamp`-driven, ~0.85 line-height,
  tight tracking, uppercase), phosphor glow via text-shadow.

### CRT treatment (screen module only)

Scanlines (repeating-linear-gradient overlay, ~4% opacity, never over-darkening
text), phosphor glow on display type, inset tube shadow + slight vignette.
Scanlines are a static texture, toggleable via the SCANLINES flip-switch;
`prefers-reduced-motion` does not affect them. Only animated effects (boot,
flicker, type-in, degauss, garden growth animation) obey `prefers-reduced-motion`.

## Hardware layout (desktop)

- **Top bezel:** model label `BS-01 ▪ FIELD TERMINAL`, serial number (= deployed
  git short-hash), flip-switches (SCANLINES, SOUND), power LED.
- **Screen module (dominant, ~80% width):** all page content.
- **F-key row (below screen):** F1 WORK / F2 ABOUT / F3 CV / F4 PING (contact,
  alert-colored). Primary nav.
- **Gauge cluster (right sidebar):** SOLAR meter, UPTIME, THEME dial, STATUS,
  then (added 2026-09-03) SCOPE (static trace until the oscilloscope task),
  BRIGHTNESS knob (five detents, persisted; dims the CRT below 3, widens the
  phosphor glow above), and a speaker grille that fills whatever height is
  left down to the F-keys. The column runs full height; the grille is texture,
  not a control. Mobile keeps the four-well grid only.
- **LED ticker (below keys):** status marquee.
- **Chassis lore:** screws, worn decals, `RUNS ON SUNLIGHT` etching, sticker
  patches. Pure CSS/SVG texture.

**Responsive:** chassis is desktop-first flavor. On mobile the rig collapses to:
thin top status strip (label + LED), full-bleed screen, F-keys become a bottom
tab bar, gauge cluster folds into the status strip (tap to expand). Content is
never sacrificed to chrome on small screens.

## Feature set

### Core (launch)

1. **Boot sequence** — first visit per session: ≤1.2s BIOS/POST screen
   (`MEM OK … LOADING PORTFOLIO.SYS`), skippable on any key/tap; brief tube
   warm-up flicker on route transitions. Never blocks content indexing (SSR
   content present; boot is a CSS/JS overlay).
2. **Live gauges** — SOLAR meter computed from visitor's local time/sun position;
   UPTIME = days since deploy (build-time stamp). Real data only.
3. **Working keyboard** — F-key row depresses on click; real keyboard shortcuts
   (1/2/3/4, W/A/C/P) navigate. Key-click sounds behind the SOUND switch,
   **off by default**, tiny audio sprites.
4. **Theme dial** — GREEN / AMBER / PAPER as above.
5. **Disk-bay project loader** — the project index is a disk bay; each project a
   cartridge (title, one-liner, tags, status). Selecting inserts it: short
   spin-up animation → case study renders on screen. Case studies remain real
   routes (`/projects/[slug]`, MDX) — the bay is presentation, deep links work,
   crawlers see plain pages.
6. **Chassis lore** — serial = git hash, decals, etching (zero JS).
7. **Pixel garden** — plant in the gauge cluster grows one stage per case-study
   section read (scroll-depth milestones, persisted per session). Full growth:
   tiny bloom + easter-egg ticker line.

### Post-launch garnish (tracked, not built at launch)

- LED ticker with real GitHub activity (build-time fetch)
- Type-in hero + block cursor
- Oscilloscope widget (scroll-progress on case studies)
- Easter eggs: degauss wobble on glass click, Konami test pattern, typing
  "hire" glows F4 PING

## Page treatments (on the screen module)

- **Home:** boot → hero (name at viewport scale, positioning line, status line)
  → disk bay (4 cartridges) → footer strip (GitHub/LinkedIn/email as port
  labels: `USB-C ▸ GITHUB` etc.).
- **Case study (`/projects/[slug]`):** path bar (`~/work/stagepass`, `[ESC] BACK`
  — ESC actually navigates back), display title, bordered meta strip
  (ROLE / STACK / YEAR / LIVE●), numbered sections (`01 — THE PROBLEM`,
  `02 — ARCHITECTURE`, …) in mono; body copy in sans; screenshot gallery with
  phosphor-tint hover treatment.
- **About/CV:** same chrome; resume served at `/resume.pdf` from F3.
- **Contact:** F4 PING opens a transmission-styled form (server action, no
  external service) + mailto.

## Engineering guardrails

- Next.js App Router + Tailwind (per brief), static-first. All chrome is
  CSS/SVG + a few KB of vanilla JS/React. **No WebGL, no canvas, no animation
  libraries.**
- Lighthouse ≥95 across performance/accessibility/SEO on home + one case study
  is an acceptance criterion for the design, not a hope. Boot overlay and
  effects must not degrade LCP/CLS.
- One subsetted mono webfont; sans is system stack (zero font cost).
- Full keyboard operability and screen-reader sanity: chrome elements get
  proper roles/labels or `aria-hidden`; nav is real links under the keycap
  styling; `prefers-reduced-motion` disables boot animation, flicker, type-in,
  garden animation (state changes remain, motion doesn't).
- SEO: all content server-rendered; hardware metaphor lives in CSS classes,
  not in the semantics.

## Non-goals

- No typed-command terminal (explicitly dropped).
- No three.js / WebGL.
- No sound on by default; no autoplaying audio ever.
- No CMS/blog (unchanged from brief).

## Success criteria

- A visitor understands "full-stack engineer, here's the work" within 10
  seconds without touching anything.
- The rig is memorable enough to describe in one sentence ("his portfolio is a
  solar-powered cyberdeck").
- Lighthouse ≥95 held; WCAG AA held in all three themes.
