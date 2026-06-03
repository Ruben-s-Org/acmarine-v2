import { execute } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'
import { randomToken } from '~~/server/utils/crypto'

interface Body {
  // vessel
  vessel_name?: string
  make?: string
  model?: string
  year?: number
  length_ft?: number
  beam_ft?: number
  draft_ft?: number
  hull_material?: string
  engine_make?: string
  engine_model?: string
  engine_hours?: number
  fuel_type?: string
  location?: string
  vessel_description?: string
  // listing
  headline?: string
  asking_price?: number
  description?: string
  publish?: boolean
}

function slugify(s: string) {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const body = await readBody<Body>(event)
  if (!body?.headline || !body?.vessel_name) {
    throw createError({ statusCode: 400, statusMessage: 'headline and vessel_name required' })
  }

  const vesselId = 'vsl_' + randomToken(8)
  const listingId = 'lst_' + randomToken(8)
  const slug = slugify(body.headline) + '-' + listingId.slice(-6)
  const now = Math.floor(Date.now() / 1000)

  await execute(
    event,
    `INSERT INTO vessels (id, broker_id, name, make, model, year, length_ft, beam_ft, draft_ft,
      hull_material, engine_make, engine_model, engine_hours, fuel_type, location, description, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
    [
      vesselId, brokerId, body.vessel_name,
      body.make ?? null, body.model ?? null, body.year ?? null,
      body.length_ft ?? null, body.beam_ft ?? null, body.draft_ft ?? null,
      body.hull_material ?? null, body.engine_make ?? null, body.engine_model ?? null,
      body.engine_hours ?? null, body.fuel_type ?? null, body.location ?? null,
      body.vessel_description ?? null
    ]
  )

  await execute(
    event,
    `INSERT INTO listings (id, broker_id, vessel_id, slug, headline, asking_price, currency,
      description, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?)`,
    [
      listingId, brokerId, vesselId, slug, body.headline,
      body.asking_price ?? null, body.description ?? null,
      body.publish ? 'published' : 'draft',
      body.publish ? now : null
    ]
  )

  return { ok: true, listing_id: listingId, vessel_id: vesselId, slug }
})
