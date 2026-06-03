import { execute, queryOne } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'

const STAGES = new Set(['inquiry', 'showing', 'offer', 'survey', 'sea_trial', 'closing', 'closed_won', 'closed_lost'])

interface Body {
  stage?: string
  offer_amount?: number | null
  agreed_amount?: number | null
  expected_close?: string | null
  notes?: string | null
}

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const existing = await queryOne(event, `SELECT id FROM deals WHERE id = ? AND broker_id = ? LIMIT 1`, [id, brokerId])
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Deal not found' })

  const body = await readBody<Body>(event)
  const updates: string[] = []
  const args: unknown[] = []

  if (body?.stage && STAGES.has(body.stage)) {
    updates.push('stage = ?')
    args.push(body.stage)
    if (body.stage === 'closed_won' || body.stage === 'closed_lost') {
      updates.push('closed_at = unixepoch()')
    }
  }
  if ('offer_amount' in (body ?? {})) { updates.push('offer_amount = ?'); args.push(body!.offer_amount) }
  if ('agreed_amount' in (body ?? {})) { updates.push('agreed_amount = ?'); args.push(body!.agreed_amount) }
  if ('notes' in (body ?? {})) { updates.push('notes = ?'); args.push(body!.notes) }
  if ('expected_close' in (body ?? {})) {
    const ts = body!.expected_close ? Math.floor(Date.parse(body!.expected_close + 'T00:00:00Z') / 1000) : null
    updates.push('expected_close = ?')
    args.push(ts)
  }
  if (!updates.length) return { ok: true, changed: false }

  updates.push('updated_at = unixepoch()')
  args.push(id, brokerId)
  await execute(event, `UPDATE deals SET ${updates.join(', ')} WHERE id = ? AND broker_id = ?`, args)
  return { ok: true, changed: true }
})
