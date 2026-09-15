import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { clientKeyFrom, createLimiter } from '@/lib/ratelimit'
import { createTtlCache } from '@/lib/ttl-cache'
import { openMeteoUrl, parseGeo, toReading, type NoFix, type Reading } from '@/lib/weather'

export const dynamic = 'force-dynamic'

const TTL_MS = 10 * 60_000

// The gauge polls once every ten minutes, so this is generous for a real
// visitor and tight for a script. Per visitor: 10 reads per 5 minutes.
// Site-wide: 600 per hour, a ceiling on what any burst can cost the free
// Open-Meteo quota. In-memory, so on serverless it is per warm instance.
const limiter = createLimiter({
  perKey: { max: 10, windowMs: 5 * 60_000 },
  global: { max: 600, windowMs: 60 * 60_000 },
})

// One upstream call per location per TTL, however many visitors share it.
// Keyed by the request URL, which already rounds the coordinates to 3 places.
const readings = createTtlCache<Reading | NoFix>({ ttlMs: TTL_MS, max: 500 })

const PRIVATE = { 'Cache-Control': `private, max-age=${TTL_MS / 1000}` }
const noFix = (init?: ResponseInit) => NextResponse.json({ ok: false } satisfies NoFix, init)

export async function GET() {
  const h = await headers()
  const geo = parseGeo(h)
  if (!geo) return noFix({ headers: { 'Cache-Control': 'private, no-store' } })

  const url = openMeteoUrl(geo)
  const cached = readings.get(url)
  if (cached) return NextResponse.json(cached, { headers: PRIVATE })

  // Only a cache miss can reach Open-Meteo, so only a miss spends budget.
  if (!limiter.allow(clientKeyFrom(h))) {
    return noFix({
      status: 429,
      headers: { 'Cache-Control': 'private, no-store', 'Retry-After': '60' },
    })
  }

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return noFix({ headers: { 'Cache-Control': 'private, no-store' } })
    const reading = toReading(await res.json(), geo.city)
    readings.set(url, reading)
    return NextResponse.json(reading, { headers: PRIVATE })
  } catch {
    return noFix({ headers: { 'Cache-Control': 'private, no-store' } })
  }
}
