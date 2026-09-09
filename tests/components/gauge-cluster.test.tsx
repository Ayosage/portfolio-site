import { render, screen } from '@testing-library/react'
import { GaugeCluster } from '@/components/gauges/GaugeCluster'

test('column carries solar, uptime, weather, status, the scope, the brightness knob and a grille', () => {
  const { container } = render(<GaugeCluster />)
  expect(screen.getByText('SOLAR')).toBeInTheDocument()
  expect(screen.getByText('UPTIME')).toBeInTheDocument()
  expect(screen.getByRole('group', { name: /weather/i })).toBeInTheDocument()
  expect(screen.getByText('STATUS')).toBeInTheDocument()
  expect(screen.getByText('SCOPE')).toBeInTheDocument()
  expect(screen.getByRole('img', { name: /scope/i })).toBeInTheDocument()
  expect(screen.getByRole('slider', { name: /brightness/i })).toBeInTheDocument()
  const grille = container.querySelector('[data-grille]')
  expect(grille).not.toBeNull()
  expect(grille).toHaveAttribute('aria-hidden', 'true')
})

test('there is no theme dial: green is the only phosphor', () => {
  render(<GaugeCluster />)
  expect(screen.queryByText(/THEME/)).not.toBeInTheDocument()
})

test('weather shows NO FIX when the route cannot place the visitor', async () => {
  render(<GaugeCluster />)
  expect(await screen.findByText('NO FIX')).toBeInTheDocument()
})
