import { securityHeaders } from '@/lib/headers'

const byKey = Object.fromEntries(securityHeaders().map((h) => [h.key, h.value]))

test('every response carries the baseline hardening headers', () => {
  expect(byKey['X-Content-Type-Options']).toBe('nosniff')
  expect(byKey['X-Frame-Options']).toBe('DENY')
  expect(byKey['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
  expect(byKey['Permissions-Policy']).toMatch(/camera=\(\)/)
  expect(byKey['Permissions-Policy']).toMatch(/microphone=\(\)/)
  expect(byKey['Permissions-Policy']).toMatch(/geolocation=\(\)/)
})

test('content security policy locks the dangerous directives', () => {
  const csp = byKey['Content-Security-Policy']
  expect(csp).toMatch(/default-src 'self'/)
  expect(csp).toMatch(/frame-ancestors 'none'/)
  expect(csp).toMatch(/object-src 'none'/)
  expect(csp).toMatch(/base-uri 'self'/)
  expect(csp).toMatch(/form-action 'self'/)
  expect(csp).toMatch(/upgrade-insecure-requests/)
  // No external script hosts, ever.
  expect(csp).toMatch(/script-src 'self'[^;]*;/)
  expect(csp).not.toMatch(/script-src[^;]*https?:/)
})
