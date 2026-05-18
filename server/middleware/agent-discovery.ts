// Agent-readiness middleware. On every response:
//   - Adds HTTP Link headers pointing to sitemap.xml, llms.txt, agent.json
//     (the IsItAgentReady "Discoverability" + "Protocol Discovery" checks).
//   - When the client sends Accept: text/markdown for the home page, redirect
//     to llms-full.txt which serves the same brand/services content as
//     Markdown (the "Content Accessibility / Markdown negotiation" check per
//     Cloudflare's agent standards).

export default defineEventHandler(async (event) => {
  // Skip internal service-binding calls and asset / api requests
  const url = event.node.req.url || ''
  const host = getRequestHost(event)
  if (host === 'internal') return
  if (url.startsWith('/api/') || url.startsWith('/_nuxt/') || url.startsWith('/_ipx/')) return

  // Markdown content negotiation for the home page. Cloudflare's agent
  // standards say: if the client prefers text/markdown, serve markdown.
  const accept = getRequestHeader(event, 'accept') || ''
  if ((url === '/' || url === '/index' || url === '/index.html') && /text\/markdown/i.test(accept)) {
    await sendRedirect(event, '/llms-full.txt', 302)
    return
  }

  // Link headers for discovery. RFC 5988 / 8288 + RFC 9727 (api-catalog).
  const links = [
    '<https://acmarine.co/sitemap.xml>; rel="sitemap"; type="application/xml"',
    '<https://acmarine.co/llms.txt>; rel="alternate"; type="text/plain"; title="llms.txt"',
    '<https://acmarine.co/llms-full.txt>; rel="alternate"; type="text/markdown"; title="llms-full"',
    '<https://acmarine.co/.well-known/agent.json>; rel="describedby"; type="application/json"',
    '<https://acmarine.co/.well-known/api-catalog>; rel="api-catalog"',
    '<https://acmarine.co/.well-known/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  ].join(', ')
  setResponseHeader(event, 'Link', links)
})
