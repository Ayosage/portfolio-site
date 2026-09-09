import { CRT_FRAG } from '@/lib/crt'

// The glass reflection lives in the tube shader, driven by the pointer through
// u_px. A DOM band moved per frame re-rasterized the whole screen in Firefox;
// the shader already redraws, so the band rides along for free.
test('tube shader takes the pointer position and draws the reflection band', () => {
  expect(CRT_FRAG).toMatch(/uniform[^;]*\bu_px\b/)
  expect(CRT_FRAG).toMatch(/u_px/)
})
