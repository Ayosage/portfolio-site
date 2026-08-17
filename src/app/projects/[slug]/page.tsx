import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { PROJECTS } from '@/lib/projects'
import { EscBack } from '@/components/case-study/EscBack'
import { GardenTracker } from '@/components/case-study/GardenTracker'
import Stagepass from '../../../../content/projects/stagepass.mdx'

const CASE_STUDIES: Record<string, ComponentType> = {
  stagepass: Stagepass,
}

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.hasCaseStudy).map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

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
      <GardenTracker slug={project.slug} />
      <EscBack />
      <p className="flex justify-between border-b border-[var(--hairline)] pb-2 text-[10px] text-[var(--phosphor-dim)]">
        <span>~/work/{project.slug}</span>
        <span>[ESC] BACK</span>
      </p>
      <h1 className="phosphor-glow mt-4 text-4xl font-bold uppercase tracking-tighter sm:text-6xl">
        {project.title}
      </h1>
      <Content />
    </main>
  )
}
