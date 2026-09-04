import { render, screen } from '@testing-library/react'
import { GaugeCluster } from '@/components/gauges/GaugeCluster'

test('column carries the scope, the brightness knob and a decorative grille below the four wells', () => {
  const { container } = render(<GaugeCluster />)
  expect(screen.getByText('SCOPE')).toBeInTheDocument()
  expect(screen.getByRole('img', { name: /scope/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /brightness/i })).toBeInTheDocument()
  const grille = container.querySelector('[data-grille]')
  expect(grille).not.toBeNull()
  expect(grille).toHaveAttribute('aria-hidden', 'true')
})
