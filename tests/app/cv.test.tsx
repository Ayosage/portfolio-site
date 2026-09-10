import { render, screen, within } from '@testing-library/react'
import Cv, { metadata } from '@/app/cv/page'
import { CV } from '@/lib/cv'
import { PROJECTS } from '@/lib/projects'

test('cv opens with the ~/cv path line like every other screen', () => {
  render(<Cv />)
  expect(screen.getByText('~/cv')).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 1, name: /^cv$/i })).toBeInTheDocument()
})

test('download control saves the PDF under a real filename; open control uses a new window', () => {
  render(<Cv />)
  const download = screen.getByRole('link', { name: /download/i })
  expect(download).toHaveAttribute('href', '/resume.pdf')
  expect(download).toHaveAttribute('download', CV.pdf.filename)
  expect(download).not.toHaveAttribute('target')

  const open = screen.getByRole('link', { name: /open/i })
  expect(open).toHaveAttribute('href', '/resume.pdf')
  expect(open).toHaveAttribute('target', '_blank')
  expect(open).toHaveAttribute('rel', expect.stringContaining('noopener'))
})

test('cv renders every section as a heading', () => {
  render(<Cv />)
  for (const name of ['experience', 'projects', 'skills', 'education', 'ports']) {
    expect(screen.getByRole('heading', { level: 2, name: new RegExp(name, 'i') })).toBeInTheDocument()
  }
})

test('skills come from the cv data as a labelled table', () => {
  render(<Cv />)
  const table = screen.getByRole('table', { name: /skills/i })
  for (const [label, items] of CV.skills) {
    expect(within(table).getByRole('rowheader', { name: new RegExp(label, 'i') })).toBeInTheDocument()
    expect(within(table).getByText(items)).toBeInTheDocument()
  }
})

test('projects list every case study with an in-app link', () => {
  render(<Cv />)
  for (const p of PROJECTS.filter((p) => p.hasCaseStudy)) {
    const row = screen.getByText(p.title.toUpperCase()).closest('li')!
    expect(row).toHaveTextContent(p.oneLiner)
    const link = within(row).getByRole('link')
    expect(link).toHaveAttribute('href', `/projects/${p.slug}`)
    expect(link).not.toHaveAttribute('target')
  }
})

test('experience and education render entries when present and a designed empty state when not', () => {
  render(<Cv />)
  for (const [key, label] of [
    ['experience', /experience/i],
    ['education', /education/i],
  ] as const) {
    const section = screen.getByRole('heading', { level: 2, name: label }).closest('section')!
    const entries = CV[key]
    if (entries.length === 0) {
      expect(within(section).getByText(/no entries on file/i)).toBeInTheDocument()
    } else {
      for (const e of entries) {
        // The same employer can appear more than once (consecutive roles).
        expect(within(section).getAllByText(e.org).length).toBeGreaterThan(0)
        expect(within(section).getByText(e.role.toUpperCase())).toBeInTheDocument()
      }
    }
  }
})

test('ports link out to github and linkedin and in to the contact form', () => {
  render(<Cv />)
  const ports = screen.getByRole('heading', { level: 2, name: /ports/i }).closest('section')!
  expect(within(ports).getByRole('link', { name: /github/i })).toHaveAttribute('target', '_blank')
  expect(within(ports).getByRole('link', { name: /linkedin/i })).toHaveAttribute('target', '_blank')
  const ping = within(ports).getByRole('link', { name: /ping/i })
  expect(ping).toHaveAttribute('href', '/contact')
  expect(ping).not.toHaveAttribute('target')
})

test('page carries canonical metadata for /cv', () => {
  expect(metadata.alternates?.canonical).toBe('/cv')
  expect(String(metadata.title)).toMatch(/cv/i)
})
