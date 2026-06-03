import { query } from '~~/server/db/client'
import { requireSuperAdmin } from '~~/server/utils/authz'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  const rows = await query<any>(
    event,
    `
    SELECT
      b.id, b.subdomain, b.display_name, b.email, b.legal_name,
      b.license_number, b.license_state, b.license_expires,
      b.status, b.approved_at, b.syndication_enabled,
      b.broker_of_record_user_id, b.created_at,
      (SELECT COUNT(*) FROM listings WHERE broker_id = b.id) AS total_listings,
      (SELECT COUNT(*) FROM listings WHERE broker_id = b.id AND status = 'published') AS published_listings,
      (SELECT COUNT(*) FROM leads WHERE broker_id = b.id) AS total_leads,
      (SELECT COUNT(*) FROM leads WHERE broker_id = b.id AND status = 'new') AS open_leads
    FROM brokers b
    ORDER BY b.created_at DESC
    `
  )
  return { brokers: rows }
})
