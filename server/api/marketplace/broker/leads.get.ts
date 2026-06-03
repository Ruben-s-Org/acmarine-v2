import { query } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const params = getQuery(event)
  const status = typeof params.status === 'string' ? params.status : null

  const where: string[] = ['broker_id = ?']
  const args: unknown[] = [brokerId]
  if (status && ['new', 'contacted', 'qualified', 'closed'].includes(status)) {
    where.push('status = ?')
    args.push(status)
  }

  const rows = await query<any>(
    event,
    `
    SELECT
      l.id, l.listing_id, l.vessel_id, l.source, l.name, l.email, l.phone,
      l.message, l.status, l.first_response_at, l.notification_email_status,
      l.created_at,
      (SELECT slug FROM listings WHERE id = l.listing_id) AS listing_slug,
      (SELECT headline FROM listings WHERE id = l.listing_id) AS listing_headline
    FROM leads l
    WHERE ${where.join(' AND ')}
    ORDER BY l.created_at DESC
    LIMIT 200
    `,
    args
  )

  return { leads: rows, count: rows.length }
})
