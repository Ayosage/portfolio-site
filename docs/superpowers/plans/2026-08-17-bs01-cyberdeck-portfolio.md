# BS-01 Cyberdeck Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Brandon's portfolio as the "BS-01 Field Terminal" — a solarpunk cyberdeck UI (CRT phosphor screen in a hardware chassis) over a static-first Next.js site.

**Architecture:** Next.js App Router renders all content server-side as ordinary routes; the cyberdeck (chassis, gauges, keys, boot overlay) is a presentation layer of CSS + small client components wrapped around the `children` slot in the root layout. Theme = a `data-theme` attribute on `<html>` driving CSS custom properties; all interactivity is vanilla React state + a few KB of logic in `src/lib`.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind v4, @next/mdx for case studies, JetBrains Mono via `next/font`, Vitest + Testing Library for tests. No WebGL, no canvas, no animation libraries, no audio files (key clicks are WebAudio oscillator blips).

**Spec:** `docs/superpowers/specs/2026-08-17-cyberdeck-design-direction-design.md`

## Global Constraints

- Lighthouse ≥ 95 (performance/accessibility/SEO) on `/` and `/projects/stagepass` — acceptance criterion.
- WCAG AA 4.5:1 for every text/ground pair in all three themes (GREEN, AMBER, PAPER).
- Themes: GREEN default (dark systems), PAPER default when `prefers-color-scheme: light`; dial override persisted in `localStorage` key `bs01-theme`.
- All animated effects (boot, flicker, insert spin-up, garden growth) obey `prefers-reduced-motion`; static scanlines do not.
- Sound OFF by default; never autoplay; toggle persisted in `localStorage` key `bs01-sound`.
- Zero `border-radius` on screen content; small radii allowed on chassis hardware only.
- No gradients except CRT glow/vignette effects.
- Mono = JetBrains Mono (subset via `next/font`); long-form body copy = system sans stack.
- All content server-rendered; chrome must not gate content (real links, real routes, crawlable).
- Case studies for Meridian/Steward/CellarKeep are **blocked on content** — build the template + StagePass placeholder only.
- Post-launch garnish (LED ticker, type-in hero, oscilloscope, easter eggs) is OUT of this plan.
- Commit convention: end commit messages with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## File Structure

```
src/
  app/
    layout.tsx              # root layout: fonts, theme script, Chassis wrapper
    globals.css             # theme tokens, CRT treatment, chassis styles
    page.tsx                # home: hero + disk bay + ports footer
    about/page.tsx
    contact/page.tsx
    contact/actions.ts      # server action: validate + log ping
    projects/[slug]/page.tsx
  components/
    chassis/Chassis.tsx     # full rig: bezel + screen grid + gauge cluster + F-keys
    chassis/TopBezel.tsx    # model label, serial, switches, power LED
    chassis/FKeyRow.tsx     # F1–F4 nav keys (real links)
    chassis/useKeyboardNav.ts
    chassis/HardwareSwitch.tsx
    screen/Screen.tsx       # CRT screen module (scanlines, vignette)
    screen/BootOverlay.tsx
    gauges/GaugeCluster.tsx
    gauges/SolarMeter.tsx
    gauges/UptimeGauge.tsx
    gauges/ThemeDial.tsx
    gauges/PixelGarden.tsx
    diskbay/DiskBay.tsx
    diskbay/Cartridge.tsx
    case-study/CaseStudyMeta.tsx
    case-study/SectionHeading.tsx
    case-study/EscBack.tsx
    case-study/GardenTracker.tsx
  lib/
    theme.ts                # Theme type, resolveTheme, applyTheme
    solar.ts                # solarPercent(date)
    build-info.ts           # BUILD_HASH, BUILD_TIME, uptimeDays
    projects.ts             # PROJECTS registry
    sound.ts                # soundEnabled, setSound, playClick
    garden.ts               # stage math + sessionStorage persistence
    contact.ts              # validatePing (pure, shared w/ server action)
content/
  projects/stagepass.mdx
tests/                      # mirrors src; vitest + jsdom
public/resume.pdf
```

---

### Task 1: Reconcile docs/PLAN.md with the cyberdeck direction

**Files:**
- Modify: `docs/PLAN.md`

**Interfaces:**
- Consumes: spec at `docs/superpowers/specs/2026-08-17-cyberdeck-design-direction-design.md`
- Produces: an up-to-date task ledger other sessions read; no code.

- [ ] **Step 1: Rewrite PLAN.md**

Replace the entire contents of `docs/PLAN.md` with:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/PLAN.md
git commit -m "docs: reconcile PLAN.md with BS-01 cyberdeck direction

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Scaffold Next.js + test toolchain

**Files:**
- Create: Next.js app at repo root (`src/`, `next.config.ts`, `tsconfig.json`, …), `vitest.config.ts`, `tests/setup.ts`, `tests/smoke.test.tsx`
- Modify: `README.md`, `package.json`

**Interfaces:**
- Produces: `npm run dev|build|test|lint` all working; import alias `@/*` → `src/*`. Every later task assumes this toolchain.

- [ ] **Step 1: Scaffold into the non-empty repo via temp dir**

```bash
cd /Users/brandonsmith/Desktop/webdev/portfolio-site
npx create-next-app@latest bs01-tmp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
# move everything up, preserving our README and docs/
rm bs01-tmp/README.md
mv bs01-tmp/.gitignore .gitignore-next
cat .gitignore-next >> .gitignore && rm .gitignore-next && sort -u .gitignore -o .gitignore
mv bs01-tmp/* bs01-tmp/.* . 2>/dev/null; rmdir bs01-tmp
npm run build
```

Expected: build succeeds.

- [ ] **Step 2: Install test toolchain**

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Add to `package.json` scripts: `"test": "vitest run", "test:watch": "vitest"`.

- [ ] **Step 3: Write smoke test and see it pass**

Create `tests/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

test('home page renders', () => {
  render(<Home />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})
```

If the scaffolded `src/app/page.tsx` has no `<main>`, replace its JSX with `<main>BS-01</main>` for now.

Run: `npm test` → PASS. Run `npm run lint` → clean.

- [ ] **Step 4: README deploy note**

Append to `README.md`:

```markdown
## Deploy

Vercel, static-first. Push to `main` → production. Preview deploys on PRs.
`npm run build` must pass and Lighthouse ≥95 (see docs/PLAN.md) before merge.
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app with Vitest toolchain

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Theme system (tokens + resolution, FOUC-free)

**Files:**
- Create: `src/lib/theme.ts`, `tests/lib/theme.test.ts`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Produces: `type Theme = 'green' | 'amber' | 'paper'`; `THEMES: readonly Theme[]`; `resolveTheme(stored: string | null, prefersLight: boolean): Theme`; `applyTheme(t: Theme): void` (sets `document.documentElement.dataset.theme` and `localStorage['bs01-theme']`). CSS custom properties: `--screen`, `--phosphor`, `--phosphor-dim`, `--hairline`, `--chassis`, `--chassis-well`, `--keycap`, `--alert`, `--alert-text`, `--glow`, `--font-mono`. Class `.crt-screen`.

- [ ] **Step 1: Write failing tests**

Create `tests/lib/theme.test.ts`:

```ts
import { resolveTheme, applyTheme, THEMES } from '@/lib/theme'

