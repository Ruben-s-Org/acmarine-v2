import { query } from '~~/server/db/client'

export default defineEventHandler(async (event) => {
  const rows = await query<any>(
    event,
    `
    SELECT
      b.id, b.subdomain, b.display_name, b.bio, b.avatar_url, b.cover_url,
      b.license_state, b.status,
      (SELECT COUNT(*) FROM listings l WHERE l.broker_id = b.id AND l.status = 'published') AS active_listings
    FROM brokers b
    WHERE b.status = 'approved'
    ORDER BY b.display_name ASC
    `
  )
  return { brokers: rows, count: rows.length }
})
