import { queryOne } from '../db/client'

// Accept: text/markdown on a listing detail URL returns the markdown view,
// short-circuiting the SSR HTML render. This is the build prompt's content
// negotiation requirement for agent-readiness.

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  if (!url.pathname.startsWith('/listings/')) return
  const slug = url.pathname.slice('/listings/'.length).replace(/\/$/, '')
  if (!slug || slug.includes('/')) return
  const accept = (getHeader(event, 'accept') || '').toLowerCase()
  if (!accept.includes('text/markdown')) return

  const listing = await queryOne<any>(
    event,
    `
    SELECT l.*, v.name AS vessel_name, v.make, v.model, v.year, v.length_ft, v.beam_ft,
           v.draft_ft, v.hull_material, v.engine_make, v.engine_model, v.engine_hours,
           v.fuel_type, v.location, v.description AS vessel_description,
           b.subdomain AS broker_subdomain, b.display_name AS broker_display_name
    FROM listings l
    JOIN vessels v ON v.id = l.vessel_id
    JOIN brokers b ON b.id = l.broker_id
    WHERE l.slug = ? AND l.status = 'published' LIMIT 1
    `,
    [slug]
  )
  if (!listing) return

  const cfg = useRuntimeConfig(event)
  const apex = cfg.public.apexDomain as string
  const canonical = `https://${apex}/listings/${listing.slug}`
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
  setHeader(event, 'vary', 'accept')
  return md
})
