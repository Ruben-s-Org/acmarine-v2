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
  if (/^my-/.test(slug)) return 'M/Y ' + titleCase(slug.slice(3))
  if (/^sy-/.test(slug)) return 'S/Y ' + titleCase(slug.slice(3))
  return titleCase(slug)
}
function titleCase(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
function escapeHtml(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' } as any)[c])
}

function buildSubject(p: InquiryPayload): string {
  let tag = 'Office'
  if (p.listing_name) tag = p.listing_name
  else if (p.listing_slug) tag = humanizeSlug(p.listing_slug)
  else if (p.service) tag = p.service
  const action = p.listing_name || p.listing_slug ? 'Viewing request' : 'New inquiry'
  return `[${tag}] ${action} from ${p.name}`
}

function buildSource(p: InquiryPayload): { label: string; value: string } | null {
  if (p.listing_name) return { label: 'Vessel', value: p.listing_name }
  if (p.listing_slug) return { label: 'Vessel', value: humanizeSlug(p.listing_slug) }
  if (p.service) return { label: 'Service', value: p.service }
  return null
}

function buildHtml(p: InquiryPayload): string {
  const source = buildSource(p)
  const action = p.listing_name || p.listing_slug ? 'Viewing request' : 'New inquiry'
  const rows: { label: string; value: string }[] = []
  if (source) rows.push(source)
  rows.push({ label: 'Name', value: escapeHtml(p.name) })
  if (p.email) rows.push({ label: 'Email', value: `<a href="mailto:${escapeHtml(p.email)}" style="color:#7a5e30;text-decoration:underline;">${escapeHtml(p.email)}</a>` })
  if (p.phone) rows.push({ label: 'Phone', value: `<a href="tel:${escapeHtml(p.phone.replace(/[^+0-9]/g, ''))}" style="color:#7a5e30;text-decoration:underline;">${escapeHtml(p.phone)}</a>` })

  const rowsHtml = rows.map(r => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e8e2d3;width:120px;font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:14px;color:#7a5e30;vertical-align:top;">${escapeHtml(r.label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e8e2d3;font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;color:#0a1e3a;vertical-align:top;">${r.value}</td>
    </tr>
  `).join('')

  const messageHtml = escapeHtml(p.message).replace(/\n/g, '<br>')

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(buildSubject(p))}</title>
</head>
<body style="margin:0;padding:0;background:#f5f1e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a1e3a;">
  <center style="width:100%;background:#f5f1e8;padding:32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e8e2d3;">
      <tr>
        <td style="background:#0a1e3a;padding:24px 32px;text-align:left;">
          <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:500;letter-spacing:0.02em;color:#f5f1e8;line-height:1;">Aldridge &amp; Charles</div>
          <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:10px;letter-spacing:0.36em;text-transform:uppercase;color:#b08d57;margin-top:6px;">Marine</div>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 32px 8px 32px;">
          <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#7a5e30;font-weight:500;">${escapeHtml(action)}</div>
          <h1 style="margin:12px 0 0 0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:30px;line-height:1.1;color:#0a1e3a;letter-spacing:-0.01em;">From ${escapeHtml(p.name)}.</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px 8px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${rowsHtml}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px 0 32px;">
          <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#7a5e30;font-weight:500;">Message</div>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 32px 32px 32px;">
          <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:17px;line-height:1.65;color:#0a1e3a;">${messageHtml}</div>
        </td>
      </tr>
      <tr>
        <td style="background:#f5f1e8;padding:16px 32px;border-top:1px solid #e8e2d3;text-align:center;">
          <div style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:12px;color:#7a5e30;">acmarine.co</div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`
}

function buildText(p: InquiryPayload): string {
  const source = buildSource(p)
  const action = p.listing_name || p.listing_slug ? 'Viewing request' : 'New inquiry'
  const lines = [
    `${action} from ${p.name}.`,
    ``,
  ]
  if (source) lines.push(`${source.label.padEnd(8)} ${source.value}`)
  lines.push(`Name     ${p.name}`)
  if (p.email) lines.push(`Email    ${p.email}`)
  if (p.phone) lines.push(`Phone    ${p.phone}`)
  lines.push('', 'Message', '', p.message)
  return lines.join('\n')
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

  const form = new URLSearchParams()
  form.set('from', from)
  form.set('to', to)
  if (payload.email) form.set('h:Reply-To', payload.email)
  form.set('subject', buildSubject(payload))
  form.set('text', buildText(payload))
  form.set('html', buildHtml(payload))

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
