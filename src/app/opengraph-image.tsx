import { ImageResponse } from 'next/og'
import { SITE_DESCRIPTION } from '@/lib/site'

// Site-wide share card: the BS-01 bezel and CRT glass in the default green
// theme. Case-study routes inherit it. Rendered at build time by next/og
// (Satori), which only knows flexbox — no grid, no CSS vars.
export const alt = 'Brandon Smith ▪ BS-01 Field Terminal'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const chassis = '#23261d'
const well = '#1b1e15'
const screen = '#0d110b'
const phosphor = '#d8f26e'
const dim = '#8fa05c'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: chassis,
          padding: 36,
          fontFamily: 'monospace',
          color: phosphor,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            letterSpacing: 4,
            color: dim,
            paddingBottom: 18,
          }}
        >
          <span>BS-01 ▪ FIELD TERMINAL</span>
          <span>SCANLINES ● SOUND ○ KEYS ●</span>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: screen,
            border: `6px solid ${well}`,
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)',
            padding: '40px 56px',
          }}
        >
          <div style={{ fontSize: 22, color: dim, display: 'flex' }}>~/brandon-smith</div>
          <div
            style={{
              display: 'flex',
              fontSize: 148,
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: -6,
              marginTop: 18,
              textShadow: `0 0 28px rgba(216,242,110,0.45)`,
            }}
          >
            BRANDON SMITH
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: dim, marginTop: 28, maxWidth: 900 }}>
            {'// ' + SITE_DESCRIPTION.toLowerCase()}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 18,
            letterSpacing: 5,
            color: dim,
            paddingTop: 16,
          }}
        >
          MADE BY HAND ▪ RUNS ON SUNLIGHT ▪ www.brandon.party
        </div>
      </div>
    ),
    size,
  )
}
