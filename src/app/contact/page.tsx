'use client'
import { useActionState } from 'react'
import { sendPing, type PingState } from './actions'

export default function Contact() {
  const [state, action, pending] = useActionState<PingState, FormData>(sendPing, {
    status: 'idle',
  })
  return (
    <main className="p-4 sm:p-6">
      <h1 className="phosphor-glow text-4xl font-bold uppercase tracking-tighter">Contact</h1>
      <p className="mt-2 text-xs text-[var(--phosphor-dim)]">
        {'// or email direct: '}
        <a className="underline" href="mailto:aexbrandon@gmail.com">
          aexbrandon@gmail.com
        </a>
      </p>
      <form action={action} className="mt-6 flex max-w-md flex-col gap-3 text-xs">
        <label className="flex flex-col gap-1">
          EMAIL
          <input
            name="from"
            type="email"
            required
            className="border border-[var(--hairline)] bg-transparent p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          MESSAGE
          <textarea
            name="message"
            required
            rows={5}
            className="border border-[var(--hairline)] bg-transparent p-2"
          />
        </label>
        <button
          disabled={pending}
          className="border border-[var(--phosphor)] p-2 uppercase disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Send ▸'}
        </button>
        <p role="status" className="min-h-4 text-[var(--phosphor-dim)]">
          {state.status === 'sent' && '▸ SENT. I read everything that comes through.'}
          {state.status === 'error' && `▸ ERROR: ${state.error}`}
        </p>
      </form>
    </main>
  )
}
