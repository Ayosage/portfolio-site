// Procedural phosphor plants for the bench. Deterministic per seed so the
// garden looks the same on every visit and only ever grows.
export type Segment = {
  d: string
  kind: 'stem' | 'leaf'
  width: number
  /** Growth order; lower draws first. */
  order: number
}

export function mulberry32(seed: number): () => number {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n: number) => n.toFixed(1)

export function makePlant(seed: number, x0: number, y0: number, height: number, lean: number): Segment[] {
  const rnd = mulberry32(seed)
  const segs: Segment[] = []
  function stem(x: number, y: number, angle: number, len: number, depth: number, order: number) {
    const steps = depth === 0 ? 8 : 4
    let cx = x
    let cy = y
    let a = angle
    for (let i = 0; i < steps; i++) {
      const l = len * (1 - i * 0.07)
      a += (rnd() - 0.5) * 0.38 + lean * 0.06
      const nx = cx + Math.cos(a) * l
      const ny = cy + Math.sin(a) * l
      const bow = (rnd() - 0.5) * 8
      const mx = (cx + nx) / 2 + Math.cos(a + Math.PI / 2) * bow
      const my = (cy + ny) / 2 + Math.sin(a + Math.PI / 2) * bow
      const o = order + i * 3 + depth * 2
      segs.push({
        d: `M${f(cx)} ${f(cy)} Q${f(mx)} ${f(my)} ${f(nx)} ${f(ny)}`,
        kind: 'stem',
        width: Math.max(0.8, 2.4 - depth * 0.7 - i * 0.1),
        order: o,
      })
      if (i > 0 && rnd() < 0.72) {
        const side = rnd() < 0.5 ? 1 : -1
        const la = a + side * 1.15
        const ll = 10 - depth * 2 + rnd() * 5
        const lx = nx + Math.cos(la) * ll
        const ly = ny + Math.sin(la) * ll
        const c1x = nx + Math.cos(la - side * 0.7) * ll * 0.65
        const c1y = ny + Math.sin(la - side * 0.7) * ll * 0.65
        const c2x = nx + Math.cos(la + side * 0.7) * ll * 0.65
        const c2y = ny + Math.sin(la + side * 0.7) * ll * 0.65
        segs.push({
          d: `M${f(nx)} ${f(ny)} Q${f(c1x)} ${f(c1y)} ${f(lx)} ${f(ly)} Q${f(c2x)} ${f(c2y)} ${f(nx)} ${f(ny)}`,
          kind: 'leaf',
          width: 0.9,
          order: o + 1,
        })
      }
      if (depth < 2 && i >= 2 && rnd() < 0.5) {
        stem(nx, ny, a + (rnd() < 0.5 ? 1 : -1) * (0.55 + rnd() * 0.4), l * 0.68, depth + 1, o + 2)
      }
      cx = nx
      cy = ny
    }
  }
  stem(x0, y0, -Math.PI / 2 + lean * 0.35, height / 8, 0, 0)
  return segs
}

export const RIG_MAX_WIDTH = 1080
/** Bench is only visible beside the rig; below this margin there is no room. */
export const MIN_MARGIN = 48

/** Six plants, three each side, interleaved so both sides grow together. */
export function layoutGarden(viewportW: number, viewportH: number): Segment[] {
  const margin = (viewportW - Math.min(viewportW, RIG_MAX_WIDTH)) / 2
  if (margin < MIN_MARGIN) return []
  const spots: [number, number, number][] = [
    [margin * 0.35, 1, 0.15],
    [margin * 0.75, 2, 0.35],
    [margin * 0.55, 3, -0.1],
    [viewportW - margin * 0.35, 4, -0.15],
    [viewportW - margin * 0.75, 5, -0.35],
    [viewportW - margin * 0.55, 6, 0.1],
  ]
  const all: Segment[] = []
  spots.forEach(([x, seed, lean], i) => {
    for (const s of makePlant(seed * 7919 + 13, x, viewportH + 2, viewportH * (0.55 + (seed % 3) * 0.12), lean)) {
      all.push({ ...s, order: s.order + i * 0.37 })
    }
  })
  return all.sort((a, b) => a.order - b.order)
}

export const INTERACTIONS_PER_SEGMENT = 3
export const STARTER_SEGMENTS = 4

export function visibleSegments(growth: number, total: number): number {
  return Math.min(total, STARTER_SEGMENTS + Math.floor(Math.max(0, growth) / INTERACTIONS_PER_SEGMENT))
}
