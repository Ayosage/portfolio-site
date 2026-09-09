// Weather gauge data. Location comes from Vercel's request geo headers, never
// the browser (Permissions-Policy keeps geolocation off). Conditions come from
// Open-Meteo, which is free and keyless.
export type Geo = { lat: number; lon: number; city: string | null }
export type Icon = 'sun' | 'moon' | 'partly' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm' | 'wind'
export type Reading = {
  ok: true
  temp: number
  label: string
  icon: Icon
  wind: number
  hum: number
  city: string | null
}
export type NoFix = { ok: false }

type HeaderBag = { get(name: string): string | null }

export function parseGeo(h: HeaderBag): Geo | null {
  const lat = Number(h.get('x-vercel-ip-latitude'))
  const lon = Number(h.get('x-vercel-ip-longitude'))
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) return null
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null
  const raw = h.get('x-vercel-ip-city')
  let city: string | null = null
  if (raw) {
    try {
      city = decodeURIComponent(raw)
    } catch {
      city = raw
    }
  }
  return { lat, lon, city }
}

/** WMO weather interpretation codes → label + icon. */
export function describe(code: number, isDay: boolean, windKmh: number): { label: string; icon: Icon } {
  if (code === 0) return { label: 'CLEAR', icon: isDay ? 'sun' : 'moon' }
  if (code === 1 || code === 2) return { label: 'PARTLY CLOUDY', icon: 'partly' }
  if (code === 3) return { label: 'OVERCAST', icon: 'cloud' }
  if (code === 45 || code === 48) return { label: 'FOG', icon: 'fog' }
  if (code >= 51 && code <= 57) return { label: 'DRIZZLE', icon: 'rain' }
  if (code >= 61 && code <= 67) return { label: 'RAIN', icon: 'rain' }
  if (code >= 71 && code <= 77) return { label: 'SNOW', icon: 'snow' }
  if (code >= 80 && code <= 82) return { label: 'SHOWERS', icon: 'rain' }
  if (code === 85 || code === 86) return { label: 'SNOW SHOWERS', icon: 'snow' }
  if (code >= 95 && code <= 99) return { label: 'THUNDERSTORM', icon: 'storm' }
  if (windKmh >= 30) return { label: 'WINDY', icon: 'wind' }
  return { label: 'UNKNOWN', icon: 'cloud' }
}

export function openMeteoUrl(g: Geo): string {
  const p = new URLSearchParams({
    latitude: g.lat.toFixed(3),
    longitude: g.lon.toFixed(3),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
    wind_speed_unit: 'kmh',
  })
  return `https://api.open-meteo.com/v1/forecast?${p}`
}

type OpenMeteo = {
  current?: {
    temperature_2m?: number
    relative_humidity_2m?: number
    weather_code?: number
    wind_speed_10m?: number
    is_day?: number
  }
}

export function toReading(json: OpenMeteo, city: string | null): Reading | NoFix {
  const c = json.current
  if (!c || typeof c.temperature_2m !== 'number' || typeof c.weather_code !== 'number') return { ok: false }
  const wind = Math.round(c.wind_speed_10m ?? 0)
  const { label, icon } = describe(c.weather_code, (c.is_day ?? 1) === 1, wind)
  return {
    ok: true,
    temp: Math.round(c.temperature_2m),
    label,
    icon,
    wind,
    hum: Math.round(c.relative_humidity_2m ?? 0),
    city,
  }
}
