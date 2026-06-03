import { query } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const rows = await query<any>(
    event,
    `
    SELECT
      l.id, l.slug, l.headline, l.asking_price, l.currency, l.status, l.published_at,
      l.syndicate_yachtworld, l.syndicate_yatco, l.syndicate_rightboat,
      v.name AS vessel_name, v.make, v.model, v.year, v.length_ft, v.location,
      v.id AS vessel_id
    FROM listings l
    JOIN vessels v ON v.id = l.vessel_id
    WHERE l.broker_id = ?
    ORDER BY l.updated_at DESC
    `,
    [brokerId]
  )
  return { listings: rows, count: rows.length }
})
