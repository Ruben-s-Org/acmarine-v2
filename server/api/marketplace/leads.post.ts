import { queryOne, execute } from '~~/server/db/client'
import { getEmailAdapter } from '~~/server/adapters/email'

interface LeadBody {
  name?: string
  email?: string
  phone?: string
  message?: string
  listing_slug?: string
  broker_subdomain?: string
  // Turnstile token. Validated when TURNSTILE_SECRET_KEY is set;
  // accepted without validation when the key is unset (dev / preview).
  turnstile_token?: string
}

function newId(prefix: string) {
  return prefix + '_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16)
}

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) })
    })
    const data = await r.json() as { success: boolean }
    return data.success === true
  } catch {
    return false
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LeadBody>(event)
  if (!body?.name || !body?.email) {
    throw createError({ statusCode: 400, statusMessage: 'name and email required' })
  }

  const cfg = useRuntimeConfig(event)
  const turnstileSecret = cfg.turnstileSecretKey as string
  const cfHeaders = event.context.cloudflare?.request?.headers
  const ip = (cfHeaders?.get('cf-connecting-ip') || getHeader(event, 'x-real-ip') || null) as string | null
  const ua = getHeader(event, 'user-agent') || null

  if (turnstileSecret && !body.turnstile_token) {
    throw createError({ statusCode: 400, statusMessage: 'turnstile_token required' })
  }
  if (turnstileSecret && body.turnstile_token) {
    const ok = await verifyTurnstile(turnstileSecret, body.turnstile_token, ip)
    if (!ok) throw createError({ statusCode: 403, statusMessage: 'turnstile failed' })
  }

  // Resolve broker. Microsite tenant first; then explicit broker_subdomain;
  // then derive from listing_slug; default to first approved broker as marketplace owner.
  const tenant = event.context.tenant
  let brokerId: string | null = null
  let brokerEmail: string | null = null
  let brokerName: string | null = null
  let brokerSub: string | null = null
  let listingId: string | null = null
  let vesselId: string | null = null
  let source: 'microsite' | 'marketplace' | 'manual' = 'marketplace'

  if (tenant?.isMicrosite && tenant.broker) {
    brokerId = tenant.broker.id
    brokerEmail = tenant.broker.email
    brokerName = tenant.broker.display_name
    brokerSub = tenant.broker.subdomain
    source = 'microsite'
  } else if (body.broker_subdomain) {
    const b = await queryOne<{ id: string; email: string; display_name: string; subdomain: string }>(
      event,
      `SELECT id, email, display_name, subdomain FROM brokers WHERE subdomain = ? AND status = 'approved' LIMIT 1`,
      [body.broker_subdomain]
    )
    if (b) { brokerId = b.id; brokerEmail = b.email; brokerName = b.display_name; brokerSub = b.subdomain }
  }

  if (body.listing_slug) {
    const l = await queryOne<{ id: string; vessel_id: string; broker_id: string; headline: string; b_email: string; b_name: string; b_sub: string }>(
      event,
      `SELECT l.id, l.vessel_id, l.broker_id, l.headline,
              b.email AS b_email, b.display_name AS b_name, b.subdomain AS b_sub
       FROM listings l JOIN brokers b ON b.id = l.broker_id
       WHERE l.slug = ? AND l.status = 'published' LIMIT 1`,
      [body.listing_slug]
    )
    if (l) {
      listingId = l.id
      vesselId = l.vessel_id
      if (!brokerId) {
        brokerId = l.broker_id
        brokerEmail = l.b_email
        brokerName = l.b_name
        brokerSub = l.b_sub
      }
    }
  }

  if (!brokerId || !brokerEmail) {
    throw createError({ statusCode: 422, statusMessage: 'Could not resolve a broker for this lead' })
  }

  const leadId = newId('lead')
  await execute(
    event,
    `INSERT INTO leads (id, broker_id, listing_id, vessel_id, source, name, email, phone, message, ip, user_agent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
    [leadId, brokerId, listingId, vesselId, source, body.name, body.email, body.phone || null, body.message || null, ip, ua]
  )

  // Notification email is best-effort: lead is already persisted by the time we get here.
  const apex = cfg.public.apexDomain as string
  const env = (event.context as any).cloudflare?.env
  const mailDomain = env?.MAILGUN_DOMAIN || `mail.${apex}`
  const fromEmail = `acmarine.co <leads@${mailDomain}>`
  const adapter = getEmailAdapter(env)

  const brokerNotice = adapter.send({
    from: fromEmail,
    to: [brokerEmail],
    replyTo: body.email,
    subject: `New lead${body.listing_slug ? ` on listing ${body.listing_slug}` : ''}: ${body.name}`,
    text: [
      `New lead via ${source}.`,
      ``,
      `Name:    ${body.name}`,
      `Email:   ${body.email}`,
      body.phone ? `Phone:   ${body.phone}` : null,
      body.listing_slug ? `Listing: https://${apex}/listings/${body.listing_slug}` : null,
      ``,
      `Message:`,
      body.message || '(no message)',
      ``,
      `Lead ID: ${leadId}. Reply to this email to respond directly to the prospect.`
    ].filter(Boolean).join('\n'),
    tags: [{ name: 'kind', value: 'lead-broker-notice' }]
  })

  const buyerConfirmation = adapter.send({
    from: fromEmail,
    to: [body.email],
    replyTo: brokerEmail,
    subject: `Thanks for reaching out${brokerName ? ` to ${brokerName}` : ''}`,
    text: [
      `Hi ${body.name.split(' ')[0]},`,
      ``,
      `Thanks for reaching out${brokerName ? ` to ${brokerName}` : ''}.`,
      `${brokerName ? brokerName + ' will' : 'A broker will'} get back to you shortly.`,
      ``,
      body.listing_slug ? `Listing you asked about: https://${apex}/listings/${body.listing_slug}` : null,
      ``,
      `acmarine.co`
    ].filter(Boolean).join('\n'),
    tags: [{ name: 'kind', value: 'lead-buyer-confirmation' }]
  })

  const [r1, r2] = await Promise.all([brokerNotice, buyerConfirmation])
  await execute(
    event,
    `UPDATE leads SET notification_email_status = ?, notification_email_error = ? WHERE id = ?`,
    [
      r1.ok ? 'sent' : 'failed',
      r1.ok ? null : (r1.error || 'unknown'),
      leadId
    ]
  )

  return {
    ok: true,
    lead_id: leadId,
    broker: { subdomain: brokerSub, display_name: brokerName },
    notification: { broker: r1.ok, buyer: r2.ok, adapter: adapter.name }
  }
})
