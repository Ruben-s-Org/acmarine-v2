// Admin-only: re-register the sitemap with Google Search Console.
export default defineEventHandler(async (event) => {
  if (!(await verifySession(event))) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const result = await pingGoogleSitemap(event)
  return result
})
