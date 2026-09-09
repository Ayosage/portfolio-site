import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { openMeteoUrl, parseGeo, toReading } from '@/lib/weather'

export const dynamic = 'force-dynamic'

export async function GET() {
  const geo = parseGeo(await headers())
  if (!geo) return NextResponse.json({ ok: false }, { headers: { 'Cache-Control': 'private, no-store' } })
  try {
    const res = await fetch(openMeteoUrl(geo), { next: { revalidate: 600 } })
    if (!res.ok) return NextResponse.json({ ok: false })
    const reading = toReading(await res.json(), geo.city)
    return NextResponse.json(reading, {
      headers: { 'Cache-Control': 'private, max-age=600' },
    })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
