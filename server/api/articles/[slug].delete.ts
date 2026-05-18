export default defineEventHandler(async (event) => {
  if (!(await verifySession(event))) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const slug = getRouterParam(event, 'slug')!
  const bucket = getBucket(event)
  await deleteArticle(bucket, slug)
  try { await pingGoogleSitemap(event) } catch {}
  return { ok: true }
})
