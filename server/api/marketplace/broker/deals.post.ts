import { execute } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'
import { randomToken } from '~~/server/utils/crypto'

interface Body {
  vessel_id?: string
  buyer_contact_id?: string
  seller_contact_id?: string
  stage?: string
  offer_amount?: number
  expected_close?: string
  notes?: string
}

const STAGES = new Set(['inquiry', 'showing', 'offer', 'survey', 'sea_trial', 'closing', 'closed_won', 'closed_lost'])

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const body = await readBody<Body>(event)
  if (!body?.vessel_id) throw createError({ statusCode: 400, statusMessage: 'vessel_id required' })
  const stage = body.stage && STAGES.has(body.stage) ? body.stage : 'inquiry'

  const id = 'dl_' + randomToken(8)
  const expectedClose = body.expected_close ? Math.floor(Date.parse(body.expected_close + 'T00:00:00Z') / 1000) : null

  await execute(
    event,
    `INSERT INTO deals (id, broker_id, vessel_id, buyer_contact_id, seller_contact_id, stage, offer_amount, expected_close, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, brokerId, body.vessel_id,
      body.buyer_contact_id ?? null, body.seller_contact_id ?? null,
      stage, body.offer_amount ?? null, expectedClose,
      body.notes ?? null
    ]
  )
  return { ok: true, deal_id: id }
})
