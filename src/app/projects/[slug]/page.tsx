import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { PROJECTS } from '@/lib/projects'
import { pageMetadata } from '@/lib/site'
import { EscBack } from '@/components/case-study/EscBack'
import { LinkAnchor } from '@/components/case-study/LinkAnchor'
import Stagepass from '../../../../content/projects/stagepass.mdx'
import Meridian from '../../../../content/projects/meridian.mdx'
import Steward from '../../../../content/projects/steward.mdx'
import Wordy from '../../../../content/projects/wordy.mdx'
import Cellarkeep from '../../../../content/projects/cellarkeep.mdx'

const CASE_STUDIES: Record<string, ComponentType> = {
  stagepass: Stagepass,
  meridian: Meridian,
  steward: Steward,
  wordy: Wordy,
  cellarkeep: Cellarkeep,
}

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.slug in CASE_STUDIES).map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug)
  if (!project) return {}
  return pageMetadata({
    title: project.title,
    description: project.oneLiner,
    path: `/projects/${project.slug}`,
  })
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug && p.hasCaseStudy)
  const Content = CASE_STUDIES[slug]
  if (!project || !Content) notFound()
  return (
    <main className="p-4 sm:p-6">
      <p className="flex justify-between border-b border-[var(--hairline)] pb-2 text-[11px] text-[var(--phosphor-dim)]">
        <span>~/work/{project.slug}</span>
        <EscBack />
      </p>
      <h1 className="phosphor-glow mt-4 text-4xl font-bold uppercase tracking-tighter sm:text-6xl">
        {project.title}
      </h1>
      {project.links && project.links.length > 0 && (
        <p className="mt-1 flex flex-wrap gap-x-6 text-[11px] tracking-[0.08em]" data-testid="project-links">
          {project.links.map((l) => (
            <LinkAnchor key={l.label + l.href} label={l.label} href={l.href} />
          ))}
        </p>
      )}
      <Content />
    </main>
  )
}
