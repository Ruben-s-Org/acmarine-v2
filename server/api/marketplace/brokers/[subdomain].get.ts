import { queryOne } from '~~/server/db/client'

export default defineEventHandler(async (event) => {
  const subdomain = getRouterParam(event, 'subdomain')
  if (!subdomain) throw createError({ statusCode: 400, statusMessage: 'subdomain required' })

  const broker = await queryOne<any>(
    event,
    `
    SELECT
      id, subdomain, display_name, legal_name, email, phone, bio,
      avatar_url, cover_url, license_state, status, created_at,
      (SELECT COUNT(*) FROM listings l WHERE l.broker_id = brokers.id AND l.status = 'published') AS active_listings
    FROM brokers
    WHERE subdomain = ? AND status = 'approved'
    LIMIT 1
    `,
    [subdomain]
  )

  if (!broker) throw createError({ statusCode: 404, statusMessage: 'Broker not found' })
  return { broker }
})
