import type { MetadataRoute } from 'next'
import { PROJECTS } from '@/lib/projects'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/about', '/contact']
  const studies = PROJECTS.filter((p) => p.hasCaseStudy).map((p) => `/projects/${p.slug}`)
  return [...pages, ...studies].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))
}
