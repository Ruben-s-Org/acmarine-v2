import type { H3Event } from 'h3'

export async function sendInquiryEmail(
  event: H3Event,
  payload: { name: string; email: string; message: string; listing_slug: string | null },
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const env = (event.context as any)?.cloudflare?.env || {}
  const apiKey = env.MAILGUN_API_KEY
  const domain = env.MAILGUN_DOMAIN
  const base = env.MAILGUN_BASE || 'https://api.mailgun.net'
  const to = env.MAILGUN_TO
  const from = env.MAILGUN_FROM || `Aldridge & Charles Marine <office@${domain}>`
  if (!apiKey || !domain || !to) return { ok: false, error: 'mailer not configured' }

  const subject = payload.listing_slug
    ? `New inquiry: ${payload.listing_slug} — ${payload.name}`
    : `New inquiry — ${payload.name}`

  const lines = [
    `From the inquiry form on acmarine.com.`,
    ``,
    `Name:    ${payload.name}`,
    `Email:   ${payload.email}`,
    payload.listing_slug ? `Vessel:  ${payload.listing_slug}` : '',
    ``,
    `Message:`,
    payload.message,
    ``,
    `--`,
    `Reply directly to ${payload.email}.`,
  ].filter(Boolean).join('\n')

  const form = new URLSearchParams()
  form.set('from', from)
  form.set('to', to)
  form.set('h:Reply-To', payload.email)
  form.set('subject', subject)
  form.set('text', lines)

  const url = `${base.replace(/\/+$/, '')}/v3/${domain}/messages`
  const auth = 'Basic ' + btoa(`api:${apiKey}`)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      console.error('Mailgun error', res.status, t.slice(0, 200))
      return { ok: false, status: res.status, error: t.slice(0, 200) }
    }
    return { ok: true, status: res.status }
  } catch (err: any) {
    console.error('Mailgun fetch failed', err?.message)
    return { ok: false, error: err?.message }
  }
}
