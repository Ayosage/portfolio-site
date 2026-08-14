# Portfolio — Task Plan

Rules: work top to bottom, one task per PR, tests/lint pass before PR.
Tasks marked (blocked) need content from other projects — skip them.

- [ ] Scaffold Next.js (App Router, TypeScript, Tailwind) with ESLint + Prettier; deploy pipeline note in README
- [ ] Design tokens: type scale, spacing, color palette (light + dark via system preference), documented in `docs/DESIGN.md`
- [ ] Layout shell: header nav, footer, responsive container; placeholder home page
- [ ] Hero section: name, positioning line, GitHub/LinkedIn/email links
- [ ] Projects grid component with placeholder cards (title, one-liner, tag chips, thumbnail slot)
- [ ] Case-study page template (`/projects/[slug]`): MDX-driven with sections for problem, architecture, decisions, gallery, links
- [ ] About page with bio + skills; resume PDF served from `/resume.pdf`
- [ ] Contact: mailto link + simple form via server action (no external service)
- [ ] (blocked) Stagepass case study content
- [ ] (blocked) Meridian / Steward / CellarKeep case study content
- [ ] Lighthouse pass: performance/accessibility/SEO ≥ 95 on home + one case study
