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
