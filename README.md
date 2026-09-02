# Portfolio

Personal portfolio site — Next.js + Tailwind on Vercel.

- Scope + design intent: [docs/BRIEF.md](docs/BRIEF.md)
- Task plan: [docs/PLAN.md](docs/PLAN.md)

## Deploy

Vercel, static-first. Push to `main` → production. Preview deploys on PRs.
`npm run build` must pass and Lighthouse ≥95 (see docs/PLAN.md) before merge.

Environment variables (Vercel project settings; see `.env.example`):

- `RESEND_API_KEY` — contact-form delivery. Required in production; without it
  the PING form reports "MAIL NOT CONFIGURED" and points people at the mailto.
- `CONTACT_TO` — inbox for pings (defaults to the footer address).
- `CONTACT_FROM` — optional verified sender; defaults to Resend's onboarding sender.

The bezel serial number is the deployed git short hash: local builds read git,
Vercel builds read `VERCEL_GIT_COMMIT_SHA` (injected automatically).