test('stored valid theme wins', () => {
  expect(resolveTheme('amber', true)).toBe('amber')
})
test('no stored + prefers light → paper', () => {
  expect(resolveTheme(null, true)).toBe('paper')
})
test('no stored + prefers dark → green', () => {
  expect(resolveTheme(null, false)).toBe('green')
})
test('garbage stored value falls back to system', () => {
  expect(resolveTheme('neon', false)).toBe('green')
})
test('applyTheme sets dataset and persists', () => {
  applyTheme('amber')
  expect(document.documentElement.dataset.theme).toBe('amber')
  expect(localStorage.getItem('bs01-theme')).toBe('amber')
})
test('three themes exist', () => {
  expect(THEMES).toEqual(['green', 'amber', 'paper'])
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL (module not found).

- [ ] **Step 3: Implement `src/lib/theme.ts`**

```ts
export const THEMES = ['green', 'amber', 'paper'] as const
export type Theme = (typeof THEMES)[number]

export function resolveTheme(stored: string | null, prefersLight: boolean): Theme {
  if (stored && (THEMES as readonly string[]).includes(stored)) return stored as Theme
  return prefersLight ? 'paper' : 'green'
}

export function applyTheme(t: Theme): void {
  document.documentElement.dataset.theme = t
  try {
    localStorage.setItem('bs01-theme', t)
  } catch {
    /* private mode: theme still applies for this page view */
  }
}
```

Run: `npm test` → PASS.

- [ ] **Step 4: Tokens + CRT treatment in `src/app/globals.css`**

Replace the file with:

```css
@import 'tailwindcss';

:root,
[data-theme='green'] {
  --screen: #0d110b;
  --phosphor: #d8f26e;
  --phosphor-dim: #8fa05c;
  --hairline: #3a4a2a;
  --chassis: #23261d;
  --chassis-well: #1b1e15;
  --keycap: #2e3226;
  --alert: #7a3020;
  --alert-text: #f0d8c8;
  --glow: rgba(216, 242, 110, 0.4);
}
[data-theme='amber'] {
  --screen: #120e08;
  --phosphor: #ffb454;
  --phosphor-dim: #b37e3b;
  --hairline: #4a3a22;
  --glow: rgba(255, 180, 84, 0.4);
}
[data-theme='paper'] {
  --screen: #f2edde;
  --phosphor: #1a1a14;
  --phosphor-dim: #5a6050;
  --hairline: #b8b29e;
  --chassis: #d9d2be;
  --chassis-well: #cfc7b0;
  --keycap: #e5dfc9;
  --alert: #c24a28;
  --alert-text: #f2edde;
  --glow: transparent;
}

body {
  background: var(--chassis);
  color: var(--phosphor);
  font-family: var(--font-mono), monospace;
}

.prose-body {
  font-family:
    ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
}

.crt-screen {
  position: relative;
  background: var(--screen);
  border: 3px solid var(--chassis-well);
  box-shadow: inset 0 0 26px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}
.crt-screen::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    color-mix(in srgb, var(--phosphor) 4%, transparent) 0 1px,
    transparent 1px 3px
  );
}
[data-scanlines='off'] .crt-screen::after,
[data-theme='paper'] .crt-screen::after {
  display: none;
}

.phosphor-glow {
  text-shadow: 0 0 14px var(--glow);
}
```

- [ ] **Step 5: FOUC-free theme boot + font in `src/app/layout.tsx`**

Replace the file with:

```tsx
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Brandon Smith — BS-01 Field Terminal',
  description:
    'Full-stack engineer. Payments, infra, web3 — the hard parts stay invisible.',
}

// Static hardcoded string — no user input ever flows into this
// dangerouslySetInnerHTML; it exists solely to set data-theme pre-paint.
const themeBoot = `(function(){try{var t=localStorage.getItem('bs01-theme');var v=['green','amber','paper'];if(v.indexOf(t)<0){t=matchMedia('(prefers-color-scheme: light)').matches?'paper':'green'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='green'}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mono.variable}>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        {children}
      </body>
    </html>
  )
}
```

Run: `npm run build` → succeeds. `npm test` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/theme.ts src/app/globals.css src/app/layout.tsx tests/lib/theme.test.ts
git commit -m "feat: three-phosphor theme system with FOUC-free boot

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Build info (serial + uptime source)

**Files:**
- Create: `src/lib/build-info.ts`, `tests/lib/build-info.test.ts`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: `BUILD_HASH: string` (git short hash or `'dev'`), `BUILD_TIME: number` (ms epoch), `uptimeDays(buildTime: number, now: number): number`. Env vars `NEXT_PUBLIC_BUILD_HASH`, `NEXT_PUBLIC_BUILD_TIME` injected at build.

- [ ] **Step 1: Write failing test**

Create `tests/lib/build-info.test.ts`:

```ts
import { uptimeDays } from '@/lib/build-info'

test('same instant is 0 days', () => {
  expect(uptimeDays(1000, 1000)).toBe(0)
})
test('floors partial days', () => {
  const day = 86_400_000
  expect(uptimeDays(0, 3 * day + day / 2)).toBe(3)
})
test('clock skew never goes negative', () => {
  expect(uptimeDays(2000, 1000)).toBe(0)
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement**

`src/lib/build-info.ts`:

```ts
export const BUILD_HASH = process.env.NEXT_PUBLIC_BUILD_HASH ?? 'dev'
export const BUILD_TIME = Number(process.env.NEXT_PUBLIC_BUILD_TIME ?? Date.now())

export function uptimeDays(buildTime: number, now: number): number {
  return Math.max(0, Math.floor((now - buildTime) / 86_400_000))
}
```

In `next.config.ts`, inject the env:

```ts
import type { NextConfig } from 'next'
import { execSync } from 'node:child_process'

let hash = 'dev'
try {
  hash = execSync('git rev-parse --short HEAD').toString().trim()
} catch {}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_HASH: hash,
    NEXT_PUBLIC_BUILD_TIME: String(Date.now()),
  },
}
export default nextConfig
```

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. `npm run build` → succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/build-info.ts next.config.ts tests/lib/build-info.test.ts
git commit -m "feat: build hash + uptime source for chassis serial and gauge

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Chassis shell + screen module

**Files:**
- Create: `src/components/chassis/Chassis.tsx`, `src/components/chassis/TopBezel.tsx`, `src/components/chassis/HardwareSwitch.tsx`, `src/components/screen/Screen.tsx`, `tests/components/chassis.test.tsx`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `BUILD_HASH` (Task 4), CSS tokens (Task 3).
- Produces: `<Chassis>{children}</Chassis>` used by the root layout; `<Screen>` wraps page content; `<HardwareSwitch id label storageKey onFlip(on: boolean)>` (client). Placeholder slots: Chassis renders `<GaugeCluster />` and `<FKeyRow />` only if present — for THIS task it renders an empty `<aside aria-label="gauge cluster" />` and `<nav aria-label="primary" />` placeholder divs that Tasks 6/8 replace.

- [ ] **Step 1: Write failing tests**

Create `tests/components/chassis.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chassis } from '@/components/chassis/Chassis'
import { HardwareSwitch } from '@/components/chassis/HardwareSwitch'

test('chassis shows model label and serial', () => {
  render(<Chassis>content</Chassis>)
  expect(screen.getByText(/BS-01/)).toBeInTheDocument()
  expect(screen.getByText(/SN dev/i)).toBeInTheDocument()
})

test('children render inside the screen region', () => {
  render(<Chassis>hello-screen</Chassis>)
  expect(screen.getByText('hello-screen')).toBeInTheDocument()
})

test('scanline switch flips html data attribute', async () => {
  render(
    <HardwareSwitch
      id="scan"
      label="SCANLINES"
      storageKey="bs01-scanlines"
      onFlip={(on) =>
        (document.documentElement.dataset.scanlines = on ? 'on' : 'off')
      }
    />,
  )
  await userEvent.click(screen.getByRole('switch', { name: /scanlines/i }))
  expect(document.documentElement.dataset.scanlines).toBe('off')
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement components**

`src/components/chassis/HardwareSwitch.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'

export function HardwareSwitch(props: {
  id: string
  label: string
  storageKey: string
  onFlip: (on: boolean) => void
}) {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const stored = localStorage.getItem(props.storageKey)
    if (stored !== null) {
      const v = stored === 'on'
      setOn(v)
      props.onFlip(v)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function flip() {
    const next = !on
    setOn(next)
    try {
      localStorage.setItem(props.storageKey, next ? 'on' : 'off')
    } catch {}
    props.onFlip(next)
  }
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={props.label}
      onClick={flip}
      className="flex items-center gap-1 text-[9px] tracking-widest text-[var(--phosphor-dim)]"
    >
      {props.label}
      <span className="inline-block h-3 w-6 rounded-full bg-[var(--chassis-well)] relative">
        <span
          className="absolute top-[2px] h-2 w-2 rounded-full transition-none"
          style={{
            left: on ? 'auto' : '2px',
            right: on ? '2px' : 'auto',
            background: on ? 'var(--phosphor)' : 'var(--phosphor-dim)',
          }}
        />
      </span>
    </button>
  )
}
```

`src/components/chassis/TopBezel.tsx`:

```tsx
'use client'
import { BUILD_HASH } from '@/lib/build-info'
import { HardwareSwitch } from './HardwareSwitch'
import { setSoundEnabled } from '@/lib/sound'

export function TopBezel() {
  return (
    <header className="flex items-center justify-between px-3 py-2 text-[9px] tracking-[0.15em] text-[var(--phosphor-dim)]">
      <span>
        BS-01 ▪ FIELD TERMINAL ▪ <span aria-label="serial number">SN {BUILD_HASH}</span>
      </span>
      <span className="flex items-center gap-3">
        <HardwareSwitch
          id="scanlines"
          label="SCANLINES"
          storageKey="bs01-scanlines"
          onFlip={(on) =>
            (document.documentElement.dataset.scanlines = on ? 'on' : 'off')
          }
        />
        <HardwareSwitch
          id="sound"
          label="SOUND"
          storageKey="bs01-sound"
          onFlip={setSoundEnabled}
        />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--phosphor)] shadow-[0_0_6px_var(--glow)]" />
      </span>
    </header>
  )
}
```

NOTE: `setSoundEnabled` comes from Task 6's `src/lib/sound.ts`. To keep this task independently green, create the module now with its final API (Task 6 adds `playClick` internals):

`src/lib/sound.ts`:

```ts
let enabled = false
export function setSoundEnabled(on: boolean): void {
  enabled = on
}
export function soundEnabled(): boolean {
  return enabled
}
export function playClick(): void {
  if (!enabled || typeof AudioContext === 'undefined') return
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = 2200
  gain.gain.setValueAtTime(0.04, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.02)
}
```

The sound switch defaults OFF: in `TopBezel`, sound's `HardwareSwitch` needs `defaultOn={false}` — add an optional prop `defaultOn?: boolean` (default `true`) to `HardwareSwitch` and use `useState(props.defaultOn ?? true)`; pass `defaultOn={false}` for SOUND.

`src/components/screen/Screen.tsx`:

```tsx
export function Screen({ children }: { children: React.ReactNode }) {
  return <div className="crt-screen text-[var(--phosphor)]">{children}</div>
}
```

`src/components/chassis/Chassis.tsx`:

```tsx
import { TopBezel } from './TopBezel'
import { Screen } from '@/components/screen/Screen'

export function Chassis({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl p-2 sm:p-4">
      <TopBezel />
      <div className="grid gap-2 sm:grid-cols-[1fr_96px]">
        <Screen>{children}</Screen>
        <aside aria-label="gauge cluster" className="flex flex-row gap-2 sm:flex-col" />
      </div>
      <nav aria-label="primary" className="mt-2" />
      <p className="mt-1 flex items-center justify-between text-[8px] tracking-[0.2em] text-[var(--phosphor-dim)]">
        <span aria-hidden="true">⊕</span>
        MADE BY HAND ▪ RUNS ON SUNLIGHT
        <span aria-hidden="true">⊕</span>
      </p>
    </div>
  )
}
```

Wire into `src/app/layout.tsx` body:

```tsx
<body className={mono.variable}>
  <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
  <Chassis>{children}</Chassis>
</body>
```

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. `npm run build` → succeeds. `npm run dev`, load `http://localhost:3000`: chassis frame, scanlines visible on GREEN, switch toggles them.

- [ ] **Step 5: Commit**

```bash
git add src/components src/lib/sound.ts src/app/layout.tsx tests/components/chassis.test.tsx
git commit -m "feat: chassis shell with bezel, switches, CRT screen module

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: F-key nav + keyboard shortcuts + key clicks

**Files:**
- Create: `src/components/chassis/FKeyRow.tsx`, `src/components/chassis/useKeyboardNav.ts`, `tests/components/fkeys.test.tsx`
- Modify: `src/components/chassis/Chassis.tsx` (replace the `<nav>` placeholder)

**Interfaces:**
- Consumes: `playClick` (Task 5's `sound.ts`).
- Produces: `<FKeyRow />` (client) — nav for the whole site. Routes: `/` (F1 WORK), `/about` (F2 ABOUT), `/resume.pdf` (F3 CV), `/contact` (F4 PING, alert-colored). Shortcuts: `1/w → /`, `2/a → /about`, `3/c → /resume.pdf`, `4/p → /contact`; ignored while typing in inputs/textareas.

- [ ] **Step 1: Write failing tests**

Create `tests/components/fkeys.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/',
}))

