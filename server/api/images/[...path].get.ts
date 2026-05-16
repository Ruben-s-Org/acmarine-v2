export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) throw createError({ statusCode: 404 })
  const bucket = getBucket(event)
  const obj = await bucket.get(path)
  if (!obj) throw createError({ statusCode: 404 })
  setResponseHeader(event, 'Content-Type', obj.httpMetadata?.contentType || 'application/octet-stream')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
  return obj.body
})
