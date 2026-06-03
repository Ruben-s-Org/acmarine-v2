import { execute, queryOne } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'
import { calculateCommission } from '~~/server/utils/commission'
import { randomToken } from '~~/server/utils/crypto'

interface Body {
  commission_rate_bps?: number
  co_broke_split_bps?: number
  house_take_bps?: number
}

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const deal = await queryOne<{ id: string; agreed_amount: number | null; currency: string }>(
    event,
    `SELECT id, agreed_amount, currency FROM deals WHERE id = ? AND broker_id = ? LIMIT 1`,
    [id, brokerId]
  )
  if (!deal) throw createError({ statusCode: 404, statusMessage: 'Deal not found' })
  if (!deal.agreed_amount) throw createError({ statusCode: 400, statusMessage: 'deal has no agreed_amount yet' })

  const body = await readBody<Body>(event)
  const calc = calculateCommission({
    grossAmount: deal.agreed_amount,
    commissionRateBps: body?.commission_rate_bps,
    coBrokeSplitBps: body?.co_broke_split_bps,
    houseTakeBps: body?.house_take_bps
  })

  const commId = 'com_' + randomToken(8)
  await execute(
    event,
    `INSERT INTO commissions (id, deal_id, gross_amount, co_broke_split_bps, house_take_bps, broker_net, currency)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [commId, deal.id, calc.grossAmount, calc.inputs.coBrokeSplitBps, calc.inputs.houseTakeBps, calc.brokerNet, deal.currency]
  )

  return { ok: true, commission_id: commId, calculation: calc }
})