import { FKeyRow } from '@/components/chassis/FKeyRow'

test('renders four real links', () => {
  render(<FKeyRow />)
  expect(screen.getByRole('link', { name: /F1 WORK/i })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: /F2 ABOUT/i })).toHaveAttribute('href', '/about')
  expect(screen.getByRole('link', { name: /F3 CV/i })).toHaveAttribute('href', '/resume.pdf')
  expect(screen.getByRole('link', { name: /F4 PING/i })).toHaveAttribute('href', '/contact')
})

test('keyboard shortcut navigates', () => {
  render(<FKeyRow />)
  fireEvent.keyDown(window, { key: '2' })
  expect(push).toHaveBeenCalledWith('/about')
})

test('shortcuts ignored while typing', () => {
  push.mockClear()
  render(
    <div>
      <FKeyRow />
      <input aria-label="field" />
    </div>,
  )
  const input = screen.getByLabelText('field')
  input.focus()
  fireEvent.keyDown(input, { key: '2' })
  expect(push).not.toHaveBeenCalled()
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement**

`src/components/chassis/useKeyboardNav.ts`:

```ts
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MAP: Record<string, string> = {
  '1': '/', w: '/',
  '2': '/about', a: '/about',
  '3': '/resume.pdf', c: '/resume.pdf',
  '4': '/contact', p: '/contact',
}

export function useKeyboardNav() {
  const router = useRouter()
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const dest = MAP[e.key.toLowerCase()]
      if (dest) router.push(dest)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])
}
```

`src/components/chassis/FKeyRow.tsx`:

```tsx
'use client'
import Link from 'next/link'
import { useKeyboardNav } from './useKeyboardNav'
import { playClick } from '@/lib/sound'

const KEYS = [
  { label: 'F1 WORK', href: '/' },
  { label: 'F2 ABOUT', href: '/about' },
  { label: 'F3 CV', href: '/resume.pdf' },
  { label: 'F4 PING', href: '/contact', alert: true },
]

export function FKeyRow() {
  useKeyboardNav()
  return (
    <nav aria-label="primary" className="mt-2 flex gap-1.5">
      {KEYS.map((k) => (
        <Link
          key={k.href}
          href={k.href}
          onClick={playClick}
          className="flex-1 rounded-[3px] border border-[var(--chassis-well)] border-b-[3px] px-2 py-1.5 text-center text-[10px] active:translate-y-[2px] active:border-b"
          style={{
            background: k.alert ? 'var(--alert)' : 'var(--keycap)',
            color: k.alert ? 'var(--alert-text)' : 'var(--phosphor)',
          }}
        >
          {k.label}
        </Link>
      ))}
    </nav>
  )
}
```

In `Chassis.tsx`, replace `<nav aria-label="primary" className="mt-2" />` with `<FKeyRow />` (import it).

`Chassis` now transitively uses `useRouter`, so Task 5's `tests/components/chassis.test.tsx` will start failing with "invariant expected app router to be mounted". Add this mock block at the top of that file (before the component imports):

```tsx
import { vi } from 'vitest'
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))
```

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. `npm run dev`: keys depress on click; pressing `2` navigates to /about (404 page for now is fine).

- [ ] **Step 5: Commit**

```bash
git add src/components/chassis tests/components/fkeys.test.tsx
git commit -m "feat: F-key navigation with keyboard shortcuts and key clicks

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Home page hero + ports footer

**Files:**
- Modify: `src/app/page.tsx`
- Test: `tests/app/home.test.tsx`

**Interfaces:**
- Consumes: nothing new; DiskBay slot is added in Task 11 — leave a `{/* disk bay: task 11 */}` marker comment.
- Produces: home content structure other tasks extend.

- [ ] **Step 1: Write failing test**

Create `tests/app/home.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

test('hero shows name at heading level 1', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 1, name: /brandon smith/i })).toBeInTheDocument()
})
test('ports footer has the three contact links', () => {
  render(<Home />)
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/Ayosage')
  expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute('href', 'mailto:aexbrandon@gmail.com')
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement `src/app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="p-4 sm:p-6">
      <p className="border-b border-[var(--hairline)] pb-2 text-[10px] text-[var(--phosphor-dim)]">
        ~/brandon-smith
      </p>
      <h1 className="phosphor-glow mt-6 text-[clamp(3rem,14vw,7rem)] font-bold uppercase leading-[0.85] tracking-tighter">
        Brandon
        <br />
        Smith<span aria-hidden="true">█</span>
      </h1>
      <p className="mt-4 max-w-[46ch] text-xs text-[var(--phosphor-dim)]">
        {'// full-stack engineer — payments, infra, web3: invisible by design'}
      </p>

      {/* disk bay: task 11 */}

      <footer className="mt-10 border-t border-[var(--hairline)] pt-3 text-[10px]">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li>
            <a href="https://github.com/Ayosage" className="hover:underline">
              PORT-A ▸ GITHUB ↗
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/brandon-smith" className="hover:underline">
              PORT-B ▸ LINKEDIN ↗
            </a>
          </li>
          <li>
            <a href="mailto:aexbrandon@gmail.com" className="hover:underline">
              PORT-C ▸ EMAIL ↗
            </a>
          </li>
        </ul>
      </footer>
    </main>
  )
}
```

(Verify the LinkedIn URL with Brandon before launch; placeholder slug is fine for now.)

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Visual check in dev: name fills the screen width, glow on GREEN, no glow on PAPER.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx tests/app/home.test.tsx
git commit -m "feat: viewport-scale hero and ports footer on home

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Gauges — solar meter, uptime, gauge cluster

**Files:**
- Create: `src/lib/solar.ts`, `src/components/gauges/SolarMeter.tsx`, `src/components/gauges/UptimeGauge.tsx`, `src/components/gauges/GaugeCluster.tsx`, `tests/lib/solar.test.ts`
- Modify: `src/components/chassis/Chassis.tsx` (replace the `<aside>` placeholder)

**Interfaces:**
- Consumes: `uptimeDays`, `BUILD_TIME` (Task 4).
- Produces: `solarPercent(date: Date): number` (integer 0–100, day approximated 06:00–20:00 local, sine curve); `<GaugeCluster />` — the right sidebar; Task 9 (ThemeDial) and Task 14 (PixelGarden) append themselves inside `GaugeCluster`.

- [ ] **Step 1: Write failing tests**

Create `tests/lib/solar.test.ts`:

```ts
import { solarPercent } from '@/lib/solar'

const at = (h: number, m = 0) => new Date(2026, 7, 17, h, m)

test('night is 0', () => {
  expect(solarPercent(at(2))).toBe(0)
  expect(solarPercent(at(23))).toBe(0)
})
test('solar noon (13:00) is 100', () => {
  expect(solarPercent(at(13))).toBe(100)
})
test('sunrise edge is 0, ramps by mid-morning', () => {
  expect(solarPercent(at(6))).toBe(0)
  expect(solarPercent(at(9, 30))).toBeGreaterThan(50)
})
test('always an integer within 0..100', () => {
  for (let h = 0; h < 24; h++) {
    const v = solarPercent(at(h))
    expect(Number.isInteger(v)).toBe(true)
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThanOrEqual(100)
  }
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement**

`src/lib/solar.ts`:

```ts
const SUNRISE = 6
const SUNSET = 20

export function solarPercent(date: Date): number {
  const h = date.getHours() + date.getMinutes() / 60
  if (h <= SUNRISE || h >= SUNSET) return 0
  const t = (h - SUNRISE) / (SUNSET - SUNRISE)
  return Math.round(100 * Math.sin(Math.PI * t))
}
```

`src/components/gauges/SolarMeter.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { solarPercent } from '@/lib/solar'

export function SolarMeter() {
  const [pct, setPct] = useState<number | null>(null)
  useEffect(() => {
    const update = () => setPct(solarPercent(new Date()))
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])
  const blocks = pct === null ? 0 : Math.round(pct / 20)
  return (
    <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[8px] text-[var(--phosphor-dim)]">
      SOLAR
      <div aria-hidden="true" className="text-[10px] text-[var(--phosphor)]">
        {'▮'.repeat(blocks)}
        {'▯'.repeat(5 - blocks)}
      </div>
      <span aria-label={`solar charge ${pct ?? 0} percent`}>{pct ?? '—'}%</span>
    </div>
  )
}
```

`src/components/gauges/UptimeGauge.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { BUILD_TIME, uptimeDays } from '@/lib/build-info'

export function UptimeGauge() {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => setDays(uptimeDays(BUILD_TIME, Date.now())), [])
  return (
    <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[8px] text-[var(--phosphor-dim)]">
      UPTIME
      <div className="text-[var(--phosphor)]">{days ?? '—'}d</div>
    </div>
  )
}
```

`src/components/gauges/GaugeCluster.tsx`:

```tsx
import { SolarMeter } from './SolarMeter'
import { UptimeGauge } from './UptimeGauge'

export function GaugeCluster() {
  return (
    <aside aria-label="gauge cluster" className="flex flex-row gap-2 sm:flex-col">
      <SolarMeter />
      <UptimeGauge />
      {/* theme dial: task 9 */}
      {/* pixel garden: task 14 */}
      <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[8px] text-[var(--phosphor-dim)]">
        STATUS
        <div className="text-[var(--phosphor)]">● OPEN TO WORK</div>
      </div>
    </aside>
  )
}
```

In `Chassis.tsx`, replace the empty `<aside … />` with `<GaugeCluster />`.

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Dev check: gauges render, values are real (solar matches your local time). Note the meter renders `—` server-side and fills client-side — no hydration mismatch.

- [ ] **Step 5: Commit**

```bash
git add src/lib/solar.ts src/components/gauges src/components/chassis/Chassis.tsx tests/lib/solar.test.ts
git commit -m "feat: live solar and uptime gauges in cluster

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Theme dial

**Files:**
- Create: `src/components/gauges/ThemeDial.tsx`, `tests/components/theme-dial.test.tsx`
- Modify: `src/components/gauges/GaugeCluster.tsx` (fill the marked slot)

**Interfaces:**
- Consumes: `THEMES`, `applyTheme`, `resolveTheme` (Task 3).
- Produces: `<ThemeDial />` — cycles GREEN → AMBER → PAPER on click, persists, reflects current theme.

- [ ] **Step 1: Write failing test**

Create `tests/components/theme-dial.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeDial } from '@/components/gauges/ThemeDial'

test('cycles themes and persists', async () => {
  document.documentElement.dataset.theme = 'green'
  localStorage.clear()
  render(<ThemeDial />)
  const dial = screen.getByRole('button', { name: /theme/i })
  await userEvent.click(dial)
  expect(document.documentElement.dataset.theme).toBe('amber')
  expect(localStorage.getItem('bs01-theme')).toBe('amber')
  await userEvent.click(dial)
  expect(document.documentElement.dataset.theme).toBe('paper')
  await userEvent.click(dial)
  expect(document.documentElement.dataset.theme).toBe('green')
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement `src/components/gauges/ThemeDial.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { THEMES, type Theme, applyTheme } from '@/lib/theme'

const LABEL: Record<Theme, string> = { green: 'GRN', amber: 'AMB', paper: 'PPR' }

export function ThemeDial() {
  const [theme, setTheme] = useState<Theme>('green')
  useEffect(() => {
    const t = document.documentElement.dataset.theme as Theme | undefined
    if (t && THEMES.includes(t)) setTheme(t)
  }, [])
  function cycle() {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setTheme(next)
    applyTheme(next)
  }
  return (
    <button
      onClick={cycle}
      aria-label={`theme dial, current ${LABEL[theme]}`}
      className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-left text-[8px] text-[var(--phosphor-dim)]"
    >
      THEME DIAL
      <span aria-hidden="true" className="block text-center text-sm text-[var(--phosphor)]">◉</span>
      <span aria-hidden="true" className="flex justify-between text-[7px]">
        {THEMES.map((t) => (
          <span key={t} style={{ color: t === theme ? 'var(--phosphor)' : undefined }}>
            {LABEL[t]}
          </span>
        ))}
      </span>
    </button>
  )
}
```

Fill the `{/* theme dial: task 9 */}` slot in `GaugeCluster.tsx` with `<ThemeDial />`.

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Dev check: dial cycles all three themes live; reload keeps the choice.

- [ ] **Step 5: Commit**

```bash
git add src/components/gauges tests/components/theme-dial.test.tsx
git commit -m "feat: theme dial cycling green/amber/paper phosphor

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Boot sequence overlay

**Files:**
- Create: `src/components/screen/BootOverlay.tsx`, `tests/components/boot.test.tsx`
- Modify: `src/components/screen/Screen.tsx` (render overlay inside the screen)

**Interfaces:**
- Produces: `<BootOverlay />` — client component; shows once per session (`sessionStorage['bs01-booted']`), auto-dismisses after 1.2s, any keydown/click skips, skipped entirely under `prefers-reduced-motion`. Content stays in the DOM underneath (overlay is `position:absolute`), so SSR/SEO unaffected.

- [ ] **Step 1: Write failing tests**

Create `tests/components/boot.test.tsx`:

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'
import { BootOverlay } from '@/components/screen/BootOverlay'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

beforeEach(() => sessionStorage.clear())

test('shows on first visit and marks session booted', () => {
  mockReducedMotion(false)
  render(<BootOverlay />)
  expect(screen.getByText(/LOADING PORTFOLIO.SYS/)).toBeInTheDocument()
  expect(sessionStorage.getItem('bs01-booted')).toBe('1')
})

test('any key skips it', () => {
  mockReducedMotion(false)
  render(<BootOverlay />)
  fireEvent.keyDown(window, { key: 'x' })
  expect(screen.queryByText(/LOADING PORTFOLIO.SYS/)).not.toBeInTheDocument()
})

test('auto-dismisses after 1.2s', () => {
  vi.useFakeTimers()
  mockReducedMotion(false)
  render(<BootOverlay />)
  act(() => vi.advanceTimersByTime(1300))
  expect(screen.queryByText(/LOADING PORTFOLIO.SYS/)).not.toBeInTheDocument()
  vi.useRealTimers()
})

test('never shows twice per session', () => {
  mockReducedMotion(false)
  sessionStorage.setItem('bs01-booted', '1')
  render(<BootOverlay />)
  expect(screen.queryByText(/LOADING PORTFOLIO.SYS/)).not.toBeInTheDocument()
})

test('respects prefers-reduced-motion', () => {
  mockReducedMotion(true)
  render(<BootOverlay />)
  expect(screen.queryByText(/LOADING PORTFOLIO.SYS/)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement `src/components/screen/BootOverlay.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'

export function BootOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let booted = false
    try {
      booted = sessionStorage.getItem('bs01-booted') === '1'
    } catch {}
    if (reduced || booted) return
    try {
      sessionStorage.setItem('bs01-booted', '1')
    } catch {}
    setVisible(true)
    const dismiss = () => setVisible(false)
    const timer = setTimeout(dismiss, 1200)
    window.addEventListener('keydown', dismiss)
    window.addEventListener('pointerdown', dismiss)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', dismiss)
      window.removeEventListener('pointerdown', dismiss)
    }
  }, [])

  if (!visible) return null
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-10 bg-[var(--screen)] p-4 text-[11px] leading-relaxed text-[var(--phosphor-dim)]"
    >
      <p>BS-01 BIOS v2.6</p>
      <p>MEM CHECK ......... OK</p>
      <p>SOLAR CELL ........ OK</p>
      <p className="text-[var(--phosphor)]">LOADING PORTFOLIO.SYS ▮▮▮▮▯</p>
    </div>
  )
}
```

In `Screen.tsx`:

```tsx
import { BootOverlay } from './BootOverlay'

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="crt-screen text-[var(--phosphor)]">
      <BootOverlay />
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Dev check (fresh tab): boot flashes then content; reload in same tab: no boot.

- [ ] **Step 5: Commit**

```bash
git add src/components/screen tests/components/boot.test.tsx
git commit -m "feat: skippable once-per-session boot sequence

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: Project registry + disk bay

**Files:**
- Create: `src/lib/projects.ts`, `src/components/diskbay/DiskBay.tsx`, `src/components/diskbay/Cartridge.tsx`, `tests/components/diskbay.test.tsx`
- Modify: `src/app/page.tsx` (fill the `{/* disk bay: task 11 */}` marker)

**Interfaces:**
- Produces: `type Project = { slug: string; title: string; oneLiner: string; tags: string[]; hasCaseStudy: boolean }`; `PROJECTS: Project[]` (stagepass, meridian, steward, cellarkeep — only stagepass `hasCaseStudy: true` for now); `<DiskBay />`. Task 12 consumes `PROJECTS` for `generateStaticParams`.
- Cartridges with a case study are real `<Link href="/projects/[slug]">`; on click they play a ~500ms "spin-up" state before navigating (immediate under reduced motion). Cartridges without content render as non-interactive `EJECTED` slots.

- [ ] **Step 1: Write failing tests**

Create `tests/components/diskbay.test.tsx`:

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

import { DiskBay } from '@/components/diskbay/DiskBay'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia
}

test('stagepass is a real link, empty slots are not', () => {
  mockReducedMotion(false)
  render(<DiskBay />)
  expect(screen.getByRole('link', { name: /stagepass/i })).toHaveAttribute('href', '/projects/stagepass')
  expect(screen.queryByRole('link', { name: /meridian/i })).not.toBeInTheDocument()
  expect(screen.getAllByText(/EJECTED/)).toHaveLength(3)
})

test('click spins up then navigates', () => {
  vi.useFakeTimers()
  mockReducedMotion(false)
  push.mockClear()
  render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /stagepass/i }))
  expect(screen.getByText(/SPIN-UP/)).toBeInTheDocument()
  expect(push).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(600))
  expect(push).toHaveBeenCalledWith('/projects/stagepass')
  vi.useRealTimers()
})

