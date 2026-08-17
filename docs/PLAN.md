# Portfolio — Task Plan

Rules: work top to bottom, one task per PR, tests/lint pass before PR.
Tasks marked (blocked) need content from other projects — skip them.

Design direction: "BS-01 Field Terminal" solarpunk cyberdeck — spec in
`docs/superpowers/specs/2026-08-17-cyberdeck-design-direction-design.md`.
Implementation detail lives in
`docs/superpowers/plans/2026-08-17-bs01-cyberdeck-portfolio.md`; the
checklist below tracks the same work at PR granularity.

- [ ] Scaffold Next.js (App Router, TypeScript, Tailwind) + Vitest/ESLint/Prettier; deploy note in README
- [ ] Theme system: GREEN/AMBER/PAPER phosphor tokens, system-preference default, FOUC-free
- [ ] Chassis shell: bezel, screen module w/ CRT treatment, gauge cluster frame, F-key nav, responsive collapse
- [ ] Home page: viewport-scale hero + ports footer
- [ ] Gauges: live solar meter + uptime; theme dial
- [ ] Boot sequence overlay
- [ ] Disk bay project index (4 cartridges)
- [ ] Case-study template (MDX): meta strip, numbered sections, ESC-back; StagePass placeholder content
- [ ] About page + resume.pdf; Contact (PING form server action + mailto)
- [ ] Pixel garden (grows with case-study reading)
- [ ] Lighthouse ≥95 + WCAG AA pass on home + StagePass (all three themes)
- [ ] (blocked) StagePass real case-study content
- [ ] (blocked) Meridian / Steward / CellarKeep case-study content
- [ ] (post-launch) LED ticker, type-in hero, oscilloscope, easter eggs
