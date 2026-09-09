import { describe as describeCode, openMeteoUrl, parseGeo, toReading } from '@/lib/weather'

const bag = (o: Record<string, string>) => ({ get: (k: string) => o[k] ?? null })

test('geo comes from the Vercel headers, with the city url-decoded', () => {
  expect(parseGeo(bag({ 'x-vercel-ip-latitude': '39.95', 'x-vercel-ip-longitude': '-75.17', 'x-vercel-ip-city': 'Philadelphia' }))).toEqual({
    lat: 39.95,
    lon: -75.17,
    city: 'Philadelphia',
  })
  expect(parseGeo(bag({ 'x-vercel-ip-latitude': '48.85', 'x-vercel-ip-longitude': '2.35', 'x-vercel-ip-city': 'Saint-%C3%89tienne' }))?.city).toBe('Saint-Étienne')
})

test('missing, junk, or null-island coordinates mean no fix', () => {
  expect(parseGeo(bag({}))).toBeNull()
  expect(parseGeo(bag({ 'x-vercel-ip-latitude': 'x', 'x-vercel-ip-longitude': '1' }))).toBeNull()
  expect(parseGeo(bag({ 'x-vercel-ip-latitude': '0', 'x-vercel-ip-longitude': '0' }))).toBeNull()
  expect(parseGeo(bag({ 'x-vercel-ip-latitude': '95', 'x-vercel-ip-longitude': '10' }))).toBeNull()
})

test('WMO codes map to a label and a vector icon, day or night', () => {
  expect(describeCode(0, true, 5)).toEqual({ label: 'CLEAR', icon: 'sun' })
  expect(describeCode(0, false, 5)).toEqual({ label: 'CLEAR', icon: 'moon' })
  expect(describeCode(2, true, 5).icon).toBe('partly')
  expect(describeCode(3, true, 5).icon).toBe('cloud')
  expect(describeCode(63, true, 5).label).toBe('RAIN')
  expect(describeCode(73, true, 5).icon).toBe('snow')
  expect(describeCode(95, true, 5).icon).toBe('storm')
  expect(describeCode(999, true, 40)).toEqual({ label: 'WINDY', icon: 'wind' })
})

test('reading rounds the numbers and keeps the city', () => {
  const r = toReading(
    { current: { temperature_2m: 18.6, relative_humidity_2m: 63.4, weather_code: 1, wind_speed_10m: 12.2, is_day: 1 } },
    'Philadelphia',
  )
  expect(r).toEqual({ ok: true, temp: 19, label: 'PARTLY CLOUDY', icon: 'partly', wind: 12, hum: 63, city: 'Philadelphia' })
  expect(toReading({}, null)).toEqual({ ok: false })
})

test('request asks Open-Meteo for the current fields in km/h', () => {
  const url = new URL(openMeteoUrl({ lat: 39.95, lon: -75.17, city: null }))
  expect(url.host).toBe('api.open-meteo.com')
  expect(url.searchParams.get('current')).toContain('weather_code')
  expect(url.searchParams.get('wind_speed_unit')).toBe('kmh')
})
