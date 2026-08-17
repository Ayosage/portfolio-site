import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeDial } from '@/components/gauges/ThemeDial'

test('cycles themes and persists', async () => {
  document.documentElement.dataset.theme = 'green'
  localStorage.clear()
  render(<ThemeDial />)
  const dial = screen.getByRole('button', { name: /theme/i })
  await userEvent.click(dial)
  expect(document.documentElement.dataset.theme).toBe('amber')
  expect(localStorage.getItem('bs01-theme')).toBe('amber')
  await userEvent.click(dial)
  expect(document.documentElement.dataset.theme).toBe('paper')
  await userEvent.click(dial)
  expect(document.documentElement.dataset.theme).toBe('green')
})
