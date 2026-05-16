export default defineEventHandler(async (event) => {
  const bucket = getBucket(event)
  return { articles: await listArticles(bucket) }
})