test('reduced motion navigates immediately', () => {
  mockReducedMotion(true)
  push.mockClear()
  render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /stagepass/i }))
  expect(push).toHaveBeenCalledWith('/projects/stagepass')
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement**

`src/lib/projects.ts`:

```ts
export type Project = {
  slug: string
  title: string
  oneLiner: string
  tags: string[]
  hasCaseStudy: boolean
}

export const PROJECTS: Project[] = [
  { slug: 'stagepass', title: 'StagePass', oneLiner: 'Ticketing — web3 under the hood', tags: ['NEXT.JS', 'SOLIDITY'], hasCaseStudy: true },
  { slug: 'meridian', title: 'Meridian', oneLiner: 'In fabrication', tags: [], hasCaseStudy: false },
  { slug: 'steward', title: 'Steward', oneLiner: 'In fabrication', tags: [], hasCaseStudy: false },
  { slug: 'cellarkeep', title: 'CellarKeep', oneLiner: 'In fabrication', tags: [], hasCaseStudy: false },
]
```

`src/components/diskbay/Cartridge.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/lib/projects'

export function Cartridge({ project }: { project: Project }) {
  const router = useRouter()
  const [spinning, setSpinning] = useState(false)

  if (!project.hasCaseStudy) {
    return (
      <div className="border border-[var(--hairline)] p-2 text-center text-[9px] text-[var(--phosphor-dim)]">
        ▢ {project.title.toUpperCase()}
        <br />
        EJECTED — {project.oneLiner.toUpperCase()}
      </div>
    )
  }

  const href = `/projects/${project.slug}`
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          router.push(href)
          return
        }
        setSpinning(true)
        setTimeout(() => router.push(href), 500)
      }}
      className="border border-[var(--phosphor)] bg-[color-mix(in_srgb,var(--phosphor)_10%,transparent)] p-2 text-center text-[9px]"
    >
      ▣ {project.title.toUpperCase()}
      <br />
      <span className="text-[var(--phosphor-dim)]">
        {spinning ? '▸ SPIN-UP…' : project.tags.join(' / ') || project.oneLiner.toUpperCase()}
      </span>
    </a>
  )
}
```

