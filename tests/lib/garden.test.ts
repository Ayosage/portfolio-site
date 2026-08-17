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
