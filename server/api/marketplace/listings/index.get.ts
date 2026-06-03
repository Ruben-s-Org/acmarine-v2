import { query } from '~~/server/db/client'

interface ListingRow {
  id: string
  broker_id: string
  vessel_id: string
  slug: string
  headline: string
  asking_price: number | null
  currency: string
  description: string | null
  status: string
  published_at: number | null
  vessel_name: string
  make: string | null
  model: string | null
  year: number | null
  length_ft: number | null
  location: string | null
  cover_blob_key: string | null
  broker_subdomain: string
  broker_display_name: string
}

export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant
  const params = getQuery(event)
  const limit = Math.min(Number(params.limit) || 24, 100)
  const offset = Math.max(Number(params.offset) || 0, 0)

  const where: string[] = ["l.status = 'published'"]
  const args: unknown[] = []

  if (tenant?.isMicrosite && tenant.broker) {
    where.push('l.broker_id = ?')
    args.push(tenant.broker.id)
  } else if (params.broker && typeof params.broker === 'string') {
    where.push('b.subdomain = ?')
    args.push(params.broker)
  }

  if (params.q && typeof params.q === 'string') {
    where.push("(l.headline LIKE ? OR v.make LIKE ? OR v.model LIKE ?)")
    const like = `%${params.q}%`
    args.push(like, like, like)
  }

  const rows = await query<ListingRow>(
    event,
    `
    SELECT
      l.id, l.broker_id, l.vessel_id, l.slug, l.headline, l.asking_price, l.currency,
      l.description, l.status, l.published_at,
      v.name AS vessel_name, v.make, v.model, v.year, v.length_ft, v.location,
      (SELECT blob_key FROM media WHERE vessel_id = v.id AND is_cover = 1 LIMIT 1) AS cover_blob_key,
      b.subdomain AS broker_subdomain, b.display_name AS broker_display_name
    FROM listings l
    JOIN vessels v ON v.id = l.vessel_id
    JOIN brokers b ON b.id = l.broker_id
    WHERE ${where.join(' AND ')}
    ORDER BY l.published_at DESC
    LIMIT ? OFFSET ?
    `,
    [...args, limit, offset]
  )

  return { listings: rows, limit, offset, count: rows.length }
})
