import { query } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const rows = await query<any>(
    event,
    `
    SELECT
      d.id, d.stage, d.offer_amount, d.agreed_amount, d.currency, d.expected_close, d.closed_at, d.updated_at,
      v.name AS vessel_name, v.make, v.model, v.year,
      bc.name AS buyer_name, bc.email AS buyer_email,
      sc.name AS seller_name
    FROM deals d
    LEFT JOIN vessels v ON v.id = d.vessel_id
    LEFT JOIN contacts bc ON bc.id = d.buyer_contact_id
    LEFT JOIN contacts sc ON sc.id = d.seller_contact_id
    WHERE d.broker_id = ?
    ORDER BY d.updated_at DESC
    `,
    [brokerId]
  )
  const byStage: Record<string, any[]> = {}
  for (const r of rows) {
    (byStage[r.stage] ||= []).push(r)
  }
  return { deals: rows, by_stage: byStage }
})