`src/components/diskbay/DiskBay.tsx`:

```tsx
import { PROJECTS } from '@/lib/projects'
import { Cartridge } from './Cartridge'

export function DiskBay() {
  return (
    <section aria-label="disk bay — selected work" className="mt-10 border border-[var(--hairline)]">
      <p className="flex justify-between border-b border-[var(--hairline)] px-2 py-1 text-[8px] text-[var(--phosphor-dim)]">
        <span>DISK BAY — SELECT MEDIA</span>
        <span>{PROJECTS.length} SLOTS</span>
      </p>
      <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4">
        {PROJECTS.map((p) => (
          <Cartridge key={p.slug} project={p} />
        ))}
      </div>
    </section>
  )
}
```

Replace the `{/* disk bay: task 11 */}` marker in `src/app/page.tsx` with `<DiskBay />` (import it).

`Home` now transitively renders `Cartridge` (which calls `useRouter`), so `tests/smoke.test.tsx` and `tests/app/home.test.tsx` will start failing. Add this mock block to the top of BOTH files (before the component imports):

```tsx
import { vi } from 'vitest'
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))
```

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Dev check: bay renders 4 slots, StagePass spins up and navigates (404 until Task 12).

- [ ] **Step 5: Commit**

```bash
git add src/lib/projects.ts src/components/diskbay src/app/page.tsx tests/components/diskbay.test.tsx
git commit -m "feat: disk bay project index with cartridge spin-up

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 12: Case-study template (MDX) + StagePass placeholder

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`, `content/projects/stagepass.mdx`, `src/components/case-study/CaseStudyMeta.tsx`, `src/components/case-study/SectionHeading.tsx`, `src/components/case-study/EscBack.tsx`, `tests/components/case-study.test.tsx`
- Modify: `next.config.ts`, `package.json` (MDX deps)

