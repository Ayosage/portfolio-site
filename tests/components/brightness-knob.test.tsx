import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrightnessKnob } from '@/components/gauges/BrightnessKnob'

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.brightness
})

test('knob reads the level already stamped on the page', () => {
  document.documentElement.dataset.brightness = '5'
  render(<BrightnessKnob />)
  expect(screen.getByRole('button', { name: /brightness/i })).toHaveTextContent(/5 of 5/)
})

test('each turn steps the level up, wraps after 5, and persists', async () => {
  document.documentElement.dataset.brightness = '4'
  render(<BrightnessKnob />)
  const knob = screen.getByRole('button', { name: /brightness/i })
  await userEvent.click(knob)
  expect(document.documentElement.dataset.brightness).toBe('5')
  expect(localStorage.getItem('bs01-brightness')).toBe('5')
  await userEvent.click(knob)
  expect(document.documentElement.dataset.brightness).toBe('1')
  expect(knob).toHaveTextContent(/1 of 5/)
})
