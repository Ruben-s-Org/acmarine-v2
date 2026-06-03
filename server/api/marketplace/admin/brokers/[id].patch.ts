import { execute, queryOne } from '~~/server/db/client'
import { requireSuperAdmin } from '~~/server/utils/authz'

interface Body {
  status?: 'pending' | 'approved' | 'suspended' | 'archived'
  syndication_enabled?: boolean
}

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const broker = await queryOne<{ id: string; subdomain: string }>(
    event,
    `SELECT id, subdomain FROM brokers WHERE id = ? LIMIT 1`,
    [id]
  )
  if (!broker) throw createError({ statusCode: 404, statusMessage: 'Broker not found' })

  const body = await readBody<Body>(event)
  const updates: string[] = []
  const args: unknown[] = []

  if (body?.status && ['pending', 'approved', 'suspended', 'archived'].includes(body.status)) {
    updates.push('status = ?')
    args.push(body.status)
    if (body.status === 'approved') updates.push('approved_at = unixepoch()')
  }
  if (typeof body?.syndication_enabled === 'boolean') {
    updates.push('syndication_enabled = ?')
    args.push(body.syndication_enabled ? 1 : 0)
  }
  if (!updates.length) return { ok: true, changed: false }

  updates.push('updated_at = unixepoch()')
  args.push(id)
  await execute(event, `UPDATE brokers SET ${updates.join(', ')} WHERE id = ?`, args)

  // Tenant KV cache must be invalidated for the affected subdomain.
  const env = (event.context as any).cloudflare?.env
  if (env?.KV) await env.KV.delete(`tenant:${broker.subdomain}`)

  return { ok: true, changed: true }
})