**Interfaces:**
- Consumes: `PROJECTS` (Task 11).
- Produces: route `/projects/[slug]` statically generated for every project with `hasCaseStudy`; MDX files register themselves in a `CASE_STUDIES: Record<string, ComponentType>` map inside `page.tsx`. `<SectionHeading index title />` renders `NN — TITLE` and carries `data-garden-section={index}` (Task 14 depends on this attribute). `<EscBack />`: Escape key → `router.back()`.

- [ ] **Step 1: Install and configure MDX**

```bash
npm i @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

Update `next.config.ts` (merge with Task 4's env block):

```ts
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import { execSync } from 'node:child_process'

let hash = 'dev'
try {
  hash = execSync('git rev-parse --short HEAD').toString().trim()
} catch {}

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  env: {
    NEXT_PUBLIC_BUILD_HASH: hash,
    NEXT_PUBLIC_BUILD_TIME: String(Date.now()),
  },
}
export default createMDX()(nextConfig)
```

Create `mdx-components.tsx` at repo root:

```tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components
}
```

- [ ] **Step 2: Write failing tests**

Create `tests/components/case-study.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

const back = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ back }) }))

import { SectionHeading } from '@/components/case-study/SectionHeading'
import { CaseStudyMeta } from '@/components/case-study/CaseStudyMeta'
import { EscBack } from '@/components/case-study/EscBack'

test('section heading shows numbered title and garden hook', () => {
  render(<SectionHeading index={1} title="The Problem" />)
  const h = screen.getByRole('heading', { name: /01 — THE PROBLEM/ })
  expect(h).toHaveAttribute('data-garden-section', '1')
})

test('meta strip renders all fields', () => {
  render(<CaseStudyMeta role="Full-stack" stack="Next / Solidity" year="2026" live />)
  expect(screen.getByText(/ROLE: FULL-STACK/i)).toBeInTheDocument()
  expect(screen.getByText(/● LIVE/)).toBeInTheDocument()
})

