'use client'
import { useEffect, useState } from 'react'
import type { Icon, NoFix, Reading } from '@/lib/weather'

type State = { status: 'loading' } | { status: 'nofix' } | { status: 'ok'; r: Reading }

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315]
function Sun() {
  return (
    <g>
      <circle cx="17" cy="15" r="5" className="fill" />
      {RAYS.map((a) => {
        const r = (a * Math.PI) / 180
        return <line key={a} x1={17 + Math.cos(r) * 7.5} y1={15 + Math.sin(r) * 7.5} x2={17 + Math.cos(r) * 9.5} y2={15 + Math.sin(r) * 9.5} />
      })}
    </g>
  )
}
const Moon = () => <path className="fill" d="M20 8 A8 8 0 1 0 26 20 A6.5 6.5 0 0 1 20 8 Z" />
const Cloud = ({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) => (
  <path className="fill" d={`M${9 + dx} ${25 + dy} h14 a4.5 4.5 0 0 0 0 -9 a6 6 0 0 0 -11.5 -1.5 a4.5 4.5 0 0 0 -2.5 10.5 z`} />
)

export function WeatherIcon({ icon }: { icon: Icon }) {
  let body: React.ReactNode
  switch (icon) {
    case 'sun':
      body = <Sun />
      break
    case 'moon':
      body = <Moon />
      break
    case 'partly':
      body = (
        <>
          <g transform="translate(-4 -5) scale(.9)">
            <Sun />
          </g>
          <Cloud dx={4} dy={2} />
        </>
      )
      break
    case 'fog':
      body = (
        <>
          <Cloud dx={4} dy={-4} />
          <line x1="8" y1="26" x2="26" y2="26" />
          <line x1="11" y1="30" x2="23" y2="30" />
        </>
      )
      break
    case 'rain':
      body = (
        <>
          <Cloud dx={4} dy={-2} />
          <line x1="12" y1="27" x2="10" y2="32" />
          <line x1="18" y1="27" x2="16" y2="32" />
          <line x1="24" y1="27" x2="22" y2="32" />
        </>
      )
      break
    case 'snow':
      body = (
        <>
          <Cloud dx={4} dy={-2} />
          <circle cx="12" cy="29" r="1" />
          <circle cx="18" cy="31" r="1" />
          <circle cx="24" cy="29" r="1" />
        </>
      )
      break
    case 'storm':
      body = (
        <>
          <Cloud dx={4} dy={-3} />
          <path d="M18 24 l-3 5 h4 l-3 5" />
        </>
      )
      break
    case 'wind':
      body = (
        <>
          <path d="M5 13 h16 a3.5 3.5 0 1 0 -3.5 -3.5" />
          <path d="M5 19 h20 a3.5 3.5 0 1 1 -3.5 3.5" />
          <path d="M9 25 h10 a3 3 0 1 1 -3 3" />
        </>
      )
      break
    default:
      body = (
        <>
          <Cloud dx={2} dy={-2} />
          <Cloud dx={6} dy={6} />
        </>
      )
  }
  return (
    <svg viewBox="0 0 34 34" className="wx-icon" aria-hidden="true">
      {body}
    </svg>
  )
}

/** Local conditions from Open-Meteo via /api/weather (Vercel geo headers). */
export function Weather() {
  const [state, setState] = useState<State>({ status: 'loading' })
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/api/weather')
        const json = (await res.json()) as Reading | NoFix
        if (!alive) return
        setState(json.ok ? { status: 'ok', r: json } : { status: 'nofix' })
      } catch {
        if (alive) setState({ status: 'nofix' })
      }
    }
    void load()
    const id = setInterval(load, 10 * 60_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])
  return (
    <div className="well" role="group" aria-label="weather">
      <div className="flex items-baseline justify-between">
        <span>WEATHER</span>
        {state.status === 'ok' && state.r.city && (
          <span className="max-w-[60%] truncate text-[8px] tracking-[0.14em] opacity-80">{state.r.city.toUpperCase()}</span>
        )}
      </div>
      {state.status === 'ok' ? (
        <div className="mt-1 grid grid-cols-[34px_1fr] items-center gap-x-2 gap-y-0.5">
          <span className="row-span-2 hidden sm:block">
            <WeatherIcon icon={state.r.icon} />
          </span>
          <span className="well-val text-[14px] leading-none">{state.r.temp}°C</span>
          <span className="truncate text-[9px] tracking-[0.08em] text-[var(--phosphor)]">{state.r.label}</span>
          <span className="col-span-full mt-0.5 hidden text-[9px] tracking-[0.08em] sm:block">
            WIND {state.r.wind} · HUM {state.r.hum}%
          </span>
        </div>
      ) : (
        <div className="well-val" aria-busy={state.status === 'loading'}>
          {state.status === 'loading' ? <span className="opacity-60">READING…</span> : 'NO FIX'}
        </div>
      )}
    </div>
  )
}
