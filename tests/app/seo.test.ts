import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { SITE_URL, pageMetadata, siteMetadata } from '@/lib/site'

test('site url is the canonical www host, no trailing slash', () => {
  expect(SITE_URL).toBe('https://www.brandons.sh')
})

test('robots allows everything and points at the sitemap', () => {
  const r = robots()
  expect(r.rules).toEqual({ userAgent: '*', allow: '/' })
  expect(r.sitemap).toBe('https://www.brandons.sh/sitemap.xml')
})

test('sitemap lists every public route on the canonical host', () => {
  const urls = sitemap().map((e) => e.url)
  expect(urls).toEqual([
    'https://www.brandons.sh',
    'https://www.brandons.sh/about',
    'https://www.brandons.sh/cv',
    'https://www.brandons.sh/contact',
    'https://www.brandons.sh/projects/meridian',
    'https://www.brandons.sh/projects/steward',
    'https://www.brandons.sh/projects/wordy',
    'https://www.brandons.sh/projects/cellarkeep',
    'https://www.brandons.sh/projects/misc',
    'https://www.brandons.sh/projects/stagepass',
  ])
})

test('root metadata declares base url, canonical, open graph and twitter card', () => {
  expect(String(siteMetadata.metadataBase)).toBe('https://www.brandons.sh/')
  expect(siteMetadata.alternates?.canonical).toBe('/')
  expect(siteMetadata.openGraph).toMatchObject({
    type: 'website',
    siteName: 'Brandon Smith ▪ BS-01 Field Terminal',
    url: '/',
  })
  expect(siteMetadata.twitter).toMatchObject({ card: 'summary_large_image' })
})

test('pageMetadata gives each route its own canonical and share card text', () => {
  const m = pageMetadata({ title: 'About', description: 'd', path: '/about' })
  expect(m.alternates?.canonical).toBe('/about')
  expect(m.openGraph).toMatchObject({ title: 'About', description: 'd', url: '/about' })
  expect(m.twitter).toMatchObject({ title: 'About', description: 'd' })
})

test('pageMetadata pins the site share image so sub-routes get a card too', () => {
  const m = pageMetadata({ title: 'About', description: 'd', path: '/about' })
  const og = m.openGraph as { images?: { url: string; width: number; height: number }[] }
  expect(og.images?.[0]).toMatchObject({ url: '/opengraph-image', width: 1200, height: 630 })
  const tw = m.twitter as { images?: string[] }
  expect(tw.images).toEqual(['/opengraph-image'])
})