test('Escape goes back', () => {
  render(<EscBack />)
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(back).toHaveBeenCalled()
})
```

- [ ] **Step 3: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 4: Implement components**

`src/components/case-study/SectionHeading.tsx`:

```tsx
export function SectionHeading({ index, title }: { index: number; title: string }) {
  const nn = String(index).padStart(2, '0')
  return (
    <h2
      data-garden-section={index}
      className="mt-8 inline-block border-b border-[var(--phosphor-dim)] text-[11px] uppercase tracking-widest text-[var(--phosphor-dim)]"
    >
      {nn} — {title.toUpperCase()}
    </h2>
  )
}
```

`src/components/case-study/CaseStudyMeta.tsx`:

```tsx
export function CaseStudyMeta(props: {
  role: string
  stack: string
  year: string
  live?: boolean
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border border-[var(--hairline)] px-2 py-1.5 text-[9px] uppercase text-[var(--phosphor-dim)]">
      <span>ROLE: {props.role}</span>
      <span>STACK: {props.stack}</span>
      <span>YEAR: {props.year}</span>
      {props.live && <span className="text-[var(--phosphor)]">● LIVE</span>}
    </div>
  )
}
```

`src/components/case-study/EscBack.tsx`:

```tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function EscBack() {
  const router = useRouter()
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') router.back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])
  return null
}
```

- [ ] **Step 5: Content + route**

`content/projects/stagepass.mdx`:

```mdx
import { CaseStudyMeta } from '@/components/case-study/CaseStudyMeta'
import { SectionHeading } from '@/components/case-study/SectionHeading'

<CaseStudyMeta role="Full-stack" stack="Next.js / Solidity" year="2026" />

<SectionHeading index={1} title="The Problem" />

<div className="prose-body mt-2 max-w-[60ch] text-sm leading-relaxed">
Event ticketing is hostile to fans. StagePass makes tickets portable and
scalping-resistant — the web3 machinery stays invisible to users.
*(Placeholder — real case-study content is blocked on the StagePass build.)*
</div>

<SectionHeading index={2} title="Architecture" />

<div className="prose-body mt-2 max-w-[60ch] text-sm leading-relaxed">
*(Blocked on StagePass.)*
</div>

<SectionHeading index={3} title="Decisions" />

<div className="prose-body mt-2 max-w-[60ch] text-sm leading-relaxed">
*(Blocked on StagePass.)*
</div>
```

`src/app/projects/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { PROJECTS } from '@/lib/projects'
import { EscBack } from '@/components/case-study/EscBack'
import Stagepass from '@@content/projects/stagepass.mdx'

const CASE_STUDIES: Record<string, ComponentType> = {
  stagepass: Stagepass,
}

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.hasCaseStudy).map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug && p.hasCaseStudy)
  const Content = CASE_STUDIES[slug]
  if (!project || !Content) notFound()
  return (
    <main className="p-4 sm:p-6">
      <EscBack />
      <p className="flex justify-between border-b border-[var(--hairline)] pb-2 text-[10px] text-[var(--phosphor-dim)]">
        <span>~/work/{project.slug}</span>
        <span>[ESC] BACK</span>
      </p>
      <h1 className="phosphor-glow mt-4 text-4xl font-bold uppercase tracking-tighter sm:text-6xl">
        {project.title}
      </h1>
      <Content />
    </main>
  )
}
```

Add the `@@content` alias to `tsconfig.json` paths: `"@@content/*": ["./content/*"]` (and mirror in `vitest.config.ts` alias if any test imports content — none do).

- [ ] **Step 6: Verify**

Run: `npm test` → PASS. `npm run build` → succeeds, `/projects/stagepass` in the static output. Dev check: cartridge → spin-up → case study; ESC returns.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: MDX case-study template with StagePass placeholder

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 13: About + resume, Contact PING

**Files:**
- Create: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/contact/actions.ts`, `src/lib/contact.ts`, `public/resume.pdf`, `tests/lib/contact.test.ts`

**Interfaces:**
- Produces: `validatePing(input: { from: string; message: string }): { ok: true } | { ok: false; error: string }` (pure, in `src/lib/contact.ts`); server action `sendPing(prevState, formData)` in `actions.ts` using it.

- [ ] **Step 1: Write failing test**

Create `tests/lib/contact.test.ts`:

```ts
import { validatePing } from '@/lib/contact'

test('valid ping passes', () => {
  expect(validatePing({ from: 'a@b.co', message: 'hello there' })).toEqual({ ok: true })
})
test('bad email fails', () => {
  expect(validatePing({ from: 'nope', message: 'hello there' }).ok).toBe(false)
})
test('empty message fails', () => {
  expect(validatePing({ from: 'a@b.co', message: '  ' }).ok).toBe(false)
})
test('oversized message fails', () => {
  expect(validatePing({ from: 'a@b.co', message: 'x'.repeat(5001) }).ok).toBe(false)
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement**

`src/lib/contact.ts`:

```ts
export function validatePing(input: {
  from: string
  message: string
}): { ok: true } | { ok: false; error: string } {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.from))
    return { ok: false, error: 'BAD RETURN ADDRESS' }
  const msg = input.message.trim()
  if (msg.length === 0) return { ok: false, error: 'EMPTY TRANSMISSION' }
  if (msg.length > 5000) return { ok: false, error: 'TRANSMISSION TOO LONG' }
  return { ok: true }
}
```

`src/app/contact/actions.ts`:

```ts
'use server'
import { validatePing } from '@/lib/contact'

export type PingState = { status: 'idle' | 'sent' | 'error'; error?: string }

export async function sendPing(_prev: PingState, formData: FormData): Promise<PingState> {
  const input = {
    from: String(formData.get('from') ?? ''),
    message: String(formData.get('message') ?? ''),
  }
  const result = validatePing(input)
  if (!result.ok) return { status: 'error', error: result.error }
  console.log('[BS-01 PING]', JSON.stringify(input))
  return { status: 'sent' }
}
```

`src/app/contact/page.tsx` (client form via `useActionState`):

```tsx
'use client'
import { useActionState } from 'react'
import { sendPing, type PingState } from './actions'

export default function Contact() {
  const [state, action, pending] = useActionState<PingState, FormData>(sendPing, {
    status: 'idle',
  })
  return (
    <main className="p-4 sm:p-6">
      <h1 className="phosphor-glow text-4xl font-bold uppercase tracking-tighter">Ping</h1>
      <p className="mt-2 text-xs text-[var(--phosphor-dim)]">
        {'// open a channel — or transmit direct: '}
        <a className="underline" href="mailto:aexbrandon@gmail.com">
          aexbrandon@gmail.com
        </a>
      </p>
      <form action={action} className="mt-6 flex max-w-md flex-col gap-3 text-xs">
        <label className="flex flex-col gap-1">
          RETURN ADDRESS
          <input
            name="from"
            type="email"
            required
            className="border border-[var(--hairline)] bg-transparent p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          TRANSMISSION
          <textarea
            name="message"
            required
            rows={5}
            className="border border-[var(--hairline)] bg-transparent p-2"
          />
        </label>
        <button
          disabled={pending}
          className="border border-[var(--phosphor)] p-2 uppercase disabled:opacity-50"
        >
          {pending ? 'Transmitting…' : 'Transmit ▸'}
        </button>
        <p role="status" className="min-h-4 text-[var(--phosphor-dim)]">
          {state.status === 'sent' && '▸ TRANSMISSION RECEIVED. I read every ping.'}
          {state.status === 'error' && `▸ ERROR: ${state.error}`}
        </p>
      </form>
    </main>
  )
}
```

`src/app/about/page.tsx`:

```tsx
export default function About() {
  return (
    <main className="p-4 sm:p-6">
      <h1 className="phosphor-glow text-4xl font-bold uppercase tracking-tighter">Operator</h1>
      <div className="prose-body mt-4 max-w-[60ch] text-sm leading-relaxed">
        <p>
          Brandon Smith — full-stack engineer targeting web + web3 roles. I build
          products where the hard parts (payments, infra, chain state) stay
          invisible to the people using them.
        </p>
        <p className="mt-3">
          Currently building a five-project portfolio: StagePass (flagship),
          Meridian, Steward, and CellarKeep.
        </p>
      </div>
      <a href="/resume.pdf" className="mt-6 inline-block border border-[var(--phosphor)] px-3 py-2 text-xs uppercase">
        Download resume ▸ PDF
      </a>
    </main>
  )
}
```

`public/resume.pdf`: placeholder until Brandon supplies the real file — create a minimal valid PDF:

```
%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 60>>stream
BT /F1 18 Tf 72 720 Td (Resume placeholder - BS-01) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
```

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Dev check: form validates (try bad email), success message on valid submit; `/resume.pdf` downloads.

- [ ] **Step 5: Commit**

```bash
git add src/app/about src/app/contact src/lib/contact.ts public/resume.pdf tests/lib/contact.test.ts
git commit -m "feat: about page, resume, and contact ping form

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 14: Pixel garden

