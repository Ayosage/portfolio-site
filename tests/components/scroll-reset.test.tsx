import { vi } from 'vitest'
let pathname = '/'
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
}))

import { render } from '@testing-library/react'
import { useRef } from 'react'
import { ScrollReset } from '@/components/screen/ScrollReset'

function Harness() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} data-testid="pane">
      <ScrollReset paneRef={ref} />
    </div>
  )
}

test('scroll pane jumps back to top when the route changes', () => {
  pathname = '/'
  const { getByTestId, rerender } = render(<Harness />)
  const pane = getByTestId('pane')
  pane.scrollTop = 400
  pathname = '/about'
  rerender(<Harness />)
  expect(pane.scrollTop).toBe(0)
})
