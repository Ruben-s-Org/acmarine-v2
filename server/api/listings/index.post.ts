export default defineEventHandler(async (event) => {
  if (!(await verifySession(event))) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const body = await readBody<Partial<Listing>>(event)
  if (!body?.name) throw createError({ statusCode: 400, statusMessage: 'name required' })

  const bucket = getBucket(event)
  const all = await readListings(bucket)
  const now = new Date().toISOString()
  const id = body.id || crypto.randomUUID()

  const baseSlug = slugify(body.slug || body.name)
  let slug = baseSlug
  if (!body.id) {
    const taken = new Set(Object.values(all).map(v => v.slug))
    let n = 2
    while (taken.has(slug)) slug = `${baseSlug}-${n++}`
  }

  const existing: Partial<Listing> = body.id ? (all[id] || {}) : {}
  const listing: Listing = {
    id,
    slug,
    name: String(body.name),
    builder: body.builder?.toString() || existing.builder,
    boatModel: body.boatModel?.toString() || existing.boatModel,
    boatClass: body.boatClass?.toString() || existing.boatClass,
    year: typeof body.year === 'number' ? body.year : existing.year,
    loa_m: typeof body.loa_m === 'number' ? body.loa_m : existing.loa_m,
    beam_m: typeof body.beam_m === 'number' ? body.beam_m : existing.beam_m,
    engine: body.engine?.toString() || existing.engine,
    power: typeof body.power === 'number' ? body.power : existing.power,
    engineHours: typeof body.engineHours === 'number' ? body.engineHours : existing.engineHours,
    capacity: typeof body.capacity === 'number' ? body.capacity : existing.capacity,
    price: body.price?.toString() || existing.price,
    price_num: typeof body.price_num === 'number' ? body.price_num : existing.price_num,
    location: body.location?.toString() || existing.location,
    short: body.short?.toString() || existing.short,
    description: body.description?.toString() || existing.description,
    hero_image: body.hero_image?.toString() || existing.hero_image,
    gallery: Array.isArray(body.gallery) ? body.gallery : existing.gallery,
    specs: typeof body.specs === 'object' && body.specs ? (body.specs as any) : existing.specs,
    status: (body.status as any) || existing.status || 'available',
    type: (body.type as any) || existing.type,
    condition: (body.condition as any) || existing.condition,
    class_society: body.class_society?.toString() || existing.class_society,
    created_at: existing.created_at || now,
    updated_at: now,
  }

  all[id] = listing
  await writeListings(bucket, all)
  return { ok: true, listing }
})
