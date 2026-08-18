import { keysEnabled, setKeysEnabled } from '@/lib/keys'

test('keyboard shortcuts enabled by default', () => {
  expect(keysEnabled()).toBe(true)
})

test('setKeysEnabled flips the flag', () => {
  setKeysEnabled(false)
  expect(keysEnabled()).toBe(false)
  setKeysEnabled(true)
  expect(keysEnabled()).toBe(true)
})
