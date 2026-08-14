# Portfolio — Project Brief

**What:** Personal portfolio site for Brandon Smith (GitHub: Ayosage). The storefront
for a 5-project portfolio, targeting full-stack web + web3 roles. Built **last**
(week 4) because it sells finished work: live links, screenshots, case studies.

**Stack:** Next.js (App Router) + Tailwind, deployed on Vercel. Static-first,
no backend beyond a contact form action.

## Pages

- **Home** — hero (name, one-line positioning, links), featured projects grid.
- **Project case studies** — one page per project (Stagepass, Meridian, Steward,
  CellarKeep), each: problem → architecture → decisions → screenshots → live
  demo + repo links. Stagepass's case study includes the "web3 under the hood,
  invisible to users" write-up.
- **About / Resume** — short bio, skills, downloadable resume PDF.
- **Contact** — email link + form.

## Design intent

Distinctive but restrained — this must look *designed*, not templated
(use the frontend-design skill when building). Fast: 100 Lighthouse
performance is part of the pitch.

## Non-goals

- Blog/CMS (can be added post-launch).
- Dark/light theme toggle beyond system preference.

## Milestones

1. Scaffold + design system + layout shell (can start any time).
2. Case-study template + content for shipped projects (blocked on projects).
3. Launch on Vercel, custom domain optional.
