# Portfolio — Task Plan

Rules: work top to bottom, one task per PR, tests/lint pass before PR.
Tasks marked (blocked) need content from other projects — skip them.

Design direction: "BS-01 Field Terminal" solarpunk cyberdeck — spec in
`docs/superpowers/specs/2026-08-17-cyberdeck-design-direction-design.md`.
Implementation detail lives in
`docs/superpowers/plans/2026-08-17-bs01-cyberdeck-portfolio.md`; the
checklist below tracks the same work at PR granularity.

- [x] Scaffold Next.js (App Router, TypeScript, Tailwind) + Vitest/ESLint/Prettier; deploy note in README
- [x] Theme system: GREEN/AMBER/PAPER phosphor tokens, system-preference default, FOUC-free
- [x] Chassis shell: bezel, screen module w/ CRT treatment, gauge cluster frame, F-key nav, responsive collapse
- [x] Home page: viewport-scale hero + ports footer
- [x] Gauges: live solar meter + uptime; theme dial
- [x] Boot sequence overlay
- [x] Disk bay project index (4 cartridges)
- [x] Case-study template (MDX): meta strip, numbered sections, ESC-back; StagePass placeholder content
- [x] About page + resume.pdf; Contact (PING form server action + mailto)
- [x] Pixel garden (grows with case-study reading)
- [x] Lighthouse ≥95 + WCAG AA pass on home + StagePass (all three themes)
- [x] Design pass 2026-09-02: screen min-height, 10px chrome type floor, cartridge labels, ~/path lines on About/Contact, About spec sheet
- [x] StagePass case study (written from spec + schema; marks contracts/checkout as in progress — refresh when the build lands)
- [x] Meridian / Steward / CellarKeep case studies (written from each repo's README + design spec)
- [ ] Screenshots / LIVE flags on case studies once the demo deploys exist
- [ ] (post-launch) LED ticker, type-in hero, oscilloscope, easter eggs
