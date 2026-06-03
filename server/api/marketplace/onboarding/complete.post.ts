import { execute, queryOne } from '~~/server/db/client'
import { requireSession } from '~~/server/utils/mp-session'
import { validateSubdomain } from '~~/server/utils/subdomains'
import { randomToken } from '~~/server/utils/crypto'

interface Body {
  subdomain?: string
  display_name?: string
  legal_name?: string
  phone?: string
  bio?: string
  license_number?: string
  license_state?: string
  license_expires?: string // YYYY-MM-DD
}

function parseDate(s: string | undefined): number | null {
  if (!s) return null
  const t = Date.parse(s + 'T00:00:00Z')
  return Number.isFinite(t) ? Math.floor(t / 1000) : null
}

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const body = await readBody<Body>(event)

  if (!body?.display_name || body.display_name.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'display_name required' })
  }
  const sub = (body.subdomain || '').trim().toLowerCase()
  const check = validateSubdomain(sub)
  if (!check.ok) throw createError({ statusCode: 400, statusMessage: `subdomain ${check.reason}` })

  const existing = await queryOne<{ subdomain: string }>(
    event, `SELECT subdomain FROM subdomains WHERE subdomain = ? LIMIT 1`, [sub]
  )
  if (existing) throw createError({ statusCode: 409, statusMessage: 'subdomain taken' })

  // Already has a broker?
  const user = await queryOne<{ id: string; email: string; broker_id: string | null }>(
    event, `SELECT id, email, broker_id FROM users WHERE id = ? LIMIT 1`, [session.uid]
  )
  if (!user) throw createError({ statusCode: 404, statusMessage: 'user not found' })

  let brokerId = user.broker_id
  const now = Math.floor(Date.now() / 1000)

  if (!brokerId) {
    brokerId = 'brk_' + randomToken(8)
    // External syndication remains 0 until broker-of-record approval.
    await execute(
      event,
      `INSERT INTO brokers (id, subdomain, display_name, legal_name, email, phone, bio, license_number, license_state, license_expires, status, broker_of_record_user_id, syndication_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0)`,
      [
        brokerId, sub, body.display_name.trim(),
        body.legal_name?.trim() || null,
        user.email,
        body.phone?.trim() || null,
        body.bio?.trim() || null,
        body.license_number?.trim() || null,
        body.license_state?.trim().toUpperCase() || null,
        parseDate(body.license_expires),
        session.uid
      ]
    )
    await execute(
      event,
      `INSERT INTO subdomains (subdomain, broker_id, reserved) VALUES (?, ?, 1)`,
      [sub, brokerId]
    )
    await execute(
      event,
      `UPDATE users SET broker_id = ?, role = 'broker_of_record' WHERE id = ?`,
      [brokerId, session.uid]
    )
  } else {
    // Update existing broker (allow editing during onboarding before approval).
    await execute(
      event,
      `UPDATE brokers SET subdomain = ?, display_name = ?, legal_name = ?, phone = ?, bio = ?,
        license_number = ?, license_state = ?, license_expires = ?, updated_at = ?
       WHERE id = ?`,
      [
        sub, body.display_name.trim(),
        body.legal_name?.trim() || null,
        body.phone?.trim() || null,
        body.bio?.trim() || null,
        body.license_number?.trim() || null,
        body.license_state?.trim().toUpperCase() || null,
        parseDate(body.license_expires),
        now, brokerId
      ]
    )
    await execute(
      event,
      `INSERT OR IGNORE INTO subdomains (subdomain, broker_id, reserved) VALUES (?, ?, 1)`,
      [sub, brokerId]
    )
  }

  // Invalidate tenant cache for new/changed subdomain.
  const env = (event.context as any).cloudflare?.env
  if (env?.KV) await env.KV.delete(`tenant:${sub}`)

  return {
    ok: true,
    broker_id: brokerId,
    subdomain: sub,
    microsite_url: `https://${sub}.${(useRuntimeConfig(event).public.apexDomain as string)}`
  }
})
