// Security headers applied to every response (wired in next.config.ts).
//
// CSP notes: pages are statically prerendered, and Next inlines its own
// hydration scripts (self.__next_f.push) plus our theme-boot script in
// layout.tsx. Hashing those is not stable across builds and a nonce would
// force dynamic rendering, so script-src keeps 'unsafe-inline' — but names no
// external host, so injected <script src> from anywhere else is still blocked.
// Style needs 'unsafe-inline' for style="" attributes (Next's own and a few of
// ours). Everything else is 'self'. Revisit script-src if a nonce-friendly
// static story lands in Next.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

export function securityHeaders(): { key: string; value: string }[] {
  return [
    { key: 'Content-Security-Policy', value: CSP },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    },
  ]
}