**Files:**
- Create: `src/lib/garden.ts`, `src/components/gauges/PixelGarden.tsx`, `src/components/case-study/GardenTracker.tsx`, `tests/lib/garden.test.ts`
- Modify: `src/components/gauges/GaugeCluster.tsx` (fill marked slot), `src/app/projects/[slug]/page.tsx` (mount tracker)

**Interfaces:**
- Consumes: `data-garden-section` attributes (Task 12).
- Produces: `MAX_STAGE = 7`; `readSections(): Set<string>`; `recordSection(id: string): number` (adds to sessionStorage `bs01-garden`, dispatches `window` CustomEvent `'bs01-garden'` with the new stage, returns stage = min(sections seen, MAX_STAGE)); `stageFor(count: number): number`. `<GardenTracker />` observes headings on case-study pages; `<PixelGarden />` renders the plant at current stage.

- [ ] **Step 1: Write failing tests**

Create `tests/lib/garden.test.ts`:

```ts
import { MAX_STAGE, recordSection, readSections, stageFor } from '@/lib/garden'

beforeEach(() => sessionStorage.clear())

test('stage grows once per unique section', () => {
  expect(recordSection('stagepass:1')).toBe(1)
  expect(recordSection('stagepass:1')).toBe(1)
  expect(recordSection('stagepass:2')).toBe(2)
})
test('stage caps at MAX_STAGE', () => {
  for (let i = 0; i < 20; i++) recordSection(`s:${i}`)
  expect(stageFor(readSections().size)).toBe(MAX_STAGE)
})
test('dispatches growth event', () => {
  let heard = -1
  window.addEventListener('bs01-garden', (e) => {
    heard = (e as CustomEvent<number>).detail
  })
  recordSection('x:1')
  expect(heard).toBe(1)
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` → FAIL.

- [ ] **Step 3: Implement**

`src/lib/garden.ts`:

```ts
export const MAX_STAGE = 7
const KEY = 'bs01-garden'

export function readSections(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

export function stageFor(count: number): number {
  return Math.min(count, MAX_STAGE)
}

export function recordSection(id: string): number {
  const seen = readSections()
  const before = seen.size
  seen.add(id)
  if (seen.size !== before) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify([...seen]))
    } catch {}
    window.dispatchEvent(new CustomEvent('bs01-garden', { detail: stageFor(seen.size) }))
  }
  return stageFor(seen.size)
}
```

`src/components/case-study/GardenTracker.tsx`:

```tsx
'use client'
import { useEffect } from 'react'
import { recordSection } from '@/lib/garden'

export function GardenTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const headings = document.querySelectorAll('[data-garden-section]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            recordSection(`${slug}:${e.target.getAttribute('data-garden-section')}`)
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.5 },
    )
    headings.forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [slug])
  return null
}
```

`src/components/gauges/PixelGarden.tsx` — plant grows by revealing SVG parts per stage:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { MAX_STAGE, readSections, stageFor } from '@/lib/garden'

export function PixelGarden() {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    setStage(stageFor(readSections().size))
    const onGrow = (e: Event) => setStage((e as CustomEvent<number>).detail)
    window.addEventListener('bs01-garden', onGrow)
    return () => window.removeEventListener('bs01-garden', onGrow)
  }, [])
  return (
    <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[8px] text-[var(--phosphor-dim)]">
      GARDEN
      <svg viewBox="0 0 40 30" className="mt-1 w-3/4" aria-hidden="true">
        {stage >= 1 && <path d="M20 30 L20 22" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 2 && <path d="M20 30 L20 14" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 3 && <path d="M20 24 C17 20 14 18 10 16" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 4 && <path d="M20 20 C24 16 27 14 30 12" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 5 && <circle cx="10" cy="15" r="2" fill="var(--phosphor)" />}
        {stage >= 6 && <circle cx="30" cy="11" r="2" fill="var(--phosphor)" />}
        {stage >= 7 && <circle cx="20" cy="11" r="3" fill="var(--phosphor)" />}
      </svg>
      <span aria-label={`garden stage ${stage} of ${MAX_STAGE}`}>
        STAGE {stage}/{MAX_STAGE}
        {stage === MAX_STAGE && ' ✺ IN BLOOM'}
      </span>
    </div>
  )
}
```

Fill the `{/* pixel garden: task 14 */}` slot in `GaugeCluster.tsx` with `<PixelGarden />`. In `src/app/projects/[slug]/page.tsx`, add `<GardenTracker slug={project.slug} />` inside `<main>` (import it).

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Dev check: scroll through StagePass sections → garden stages tick up; persists across pages within the tab.

- [ ] **Step 5: Commit**

```bash
git add src/lib/garden.ts src/components/gauges src/components/case-study/GardenTracker.tsx src/app/projects tests/lib/garden.test.ts
git commit -m "feat: pixel garden grows as case studies are read

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 15: Lighthouse + accessibility verification pass

**Files:**
- Modify: whatever the audits flag (`src/**`), `docs/PLAN.md` (check off completed tasks)

**Interfaces:**
- Consumes: everything. Produces: evidence the Global Constraints hold.

- [ ] **Step 1: Production build + Lighthouse on both pages**

```bash
npm run build
npm run start &
sleep 3
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo --preset=desktop --quiet --output=json --output-path=./lh-home.json
npx lighthouse http://localhost:3000/projects/stagepass --only-categories=performance,accessibility,seo --preset=desktop --quiet --output=json --output-path=./lh-case.json
node -e "for (const f of ['lh-home.json','lh-case.json']) { const r = require('./' + f); console.log(f, Object.entries(r.categories).map(([k,v]) => k + ':' + Math.round(v.score*100)).join(' ')) }"
kill %1
```

Expected: every category ≥ 95 on both pages. If not, fix and re-run (common culprits: missing `alt`/labels, contrast on `--phosphor-dim`, layout shift from the boot overlay — it must be `position:absolute`, never in flow).

- [ ] **Step 2: Contrast audit across all three themes**

For each theme, check `--phosphor-dim` on `--screen` and keycap/alert text pairs at 4.5:1 using a contrast checker (e.g. `npx colour-contrast-checker` or manual math). Record results in the PR description. Adjust dim values if any pair fails — brighten the failing `--phosphor-dim` until it passes, keep hue.

- [ ] **Step 3: Reduced-motion + keyboard sweep**

Manual checklist (macOS: System Settings → Accessibility → Display → Reduce motion):
- Boot overlay never appears with reduce-motion on.
- Cartridge navigates instantly with reduce-motion on.
- Whole site operable with Tab + Enter only; visible focus on keys, cartridges, dial, switches, form fields.

- [ ] **Step 4: Check off docs/PLAN.md items completed by this plan, add lh artifacts to .gitignore**

```bash
echo "lh-*.json" >> .gitignore
```

Mark completed checkboxes in `docs/PLAN.md`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: lighthouse + a11y verification pass

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
