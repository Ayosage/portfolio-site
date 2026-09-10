// Contact-form delivery through Resend's REST API. No SDK: one POST.
// Env: RESEND_API_KEY (required in production), CONTACT_TO (recipient),
// CONTACT_FROM (defaults to Resend's onboarding sender, which may only
// deliver to the account owner's address — fine for a personal inbox).

export type Ping = { from: string; message: string }
export type MailResult = { ok: true } | { ok: false; error: string }

type Deps = {
  apiKey: string | undefined
  to: string
  from?: string
  fetchFn?: typeof fetch
}

export async function deliverPing(ping: Ping, deps: Deps): Promise<MailResult> {
  if (!deps.apiKey) return { ok: false, error: 'MAIL NOT CONFIGURED' }
  const fetchFn = deps.fetchFn ?? fetch
  const res = await fetchFn('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${deps.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: deps.from ?? 'BS-01 <onboarding@resend.dev>',
      to: [deps.to],
      reply_to: ping.from,
      subject: `[BS-01 PING] from ${ping.from}`,
      text: `${ping.message}\n\nSent via the portfolio contact form. Reply goes to ${ping.from}.`,
    }),
  })
  if (!res.ok) return { ok: false, error: `MAIL REJECTED (${res.status})` }
  return { ok: true }
}
