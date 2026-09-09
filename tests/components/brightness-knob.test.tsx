import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrightnessKnob } from '@/components/gauges/BrightnessKnob'

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.brightness
})

test('knob reads the level already stamped on the page', () => {
  document.documentElement.dataset.brightness = '5'
  render(<BrightnessKnob />)
  expect(screen.getByRole('slider', { name: /brightness/i })).toHaveAttribute('aria-valuenow', '5')
  expect(screen.getByText('5/5')).toBeInTheDocument()
})

test('a click steps the level up, wraps after 5, and persists', async () => {
  document.documentElement.dataset.brightness = '4'
  render(<BrightnessKnob />)
  const knob = screen.getByRole('slider', { name: /brightness/i })
  await userEvent.click(knob)
  expect(document.documentElement.dataset.brightness).toBe('5')
  expect(localStorage.getItem('bs01-brightness')).toBe('5')
  await userEvent.click(knob)
  expect(document.documentElement.dataset.brightness).toBe('1')
  expect(knob).toHaveAttribute('aria-valuenow', '1')
})

test('arrow keys nudge one detent and stop at the ends', () => {
  document.documentElement.dataset.brightness = '4'
  render(<BrightnessKnob />)
  const knob = screen.getByRole('slider', { name: /brightness/i })
  fireEvent.keyDown(knob, { key: 'ArrowRight' })
  expect(knob).toHaveAttribute('aria-valuenow', '5')
  fireEvent.keyDown(knob, { key: 'ArrowRight' })
  expect(knob).toHaveAttribute('aria-valuenow', '5')
  fireEvent.keyDown(knob, { key: 'ArrowLeft' })
  expect(knob).toHaveAttribute('aria-valuenow', '4')
  expect(document.documentElement.dataset.brightness).toBe('4')
})

test('the detent ring lights up to the current level', () => {
  document.documentElement.dataset.brightness = '3'
  const { container } = render(<BrightnessKnob />)
  expect(container.querySelectorAll('.dial-ticks line.on')).toHaveLength(3)
})
