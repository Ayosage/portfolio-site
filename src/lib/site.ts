import type { Metadata } from 'next'

// Canonical host. Vercel redirects the apex to www; everything we emit
// (canonical, sitemap, Open Graph url) must agree with that.
export const SITE_URL = 'https://www.brandon.party'

export const SITE_NAME = 'Brandon Smith ▪ BS-01 Field Terminal'
export const SITE_DESCRIPTION =
  'Brandon Smith, full-stack engineer in Philadelphia. Java, TypeScript and AWS at JPMorgan Chase. Side projects: a board game, a Discord bot, a winemaking tracker.'

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s ▪ Brandon Smith',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
}

// Per-route metadata. Sub-routes don't inherit alternates/openGraph from the
// layout in practice, so every page declares its own canonical and share text.
export function pageMetadata(p: { title: string; description: string; path: string }): Metadata {
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: p.title,
      description: p.description,
      url: p.path,
      locale: 'en_US',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.description,
      images: ['/opengraph-image'],
    },
  }
}
