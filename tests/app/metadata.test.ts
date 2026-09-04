import { vi } from 'vitest'
vi.mock('../../content/projects/stagepass.mdx', () => ({ default: () => null }))
vi.mock('../../content/projects/meridian.mdx', () => ({ default: () => null }))
vi.mock('../../content/projects/steward.mdx', () => ({ default: () => null }))
vi.mock('../../content/projects/cellarkeep.mdx', () => ({ default: () => null }))

import { metadata as aboutMeta } from '@/app/about/page'
import { metadata as contactMeta } from '@/app/contact/page'
import { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page'

test('about page has its own title', () => {
  expect(String(aboutMeta.title)).toMatch(/about/i)
})

test('contact page has its own title', () => {
  expect(String(contactMeta.title)).toMatch(/contact/i)
})

test('case study title names the project', async () => {
  const meta = await generateMetadata({
    params: Promise.resolve({ slug: 'stagepass' }),
  })
  expect(String(meta.title)).toMatch(/StagePass/)
})

test('all four case studies are statically generated', () => {
  expect(generateStaticParams().map((p) => p.slug)).toEqual(['meridian', 'steward', 'cellarkeep', 'stagepass'])
})

test('meridian case study title names the project', async () => {
  const meta = await generateMetadata({ params: Promise.resolve({ slug: 'meridian' }) })
  expect(String(meta.title)).toMatch(/Meridian/)
})

test('about and contact carry their own canonical path', () => {
  expect(aboutMeta.alternates?.canonical).toBe('/about')
  expect(contactMeta.alternates?.canonical).toBe('/contact')
})

test('case study canonical and share url point at the case study, not the home page', async () => {
  const meta = await generateMetadata({ params: Promise.resolve({ slug: 'meridian' }) })
  expect(meta.alternates?.canonical).toBe('/projects/meridian')
  expect(meta.openGraph).toMatchObject({ url: '/projects/meridian', title: 'Meridian' })
})
