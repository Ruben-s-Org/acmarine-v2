export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, message, listing_slug } = body || {}
  if (!name || !email || !message) throw createError({ statusCode: 400, statusMessage: 'missing fields' })
  const bucket = getBucket(event)
  await appendInquiry(bucket, {
    id: crypto.randomUUID(),
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    message: String(message).slice(0, 4000),
    listing_slug: listing_slug ? String(listing_slug).slice(0, 200) : null,
    created_at: new Date().toISOString(),
  })
  return { ok: true }
})
