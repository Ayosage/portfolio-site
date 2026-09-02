export function CaseStudyMeta(props: {
  role: string
  stack: string
  year: string
  live?: boolean
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border border-[var(--hairline)] px-2 py-1.5 text-[10px] uppercase text-[var(--phosphor-dim)]">
      <span>ROLE: {props.role}</span>
      <span>STACK: {props.stack}</span>
      <span>YEAR: {props.year}</span>
      {props.live && <span className="text-[var(--phosphor)]">● LIVE</span>}
    </div>
  )
}
