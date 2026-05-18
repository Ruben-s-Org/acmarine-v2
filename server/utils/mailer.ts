import type { H3Event } from 'h3'

interface InquiryPayload {
  name: string
  email: string
  phone: string
  message: string
  service?: string | null
  listing_slug?: string | null
  listing_name?: string | null
}

function humanizeSlug(slug: string): string {
  // my-lavender -> M/Y Lavender, sy-aurora -> S/Y Aurora, otherwise Title Case
  if (/^my-/.test(slug)) return 'M/Y ' + titleCase(slug.slice(3))
  if (/^sy-/.test(slug)) return 'S/Y ' + titleCase(slug.slice(3))
  return titleCase(slug)
}
function titleCase(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function buildSubject(p: InquiryPayload): string {
  let tag = 'Office'
  if (p.listing_name) tag = p.listing_name
  else if (p.listing_slug) tag = humanizeSlug(p.listing_slug)
  else if (p.service) tag = p.service
  const action = p.listing_name || p.listing_slug ? 'Viewing request' : 'New inquiry'
  return `[${tag}] ${action} from ${p.name}`
}

export async function sendInquiryEmail(
  event: H3Event,
  payload: InquiryPayload,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const env = (event.context as any)?.cloudflare?.env || {}
  const apiKey = env.MAILGUN_API_KEY
  const domain = env.MAILGUN_DOMAIN
  const base = env.MAILGUN_BASE || 'https://api.mailgun.net'
  const to = env.MAILGUN_TO
  const from = env.MAILGUN_FROM || `Aldridge & Charles Marine <office@${domain}>`
  if (!apiKey || !domain || !to) return { ok: false, error: 'mailer not configured' }

  const sourceLine = payload.listing_name || (payload.listing_slug ? humanizeSlug(payload.listing_slug) : '')
    || payload.service || 'Office (generic)'

  const lines = [
    `From the inquiry form on acmarine.com.`,
    ``,
    `Source:  ${sourceLine}`,
    `Name:    ${payload.name}`,
    payload.email ? `Email:   ${payload.email}` : '',
    payload.phone ? `Phone:   ${payload.phone}` : '',
    payload.listing_slug ? `Vessel:  ${payload.listing_slug}` : '',
    ``,
    `Message:`,
    payload.message,
    ``,
    `--`,
    payload.email ? `Reply directly to ${payload.email}.` : payload.phone ? `Call back on ${payload.phone}.` : '',
  ].filter(Boolean).join('\n')

  const form = new URLSearchParams()
  form.set('from', from)
  form.set('to', to)
  if (payload.email) form.set('h:Reply-To', payload.email)
  form.set('subject', buildSubject(payload))
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
      return { ok: false, status: res.status, error: t.slice(0, 200) }
    }
    return { ok: true, status: res.status }
  } catch (err: any) {
    return { ok: false, error: err?.message }
  }
}
