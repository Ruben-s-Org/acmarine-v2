// Service-binding-only endpoint. Called by unified-cron every 4h.
// Lock down via URL host: service.fetch(new Request('https://internal/cron')) arrives with host 'internal'.

export default defineEventHandler(async (event) => {
  const url = new URL(event.node.req.url || '', `https://${getRequestHost(event)}`)
  if (url.host !== 'internal') {
    setResponseStatus(event, 404)
    return 'not found'
  }
  // Re-register the sitemap with Google Search Console so new yacht listings and
  // articles are picked up. Article generation pipeline can be added here later.
  const result = await pingGoogleSitemap(event).catch(e => ({ ok: false, error: String(e) }))
  return { ok: true, sitemap: result }
})
