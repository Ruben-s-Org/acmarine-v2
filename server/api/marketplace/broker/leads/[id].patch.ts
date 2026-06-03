import { execute, queryOne } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'

interface Body {
  status?: 'new' | 'contacted' | 'qualified' | 'closed'
  responded?: boolean
}

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const lead = await queryOne<{ id: string; first_response_at: number | null }>(
    event,
    `SELECT id, first_response_at FROM leads WHERE id = ? AND broker_id = ? LIMIT 1`,
    [id, brokerId]
  )
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })

  const body = await readBody<Body>(event)
  const updates: string[] = []
  const args: unknown[] = []

  if (body?.status && ['new', 'contacted', 'qualified', 'closed'].includes(body.status)) {
    updates.push('status = ?')
    args.push(body.status)
  }
  if (body?.responded && !lead.first_response_at) {
    updates.push('first_response_at = unixepoch()')
  }

  if (!updates.length) return { ok: true, changed: false }
  args.push(id, brokerId)
  await execute(
    event,
    `UPDATE leads SET ${updates.join(', ')} WHERE id = ? AND broker_id = ?`,
    args
  )
  return { ok: true, changed: true }
})
