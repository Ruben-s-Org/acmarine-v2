const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const MAX_BYTES = 8 * 1024 * 1024

export default defineEventHandler(async (event) => {
  if (!(await verifySession(event))) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const form = await readMultipartFormData(event)
  const file = form?.find(p => p.name === 'file')
  if (!file || !file.data) throw createError({ statusCode: 400, statusMessage: 'no file' })
  const contentType = file.type || 'application/octet-stream'
  if (!ALLOWED.has(contentType)) throw createError({ statusCode: 415, statusMessage: 'unsupported type' })
  if (file.data.length > MAX_BYTES) throw createError({ statusCode: 413, statusMessage: 'too large' })

  const ext = contentType.split('/')[1].replace('jpeg', 'jpg')
  const key = `yachts/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
  const bucket = getBucket(event)
  await bucket.put(key, file.data, {
    httpMetadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' },
  })
  return { ok: true, url: `/api/images/${key}`, key }
})
