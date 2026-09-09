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
| A1 | Contact form has no abuse guard | DONE 2026-09-03 | `sendPing` server action validates email + length only; no honeypot, no timing check, no rate limit. Anyone can script it and burn the Resend quota (100/day free) or flood the inbox | Hidden honeypot input + minimum time-to-submit (render timestamp in a hidden field, reject < 2 s) + per-IP token bucket (in-memory is fine on Vercel; Upstash if it ever matters) | Claude | Scripted burst of 20 submissions yields ≤ 3 deliveries; honest submission still delivers; tests cover each guard |
| A2 | Security headers: only HSTS | DONE 2026-09-03 | `curl -sI https://www.brandon.party/` shows no CSP, X-Content-Type-Options, frame-ancestors, Referrer-Policy, Permissions-Policy | `headers()` in `next.config.ts`. CSP needs a hash (or nonce) for the inline theme-boot script in `layout.tsx`; start with `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a minimal Permissions-Policy, then add CSP in report-only first | Claude | All five headers present on `/`; site renders in all three themes with CSP enforced; no console CSP violations |
| A3 | Mail delivery unverified in production | DONE 2026-09-08 | Cannot tell from outside whether `RESEND_API_KEY` is set in Vercel. Without it the form returns `MAIL NOT CONFIGURED` | Submit one ping from the live form and confirm it lands. If not, set `RESEND_API_KEY` (Production scope) and optionally `CONTACT_TO` / `CONTACT_FROM` | Brandon | Test ping received in inbox with working reply-to. Done via Vercel CLI: `RESEND_API_KEY`, `CONTACT_FROM=BS-01 <ping@brandons.sh>` (Resend-verified domain), `CONTACT_TO` set in Production; redeployed; Brandon received the test ping |

### B. Verifiability (what a recruiter can actually check)

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| B1 | Project repos are all private | TODO | `gh repo list` → meridian, steward, cellarkeep, stagepass all PRIVATE | Decide which go public. History scan is clean, so the risk is only what's in the current tree: re-check each README for internal URLs and each repo for committed screenshots of private data before flipping | Brandon | Chosen repos public; README on each explains what it is and how to run it |
| B2 | Case studies have no outbound links | TODO | `grep -ohE 'https?://' content/projects/*.mdx` → nothing. No source link, no demo link | Add `repo` and optional `live` fields to `PROJECTS` in `src/lib/projects.ts`; render SOURCE ▸ / LIVE ▸ in the case-study meta strip; keyboard-nav friendly | Claude (after B1) | Every case study shows at least a SOURCE link; LIVE appears once the demo deploys exist |
| B3 | No screenshots on case studies | TODO | Carried over from `docs/PLAN.md` | Blocked on demo deploys (meridian fly, steward hosting, cellarkeep demo instance, stagepass testnet) | Both | Each case study has one real screenshot and the LIVE flag |

### C. Discoverability

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| C1 | No Open Graph image / metadataBase / canonical | DONE 2026-09-03 | Live `<head>` has title + description only; `/opengraph-image` → 404 | `metadataBase: new URL('https://www.brandon.party')`, `alternates.canonical`, `openGraph` + `twitter` blocks in `layout.tsx`; `src/app/opengraph-image.tsx` rendering the bezel + name in phosphor green | Claude | Pasting the URL into LinkedIn/Slack/iMessage shows a card with image and title |
| C2 | No robots.txt | DONE 2026-09-03 | `/robots.txt` → 404 | `src/app/robots.ts` allowing all, pointing at the sitemap | Claude | 200 with `Sitemap:` line |
| C3 | No sitemap | DONE 2026-09-03 | `/sitemap.xml` → 404 | `src/app/sitemap.ts` listing `/`, `/about`, `/contact`, four case studies | Claude | 200, valid XML, all seven routes |

### D. Content only Brandon can supply

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| D1 | Resume is the placeholder | TODO | Live `/resume.pdf` is 398 bytes, one blank page | Drop the real PDF at `public/resume.pdf` | Brandon | Live PDF opens to the real resume |
| D2 | LinkedIn slug is a guess | TODO | `linkedin.com/in/brandon-smith` on home footer and About spec sheet; never confirmed | Confirm or replace in `src/app/page.tsx` and `src/app/about/page.tsx` | Brandon | Link resolves to the right profile |
| D3 | About location row is a placeholder | TODO | `['Location', 'Remote-friendly']` in `src/app/about/page.tsx` | Add city, or keep "Remote-friendly" deliberately | Brandon | Decision recorded here |

### E. Engineering hygiene

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| E1 | No CI | DONE 2026-09-03 | No `.github/workflows`; branch protection unavailable on a private free repo | One workflow on `pull_request` + `push` to main: `npm ci`, `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` | Claude | Green check on the next PR |
| E2 | Two stale eslint-disable directives | DONE 2026-09-03 | `ThemeDial.tsx:13`, `UptimeGauge.tsx:10` warn "unused eslint-disable" | Delete the two comments | Claude | `eslint` → 0 warnings |
| E3 | No error visibility in production | TODO | Server-action failures only `console.error`; nobody reads Vercel logs | Enable Vercel log drain or at least check Runtime Logs after A3; optional Sentry later | Brandon | Decision recorded |

### F. Post-launch nice-to-haves (from `docs/PLAN.md`)

LED ticker, type-in hero, oscilloscope, easter eggs. Not before A–E.

### G. Chassis and "you are holding the rig" ideas — for discussion

Raised 2026-09-03 after looking at the live site on a 1920-wide desktop. None of
these are scheduled; they are here so the discussion has a home. Framing
comparison (four monitors at true scale, metal corner detail):
https://claude.ai/code/artifact/706d7739-c4ad-4689-aaa2-910d499ecf60

| # | Idea | Status | Notes | Open questions |
|---|---|---|---|---|
| G1 | Rig as an object on a lit bench | PROPOSED | Keep the 1024 px rig. Page behind it becomes a darker bench with a radial light pool so the empty sides read as deliberate. Rig gets a chamfered edge, drop shadow, corner rivets. Brandon prefers this framing over "rig fills the monitor" and "wider rig" | Lit bench is a gradient; spec currently allows gradients only for CRT effects. Amend the spec to allow lighting, or use a flat darker bench? |
| G2 | Metal chassis instead of moulded plastic | PROPOSED | Brandon's call: the chassis should read as powder-coated metal. Brushed directional grain, domed rivets, paint worn to bare metal at corners and grab edges, one faint rust bloom under one rivet as the only oxidation. Spec's "molded plastic" line and the small-radius rule need updating | Keep the small radii (moulded look) or go sharper for stamped metal? |
| G3 | Fill the right column, not the bench | PROPOSED | Below the four gauge wells the chassis is bare down to the F-keys. Candidates: SCOPE trace (already in F), a BRIGHTNESS dial wired to phosphor glow, a speaker grille as texture at the bottom. Nothing goes on the bench: props pull the eye off the screen | Functional or decorative for the first pass? Recommendation: BRIGHTNESS live, SCOPE static until F, grille texture only |
| G4 | Compass gauge that always points north | IDEA | A needle gauge in the column. Desktop: points to true north as drawn. Mobile: read the device heading (`DeviceOrientationEvent`, `webkitCompassHeading` on iOS) and rotate the needle against the phone so it keeps pointing north as the user turns. iOS needs a user-gesture permission prompt (`DeviceOrientationEvent.requestPermission`); Android needs HTTPS (we have it). No heading available: needle drifts idle and the gauge reads NO FIX | Where does the permission prompt live so it doesn't feel like a tracking request? Probably a tap on the gauge itself, labelled CALIBRATE |
| G5 | Weather gauge from location | IDEA | Ask for coarse location, pull current conditions from a free API (Open-Meteo needs no key), show temp / conditions / wind as a gauge. Makes SOLAR real too: cloud cover could drive the SOLAR meter instead of the current placeholder | Location is a bigger ask than heading; must degrade gracefully and never block. Do we want an outbound fetch in CSP `connect-src` for one API host? Cache result per session |
| G6 | The theme: things that make people feel they are operating the rig | IDEA | G4 and G5 are the first two. Same family: tilt the phone and the sprouts lean (`DeviceMotion`), ambient-light sensor dims the phosphor, battery level drives an on-chassis cell gauge (`navigator.getBattery`, Chromium only). Each must be optional, permission-gated, and the rig must look complete without it | Pick one that works on iOS Safari first; that is the phone most recruiters open the link on |

### H. UI/UX review 2026-09-05

Walked /, /about, /contact, /projects/meridian and /projects/misc at 1280 and
390 px on the `misc-bay` build, checked against the ui-ux-pro-max guideline set
and Emil Kowalski's design-engineering review. Passing: h1 on every page, no
horizontal scroll, inputs wrapped in labels, reduced motion honoured wherever
motion exists, boot skippable and once per session. Targets measured on the
live build with `getBoundingClientRect`.

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| H1 | Hardware switches are 15 px tall | IN PR #10 | SCANLINES / SOUND / KEYS buttons measure 91×15, 63×15, 56×15 at both widths; minimum is 44×44 | Keep the pill visual, give the `<button>` a 44 px hit area (padding or `::before` inset) | Claude | Every switch ≥ 44 px in both axes |
| H2 | Mobile F-keys under the minimum | IN PR #10 | 90×41 at 390 px (33 px tall on desktop, where pointer precision makes it acceptable) — this is the primary nav | `py-3` on mobile in `FKeyRow` | Claude | ≥ 44 px tall at 390 px, Lighthouse a11y still 100 |
| H3 | PORT-A/B/C links 29 px tall | IN PR #10 | Home footer + About spec sheet | `py-2` and `inline-flex items-center min-h-11` | Claude | ≥ 44 px |
| H4 | Focus invisible on the chassis | IN PR #10 | Zero `focus-visible` rules in Cartridge, FKeyRow, HardwareSwitch, ThemeDial, BrightnessKnob, ContactForm; only the MISC page links have one | One global rule in `globals.css`: `:focus-visible { outline: 2px solid var(--phosphor); outline-offset: 2px }`, remove per-component one-offs | Claude | Tabbing through / shows focus on every control |
| H5 | "[ESC] BACK" is a span, not a control | IN PR #10 | `projects/[slug]/page.tsx:54`, `projects/misc/page.tsx:34`. Phones have no Escape; mouse users can't click it | Make it a `<button>` that calls the same `router.back()` as `EscBack`; keep the label | Claude | Tap/click returns to the bay on mobile and desktop |
| H6 | Type below the 10 px floor | IN PR #10 | `text-[8px]` on knob LO/HI, `text-[9px]` on cartridge tags, theme-dial labels, chassis footer. 31–48 sub-12 px text nodes per page overall (accepted trade for the hardware look) | Raise the four 8/9 px spots to 10 px; leave the 10 px chrome | Claude | No `text-[8px]`/`text-[9px]` in src |
| H7 | STATUS wraps on mobile | IN PR #10 | "OPEN TO WORK" breaks to two lines in the 390 px gauge well | `whitespace-nowrap` + shorter mobile label, or drop the dot at 390 | Claude | Single line at 390 |
| H8 | Contact inputs have no focus/filled state | IN PR #10 | `border-[var(--hairline)]` only; browser outline likely suppressed | Covered by H4 ring; add `focus:border-[var(--phosphor-dim)]` | Claude | Visible focus on both fields |
| H9 | Cartridge spin-up costs 500 ms and is a text swap | IN PR | `Cartridge.tsx` `setTimeout(router.push, 500)`; "▸ SPIN-UP…" replaces the one-liner, nothing moves | Navigate at 250 ms; `translateY(1px)` + phosphor border pulse during the wait; reduced-motion path unchanged | Claude | Click-to-route ≤ 250 ms, motion visible |
| H10 | Boot overlay vanishes in one frame | IN PR | `BootOverlay` unmounts at 1200 ms with no transition | `opacity 150ms ease-out` exit; keep instant dismiss on key/pointer | Claude | Fade visible, skip still instant |
| H11 | Garden sprouts pop in fully drawn | IN PR | `ScreenGarden` paths appear on stage change | Draw new paths with `stroke-dashoffset` over 600 ms ease-out (rare, first-time moment — longer is allowed) | Claude | New sprout visibly grows |
| H12 | Hardware switch knob `transition-none` | IN PR | `HardwareSwitch.tsx:51` | `transition: transform 120ms ease-out` on the knob translate | Claude | Toggle slides |
| H13 | No hover on cartridges / F-keys | IN PR | Only `hover:underline` on text links | `transition: border-color 120ms ease` to a brighter phosphor border, gated by `@media (hover: hover) and (pointer: fine)` | Claude | Hover visible on desktop, inert on touch |
| H14 | F-key release snaps back | IN PR | `active:translate-y-[2px]` with no transition | Keep instant press; `transition: transform 100ms ease-out` for release | Claude | Press instant, release eased |
| H15 | Theme dial swaps every colour instantly | WONTFIX (hardware switch; transitioning phosphor site-wide is expensive) | — | — | — | — |

Order: H1–H8 in one PR (accessibility + targets, ~an hour, Lighthouse stays
100). H9–H14 in a second, smaller motion PR, H9 first since it is the only
row that costs the visitor time. Resume placeholder is D1.

### I. Dos-and-don'ts audit 2026-09-08

Audited local `main` (at the time 7 commits ahead of `origin/main`; PRs #10/#11
were merged and deployed later the same day) and the live site against `webdev/docs/claude/DOS-AND-DONTS.md`, using
Impeccable's context loader and mechanical detector (zero findings) and Emil
Kowalski's motion review. Live host is now `www.brandons.sh`; `brandon.party`
and `www.brandon.party` 307/308 to it. Not run: Lighthouse, fresh contrast
measurement. Brief-earned exceptions kept on purpose, not logged as items:
monospace everywhere, the lit-bench radial gradient (G1), chassis grain /
brushed stripes / grille dots, phosphor and LED glow, case-study section
numbers (they drive the garden), same-size cartridges, 10–11 px chrome text
(H6).

| # | Item | Status | Evidence | Fix | Owner | Done when |
|---|---|---|---|---|---|---|
| I1 | Canonical host still `www.brandon.party` | TODO | `SITE_URL` in `src/lib/site.ts`; live `<link rel=canonical>`, every `og:url` / `og:image`, all 8 sitemap `<loc>`s and the robots `Sitemap:` line point at a host that redirects to `www.brandons.sh` | Change `SITE_URL` to `https://www.brandons.sh`; update this file's header and the memory note; redeploy | Claude | `curl -s https://www.brandons.sh/ \| grep canonical` shows brandons.sh; sitemap and robots agree; share card fetches the image without a redirect |
| I2 | 404 is the stock Next.js page | TODO | No `src/app/not-found.tsx`; live `/nope-404` renders white background + system font inside the CRT screen | `not-found.tsx` in the terminal voice (`~/404`, NO SUCH FILE, ESC BACK), same `pageMetadata` shape, `noindex` kept | Claude | 404 renders inside the glass in all three themes |
| I3 | H1–H14 merged locally, never pushed | DONE 2026-09-08 (PRs #10/#11 merged on the dashboard; Vercel auto-deployed; live serial 993e727) | `git log origin/main..main` → 7 commits; live CSS has none of `cartridge-spin`, `garden-draw`, `boot-overlay-exit`, `switch-thumb`; live F-keys still `py-2.5` | `git push origin main` after I1 lands (one deploy) | Brandon | Live serial matches local HEAD; switches ≥ 44 px on live |
| I4 | `access-control-allow-origin: *` on every HTML route | TODO | Present on `/`, `/about`, `/contact`; not set in `src/lib/headers.ts` | Find the source (Vercel project headers or `vercel.json` history) and remove it; no route needs cross-origin reads | Claude | Header absent on `/` and `/contact` |
| I5 | Keyword easings everywhere | TODO | `globals.css`: knob, switch-thumb, fkey, cartridge, boot-overlay, garden-draw all use `ease-out` / `ease` | `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` token in `:root`; swap every transition/animation to it | Claude | `grep -E 'ease-out;\|ease;' globals.css` → 0 outside the token definition |
| I6 | No press feedback on cartridges, submit button, hardware switches | TODO | Only `.fkey` has `active:translate-y`; `Cartridge.tsx`, `ContactForm.tsx` button, `HardwareSwitch.tsx` have no `:active` | `active:translate-y-[1px]` (hardware idiom, not scale) with the same 100 ms release transition as F-keys; reduced-motion keeps the instant press | Claude | Every pressable moves on press in the browser |
| I7 | `tracking-tighter` (-0.05em) on every h1 | TODO | `page.tsx`, `about/page.tsx`, `ContactForm.tsx`, `projects/[slug]/page.tsx`, `projects/misc/page.tsx`; floor is -0.04em | `tracking-[-0.03em]` on all five | Claude | `grep tracking-tighter src` → 0 |
| I8 | Home h1 scales to 7rem | TODO | `text-[clamp(3rem,14vw,7rem)]` in `page.tsx`; display cap is 6rem | `clamp(3rem,14vw,6rem)`; check the two-line name still fits at 1024 px | Claude | Computed size ≤ 96 px at 1280 |
| I9 | Body measure under the 65ch floor | TODO | `max-w-[52ch]` home, `max-w-[60ch]` about and misc | Decide: raise to 65ch, or record 60ch as the terminal's deliberate line length in DESIGN.md (I13) | Brandon | Either the classes change or DESIGN.md says why not |
| I10 | Headings not balanced | TODO | No `text-balance` in src | `text-balance` on every h1 and `SectionHeading` | Claude | Class present on each heading |
| I11 | Selection, caret, numerals unthemed | TODO | No `::selection`, `caret-color`, or `tabular-nums` in src; gauges and spec sheet show numbers | `::selection { background: var(--phosphor); color: var(--screen) }`, `caret-color: var(--phosphor)` on inputs, `tabular-nums` on SOLAR, UPTIME, spec sheet | Claude | Selecting text on the screen reads phosphor-on-glass in all three themes |
| I12 | 32 em dashes in UI strings | TODO | Title template `%s — Brandon Smith` (`site.ts`), `SectionHeading` (`01 — TITLE`), cartridge `EJECTED —`, three error strings in `actions.ts`, home tagline, about copy, OG alt. MDX is clean | Replace with the site's own separators: `▪` in titles and section headings, `:` or `.` in prose and errors | Claude | `grep -rn '—' src` → 0 |
| I13 | No DESIGN.md / PRODUCT.md | TODO | Impeccable context loader: `NO_PRODUCT_MD`; fonts (JetBrains Mono + system sans prose) and palette live only in code | `/impeccable init` with Brandon (product truth), then `/impeccable document` to generate DESIGN.md from the code | Both | Both files exist and the loader reports no gap |
| I14 | No privacy policy page | TODO | Contact form collects email; no `/privacy` route | `src/app/privacy/page.tsx` in the terminal voice: what is collected (email, message, IP for rate limiting), retention, contact for deletion; link from the contact page and About PORTS | Claude | Route live, linked, indexed |
| I15 | No terms page | TODO | No `/terms` route; the list says always | Decide whether a portfolio with one form needs it. If yes, a short `/terms`; if no, record WONTFIX here | Brandon | Decision recorded |
| I16 | No analytics | TODO | No analytics dependency or script; CSP `connect-src 'self'` | `@vercel/analytics` (same-origin `/_vercel/insights`, works under the current CSP), no cookie banner needed | Claude | One real pageview visible in the Vercel dashboard |
| I17 | Scaffold SVGs still in `public/` | TODO | `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Delete all five | Claude | `ls public` → `favicon`, `resume.pdf` only |
| I18 | Resume, LinkedIn slug, location placeholders | TODO | Same as D1–D3; re-confirmed 2026-09-08 (`resume.pdf` still 398 bytes) | See D1–D3 | Brandon | D1–D3 closed |

Order: I1 first (one-line). I5–I8, I10–I12
and I17 are one "craft" PR. I2, I14, I16 are one "pages" PR. I4 is a Vercel
dashboard check. I9, I13, I15, I18 need Brandon.

## Suggested order

A1 → C1+C2+C3 (one PR) → A2 → E1+E2 (one PR) → B2 (once B1 is decided). D1–D3 and A3 whenever Brandon has them; they're each a five-minute change.

2026-09-08: I1 → craft PR (I5–I8, I10–I12, I17) → pages PR (I2, I14, I16) → I4. Brandon: I9, I13, I15, I18.

## Log

- 2026-09-03 — Site live; PR #1 (design pass + deploy prep) and PR #2 (in-glass scrolling, Strict Mode boot fix) merged. Audit run; this file created.
- 2026-09-03 — PRs #3–#6 merged (form guard, SEO, security headers, CI). Timing-guard bypass caught in review and fixed before merge. Section G added.
- 2026-09-08 — Vercel CLI installed and linked (project `bdondev`). Production had zero env vars; set Resend key, sender and recipient; redeployed; test ping received. A3 DONE. Cloudflare Email Routing + DMARC management enabled on brandons.sh.
- 2026-09-08 — Dos-and-don'ts audit against `webdev/docs/claude/DOS-AND-DONTS.md`. Section I added (18 items). Found the canonical-host drift to `www.brandons.sh` and that H1–H14 were never pushed.
