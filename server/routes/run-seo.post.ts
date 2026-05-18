// Service-binding-only SEO sweep. Called by unified-cron every 4h after /cron.
// Pings the sitemap and submits every article URL to Google's Indexing API.

export default defineEventHandler(async (event) => {
  const host = getRequestHost(event)
  if (host !== 'internal') {
    setResponseStatus(event, 404)
    return 'not found'
  }
  const ping = await pingGoogleSitemap(event).catch(e => ({ ok: false, error: String(e) }))
  const index = await submitAllArticlesToIndexing(event).catch(e => ({ ok: 0, failed: 0, details: [{ error: String(e) }] }))
  return { ok: true, sitemap: ping, indexing: index }
})
