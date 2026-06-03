import { queryOne, query } from '~~/server/db/client'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug required' })

  const tenant = event.context.tenant
  const args: unknown[] = [slug]
  let brokerFilter = ''
  if (tenant?.isMicrosite && tenant.broker) {
    brokerFilter = 'AND l.broker_id = ?'
    args.push(tenant.broker.id)
  }

  const listing = await queryOne<any>(
    event,
    `
    SELECT
      l.*,
      v.name AS vessel_name, v.make, v.model, v.year,
      v.length_ft, v.beam_ft, v.draft_ft, v.hull_material,
      v.engine_make, v.engine_model, v.engine_hours, v.fuel_type, v.location,
      v.description AS vessel_description,
      b.subdomain AS broker_subdomain, b.display_name AS broker_display_name,
      b.email AS broker_email, b.phone AS broker_phone, b.avatar_url AS broker_avatar_url
    FROM listings l
    JOIN vessels v ON v.id = l.vessel_id
    JOIN brokers b ON b.id = l.broker_id
    WHERE l.slug = ? AND l.status = 'published' ${brokerFilter}
    LIMIT 1
    `,
    args
  )

  if (!listing) throw createError({ statusCode: 404, statusMessage: 'Listing not found' })

  const media = await query<any>(
    event,
    `SELECT id, blob_key, kind, alt, width, height, sort_order, is_cover
     FROM media WHERE vessel_id = ? ORDER BY is_cover DESC, sort_order ASC`,
    [listing.vessel_id]
  )

  // Canonical URL is always apex marketplace.
  const cfg = useRuntimeConfig(event)
  const apex = cfg.public.apexDomain as string
  const canonical = `https://${apex}/listings/${listing.slug}`

  // Markdown content negotiation: Accept: text/markdown returns a clean
  // text representation suitable for agents and snapshotting.
  const accept = (getHeader(event, 'accept') || '').toLowerCase()
  if (accept.includes('text/markdown')) {
    const price = listing.asking_price
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: listing.currency || 'USD', maximumFractionDigits: 0 }).format(listing.asking_price)
      : 'POA'
    const md = [
      `# ${listing.headline}`, '',
      `**URL:** ${canonical}`,
      `**Broker:** ${listing.broker_display_name}`,
      `**Price:** ${price}`,
      '',
      '## Specifications', '',
      listing.year ? `- Year: ${listing.year}` : null,
      listing.make ? `- Make: ${listing.make}` : null,
      listing.model ? `- Model: ${listing.model}` : null,
      listing.length_ft ? `- Length (ft): ${listing.length_ft}` : null,
      listing.beam_ft ? `- Beam (ft): ${listing.beam_ft}` : null,
      listing.draft_ft ? `- Draft (ft): ${listing.draft_ft}` : null,
      listing.hull_material ? `- Hull: ${listing.hull_material}` : null,
      listing.engine_make ? `- Engine: ${listing.engine_make}${listing.engine_model ? ' ' + listing.engine_model : ''}${listing.engine_hours ? ', ' + listing.engine_hours + ' hrs' : ''}` : null,
      listing.fuel_type ? `- Fuel: ${listing.fuel_type}` : null,
      listing.location ? `- Location: ${listing.location}` : null,
      '',
      '## Description', '',
      listing.description || listing.vessel_description || ''
    ].filter(v => v !== null && v !== undefined).join('\n')
    setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
    setHeader(event, 'link', `<${canonical}>; rel="canonical"`)
    return md
  }

  setHeader(event, 'link', `<${canonical}>; rel="canonical"`)
  return { listing, media, canonical }
})
