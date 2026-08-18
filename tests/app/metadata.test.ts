import { vi } from 'vitest'
vi.mock('../../content/projects/stagepass.mdx', () => ({ default: () => null }))

import { metadata as aboutMeta } from '@/app/about/page'
import { metadata as contactMeta } from '@/app/contact/page'
import { generateMetadata } from '@/app/projects/[slug]/page'

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
