// Admin-only: submit every article URL to Google's Indexing API.
export default defineEventHandler(async (event) => {
  if (!(await verifySession(event))) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const result = await submitAllArticlesToIndexing(event)
  return result
})
