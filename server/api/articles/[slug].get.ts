export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const bucket = getBucket(event)
  const article = await getArticle(bucket, slug)
  if (!article) throw createError({ statusCode: 404 })
  return { article }
})
