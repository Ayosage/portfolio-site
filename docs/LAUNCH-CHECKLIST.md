# Launch checklist

Copy this file into `docs/` of any project before it ships. Work through it
once before the first public deploy and again whenever the deploy surface
changes (new domain, new form, new env var, repo goes public). Tick items,
record evidence inline, turn anything unresolved into a row in the project's
backlog or a `POST-LAUNCH.md` like the portfolio's.

Canonical copy lives in `portfolio-site/docs/LAUNCH-CHECKLIST.md`. If you
improve this file, improve that one too.

Most checks have a one-line verification. Run them against the live URL, not
localhost.

---

## 1. Secrets and repo hygiene

- [ ] No env file has ever been committed (keep only `.env.example`)
  `git log --all --diff-filter=A --name-only --pretty=format: | grep -iE '(^|/)\.env($|\.)' | grep -v example`
- [ ] No key-shaped strings anywhere in history
  `git log --all -p | grep -oE '(sk_live|sk_test|re_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|xox[bp]-|0x[a-fA-F0-9]{64})' | sort -u`
- [ ] `.gitignore` covers `.env*`, build output, local DB files, `.vercel/`, `.superpowers/`
- [ ] `.env.example` lists every variable the app reads, with a comment per line
- [ ] Every env var is set in the host, in the right scope (Production vs Preview), and the app fails loudly when a required one is missing
- [ ] If the repo is going public: current tree has no internal URLs, private screenshots, real user data, or seed data with real names

## 2. Transport and headers

- [ ] HTTPS everywhere; HTTP redirects to HTTPS
- [ ] HSTS present
- [ ] Apex and `www` both resolve; one redirects to the other (pick one, use it in canonical + metadataBase)
- [ ] Security headers present: `Content-Security-Policy` (start report-only), `X-Content-Type-Options: nosniff`, `frame-ancestors` / `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
  `curl -sIL https://<host>/ | grep -iE 'strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy'`
- [ ] Inline scripts (theme boot, analytics) have a CSP hash or nonce
- [ ] No `x-powered-by` or server-version leakage worth caring about

## 3. Public write surfaces (forms, actions, webhooks, sockets)

For every endpoint an anonymous visitor can hit:

- [ ] Input validated server-side (length caps, shape, allow-list)
- [ ] Honeypot field + minimum time-to-submit on any public form
- [ ] Rate limit per IP or per session, and a global cap that protects paid quotas (email, SMS, LLM, RPC)
- [ ] Failure path is visible to you (log, alert) and honest to the user (no silent drops)
- [ ] Webhooks verify signatures; sockets validate every message with a schema
- [ ] Anything that spends money (mail, chain tx, API credits) has a hard ceiling

## 4. Auth and data (skip for static sites)

- [ ] Session cookies `HttpOnly`, `Secure`, `SameSite`; sessions expire
- [ ] Authorization checked on every server action / route, not just in the UI
- [ ] Database: TLS on, least-privilege role, automated backups, restore tested once
- [ ] Migrations run as part of deploy and are idempotent
- [ ] Multi-tenant boundaries (household, guild, org) enforced in queries, with a test that proves cross-tenant reads fail
- [ ] PII inventory: what you store, why, how a user gets it deleted

## 5. Dependencies and build

- [ ] `npm audit --omit=dev` (or equivalent) → 0 high/critical
- [ ] Lockfile committed; CI uses `npm ci`
- [ ] Build hash / version visible somewhere (footer, `/healthz`, bezel serial) so you can tell what's deployed
- [ ] Node / runtime version pinned (`engines`, `.nvmrc`, or host setting)

## 6. Quality gates

- [ ] CI runs tests, lint, typecheck, and a production build on every PR
- [ ] Tests green on the merge commit that is deployed
- [ ] Lint 0 errors and 0 warnings (stale `eslint-disable` comments count)
- [ ] `npm run dev` (React Strict Mode) works, not just the production build — effects that double-run must survive it
- [ ] Lighthouse on the three most important routes, desktop and mobile, meets the project's bar
- [ ] Checked by hand at a desktop width, a phone width, and a short desktop window; keyboard-only pass; each theme if there are themes
- [ ] 404 and error pages exist and match the design

## 7. Discoverability and sharing

- [ ] `<title>` template and description per route
- [ ] `metadataBase` + canonical URL set to the chosen host
- [ ] Open Graph + Twitter card with an image; paste the URL into Slack or iMessage and confirm the card
- [ ] `robots.txt` (allow all, or deliberately block previews / staging)
- [ ] `sitemap.xml` listing every public route
- [ ] Favicon and apple-touch icon; `manifest` if it's an app

## 8. Verifiability (portfolio-facing projects)

- [ ] Repo visibility decided; if public, README says what it is, how to run it, and links back to the case study
- [ ] The case study links to SOURCE and, once deployed, LIVE
- [ ] At least one real screenshot or short clip
- [ ] Demo works with no account, or a demo account exists and is documented
- [ ] Claims in the write-up match what's merged (no "in progress" that's actually done, and vice versa)

## 9. Placeholder sweep

- [ ] Grep for `TODO`, `TBD`, `lorem`, `placeholder`, `example.com`, `changeme`, `localhost` in shipped code and content
- [ ] Every outbound link clicked once from the live site (resume, LinkedIn, GitHub, mailto)
- [ ] Downloadable files are the real ones (check byte size, not just status 200)
- [ ] Contact details, location, availability, and dates are current

## 10. Operations

- [ ] You know where production logs are and have opened them once
- [ ] Health endpoint or equivalent for anything with a server
- [ ] Uptime or error alerting for anything you'd want to know broke (optional for a static site)
- [ ] Rollback path known: previous deploy promotable, or `git revert` + redeploy in under ten minutes
- [ ] Costs bounded: free-tier limits written down, and what happens when they're hit

## 11. Record it

- [ ] Launch date, host, live URL, and canonical host written in the project's docs
- [ ] Unresolved items moved to the backlog with owner and "done when"
- [ ] Project memory / notes updated so the next session starts from the truth
