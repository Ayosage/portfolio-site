'use client'
import { useActionState, useEffect, useState } from 'react'
import { sendPing, type PingState } from './actions'

export function ContactForm() {
  const [state, action, pending] = useActionState<PingState, FormData>(sendPing, {
    status: 'idle',
  })
  // Stamped after mount (not during render) so server and client HTML match.
  const [renderedAt, setRenderedAt] = useState('')
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRenderedAt(String(Date.now()))
  }, [])
  return (
    <main className="p-4 sm:p-6">
      <p className="border-b border-[var(--hairline)] pb-2 text-[11px] text-[var(--phosphor-dim)]">
        ~/contact
      </p>
      <h1 className="phosphor-glow mt-5 text-4xl font-bold uppercase tracking-tighter">Contact</h1>
      <p className="mt-2 text-xs text-[var(--phosphor-dim)]">
        {'// or email me: '}
        <a className="underline" href="mailto:BrandonJoshuaPHL@gmail.com">
          BrandonJoshuaPHL@gmail.com
        </a>
      </p>
      <form action={action} className="mt-6 flex max-w-md flex-col gap-3 text-xs">
        {/* Bot traps: a field nobody sees, and when the form was drawn. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <input type="hidden" name="t" value={renderedAt} readOnly />
        <label className="flex flex-col gap-1">
          EMAIL
          <input
            name="from"
            type="email"
            required
            className="border border-[var(--hairline)] bg-transparent p-2 focus:border-[var(--phosphor-dim)]"
          />
        </label>
        <label className="flex flex-col gap-1">
          MESSAGE
          <textarea
            name="message"
            required
            rows={5}
            className="border border-[var(--hairline)] bg-transparent p-2 focus:border-[var(--phosphor-dim)]"
          />
        </label>
        <button
          disabled={pending}
          className="border border-[var(--phosphor)] p-2 uppercase disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Send ▸'}
        </button>
        <p role="status" className="min-h-4 text-[var(--phosphor-dim)]">
          {state.status === 'sent' && '▸ SENT. I read every message.'}
          {state.status === 'error' && `▸ ERROR: ${state.error}`}
        </p>
      </form>
    </main>
  )
}
