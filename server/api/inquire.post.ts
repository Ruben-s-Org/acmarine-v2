export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, phone, message, service, listing_slug, listing_name } = body || {}
  const n = String(name || '').trim()
  const e = String(email || '').trim()
  const p = String(phone || '').trim()
  const m = String(message || '').trim()
  if (!n || !m || (!e && !p)) {
    throw createError({ statusCode: 400, statusMessage: 'incomplete' })
  }
  const bucket = getBucket(event)
  const record = {
    id: crypto.randomUUID(),
    name: n.slice(0, 200),
    email: e.slice(0, 200),
    phone: p.slice(0, 60),
    message: m.slice(0, 4000),
    service: service ? String(service).slice(0, 200) : null,
    listing_slug: listing_slug ? String(listing_slug).slice(0, 200) : null,
    listing_name: listing_name ? String(listing_name).slice(0, 200) : null,
    created_at: new Date().toISOString(),
  }
  await appendInquiry(bucket, record)
  const result = await sendInquiryEmail(event, record).catch(e => ({ ok: false, error: String(e) }))
  return { ok: true, emailed: result.ok }
})
