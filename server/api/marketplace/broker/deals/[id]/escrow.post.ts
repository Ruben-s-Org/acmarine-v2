import { execute, queryOne } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'
import { randomToken } from '~~/server/utils/crypto'

interface Body {
  amount?: number
  currency?: string
  status?: 'pending' | 'held' | 'released' | 'refunded'
  notes?: string
}

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const deal = await queryOne(event, `SELECT id FROM deals WHERE id = ? AND broker_id = ? LIMIT 1`, [id, brokerId])
  if (!deal) throw createError({ statusCode: 404, statusMessage: 'Deal not found' })

  const body = await readBody<Body>(event)
  if (!body?.amount || body.amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'amount required' })
  }
  const status = body.status && ['pending', 'held', 'released', 'refunded'].includes(body.status) ? body.status : 'held'
  const depId = 'esc_' + randomToken(8)
  await execute(
    event,
    `INSERT INTO escrow_deposits (id, deal_id, amount, currency, received_at, status, notes)
     VALUES (?, ?, ?, ?, unixepoch(), ?, ?)`,
    [depId, id, body.amount, body.currency || 'USD', status, body.notes || null]
  )
  return { ok: true, deposit_id: depId }
})
