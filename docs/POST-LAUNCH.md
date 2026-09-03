# Post-launch log — brandon.party

Live since 2026-09-03 at https://www.brandon.party (apex `brandon.party` 308s to
`www`). Hosted on Vercel from `main`. Audit run the same day against the live
site and the repo; findings below with evidence, the fix, who owns it, and what
"done" looks like. Update the status column as items land; one PR per item.

The generic version of this list is `docs/LAUNCH-CHECKLIST.md` — copy that into
any new project before it ships.

Status key: `TODO` · `IN PR #n` · `DONE yyyy-mm-dd` · `WONTFIX (reason)`

## Verified OK on launch day

| Check | Evidence |
|---|---|
| HTTPS + HSTS | `strict-transport-security: max-age=63072000` on every response |
| Apex → www redirect | `https://brandon.party/` → 308 → `https://www.brandon.party/` |
| Build serial | Bezel shows `SN 35d58c9`, resolved from `VERCEL_GIT_COMMIT_SHA` |
| Dependencies | `npm audit --omit=dev` → 0 vulnerabilities |
| Secrets in git history | No `.env*` (other than `.env.example`) and no key-shaped strings in the history of portfolio-site, meridian, steward, cellarkeep, stagepass |
| Repo hygiene | `.gitignore` covers `.env*`, keeps `.env.example` |
| Tests / lint / types | 67/67 vitest, eslint 0 errors, tsc clean at merge of PR #2 |
| Lighthouse desktop | 100/100/100/100 on `/`, `/about`, `/projects/meridian` |
| Dev-mode Strict Mode | Boot overlay fixed in PR #2; no other effect double-run bugs seen |

## Open items

### A. Security

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| A1 | Contact form has no abuse guard | IN PR #3 | `sendPing` server action validates email + length only; no honeypot, no timing check, no rate limit. Anyone can script it and burn the Resend quota (100/day free) or flood the inbox | Hidden honeypot input + minimum time-to-submit (render timestamp in a hidden field, reject < 2 s) + per-IP token bucket (in-memory is fine on Vercel; Upstash if it ever matters) | Claude | Scripted burst of 20 submissions yields ≤ 3 deliveries; honest submission still delivers; tests cover each guard |
| A2 | Security headers: only HSTS | IN PR #5 | `curl -sI https://www.brandon.party/` shows no CSP, X-Content-Type-Options, frame-ancestors, Referrer-Policy, Permissions-Policy | `headers()` in `next.config.ts`. CSP needs a hash (or nonce) for the inline theme-boot script in `layout.tsx`; start with `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a minimal Permissions-Policy, then add CSP in report-only first | Claude | All five headers present on `/`; site renders in all three themes with CSP enforced; no console CSP violations |
| A3 | Mail delivery unverified in production | TODO | Cannot tell from outside whether `RESEND_API_KEY` is set in Vercel. Without it the form returns `MAIL NOT CONFIGURED` | Submit one ping from the live form and confirm it lands. If not, set `RESEND_API_KEY` (Production scope) and optionally `CONTACT_TO` / `CONTACT_FROM` | Brandon | Test ping received in inbox with working reply-to |

### B. Verifiability (what a recruiter can actually check)

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| B1 | Project repos are all private | TODO | `gh repo list` → meridian, steward, cellarkeep, stagepass all PRIVATE | Decide which go public. History scan is clean, so the risk is only what's in the current tree: re-check each README for internal URLs and each repo for committed screenshots of private data before flipping | Brandon | Chosen repos public; README on each explains what it is and how to run it |
| B2 | Case studies have no outbound links | TODO | `grep -ohE 'https?://' content/projects/*.mdx` → nothing. No source link, no demo link | Add `repo` and optional `live` fields to `PROJECTS` in `src/lib/projects.ts`; render SOURCE ▸ / LIVE ▸ in the case-study meta strip; keyboard-nav friendly | Claude (after B1) | Every case study shows at least a SOURCE link; LIVE appears once the demo deploys exist |
| B3 | No screenshots on case studies | TODO | Carried over from `docs/PLAN.md` | Blocked on demo deploys (meridian fly, steward hosting, cellarkeep demo instance, stagepass testnet) | Both | Each case study has one real screenshot and the LIVE flag |

### C. Discoverability

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| C1 | No Open Graph image / metadataBase / canonical | IN PR #4 | Live `<head>` has title + description only; `/opengraph-image` → 404 | `metadataBase: new URL('https://www.brandon.party')`, `alternates.canonical`, `openGraph` + `twitter` blocks in `layout.tsx`; `src/app/opengraph-image.tsx` rendering the bezel + name in phosphor green | Claude | Pasting the URL into LinkedIn/Slack/iMessage shows a card with image and title |
| C2 | No robots.txt | IN PR #4 | `/robots.txt` → 404 | `src/app/robots.ts` allowing all, pointing at the sitemap | Claude | 200 with `Sitemap:` line |
| C3 | No sitemap | IN PR #4 | `/sitemap.xml` → 404 | `src/app/sitemap.ts` listing `/`, `/about`, `/contact`, four case studies | Claude | 200, valid XML, all seven routes |

### D. Content only Brandon can supply

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| D1 | Resume is the placeholder | TODO | Live `/resume.pdf` is 398 bytes, one blank page | Drop the real PDF at `public/resume.pdf` | Brandon | Live PDF opens to the real resume |
| D2 | LinkedIn slug is a guess | TODO | `linkedin.com/in/brandon-smith` on home footer and About spec sheet; never confirmed | Confirm or replace in `src/app/page.tsx` and `src/app/about/page.tsx` | Brandon | Link resolves to the right profile |
| D3 | About location row is a placeholder | TODO | `['Location', 'Remote-friendly']` in `src/app/about/page.tsx` | Add city, or keep "Remote-friendly" deliberately | Brandon | Decision recorded here |

### E. Engineering hygiene

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| E1 | No CI | TODO | No `.github/workflows`; branch protection unavailable on a private free repo | One workflow on `pull_request` + `push` to main: `npm ci`, `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` | Claude | Green check on the next PR |
| E2 | Two stale eslint-disable directives | TODO | `ThemeDial.tsx:13`, `UptimeGauge.tsx:10` warn "unused eslint-disable" | Delete the two comments | Claude | `eslint` → 0 warnings |
| E3 | No error visibility in production | TODO | Server-action failures only `console.error`; nobody reads Vercel logs | Enable Vercel log drain or at least check Runtime Logs after A3; optional Sentry later | Brandon | Decision recorded |

### F. Post-launch nice-to-haves (from `docs/PLAN.md`)

LED ticker, type-in hero, oscilloscope, easter eggs. Not before A–E.

## Suggested order

A1 → C1+C2+C3 (one PR) → A2 → E1+E2 (one PR) → B2 (once B1 is decided). D1–D3 and A3 whenever Brandon has them; they're each a five-minute change.

## Log

- 2026-09-03 — Site live; PR #1 (design pass + deploy prep) and PR #2 (in-glass scrolling, Strict Mode boot fix) merged. Audit run; this file created.
