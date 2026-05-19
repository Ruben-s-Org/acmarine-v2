// Agent-readiness middleware:
//   - HTTP Link headers (RFC 8288) on every dynamic response.
//   - Markdown content negotiation on the home page: when the client sends
//     Accept: text/markdown, return a 200 text/markdown body INLINE (no
//     redirect). The IsItAgentReady scanner counts a redirect as a fail.
//   - Cache-Control: no-store, must-revalidate on the home page so neither
//     Cloudflare's edge nor an intermediary serves a stale HTML response to
//     a markdown-preferring request.

const MARKDOWN_BODY = `# Aldridge & Charles Marine

> A captain-owned yachting firm based in South Florida. We handle yacht brokerage, management and detailing, refit and engineering, charter, and crew placement for owners along the Atlantic coast and across the Caribbean.

## About

Aldridge & Charles Marine is a Florida-based firm, captain-owned and led. We work with a limited number of clients each year, with the perspective of an operator rather than a desk.

## Services

- Brokerage & Acquisition — https://acmarine.co/services/brokerage
- Yacht Management — https://acmarine.co/services/yacht-management
- Detailing & Daily Stewardship — https://acmarine.co/services/detailing
- Refit & Project Oversight — https://acmarine.co/services/refit
- Crew Placement — https://acmarine.co/services/crew
- Charter Programmes — https://acmarine.co/services/charter
- Engineering & Technical Counsel — https://acmarine.co/services/engineering
- Berths, Transits & Concierge — https://acmarine.co/services/concierge

## Locations

- Miami — https://acmarine.co/locations/miami
- Fort Lauderdale — https://acmarine.co/locations/fort-lauderdale
- Palm Beach — https://acmarine.co/locations/palm-beach
- Naples — https://acmarine.co/locations/naples

## Contact

- Email: office@acmarine.co
- Site: https://acmarine.co/
- Inquiry form: https://acmarine.co/contact

## Machine-readable

- Sitemap: https://acmarine.co/sitemap.xml
- Full Markdown: https://acmarine.co/llms-full.txt
- Plain index: https://acmarine.co/llms.txt
- A2A Agent Card: https://acmarine.co/.well-known/agent-card.json
- MCP Server Card: https://acmarine.co/.well-known/mcp/server-card.json
- API Catalog: https://acmarine.co/.well-known/api-catalog
- OpenAPI: https://acmarine.co/.well-known/openapi.json
- Agent Skills: https://acmarine.co/.well-known/agent-skills/index.json
`

const LINK_HEADER = [
  '<https://acmarine.co/sitemap.xml>; rel="sitemap"; type="application/xml"',
  '<https://acmarine.co/llms.txt>; rel="alternate"; type="text/plain"; title="llms.txt"',
  '<https://acmarine.co/llms-full.txt>; rel="alternate"; type="text/markdown"; title="llms-full"',
  '<https://acmarine.co/.well-known/agent-card.json>; rel="describedby"; type="application/json"',
  '<https://acmarine.co/.well-known/api-catalog>; rel="api-catalog"',
  '<https://acmarine.co/.well-known/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
].join(', ')

export default defineEventHandler(async (event) => {
  const fullUrl = event.node.req.url || ''
  const pathname = fullUrl.split('?')[0] || '/'
  const host = getRequestHost(event)
  if (host === 'internal') return
  if (pathname.startsWith('/api/') || pathname.startsWith('/_nuxt/') || pathname.startsWith('/_ipx/') || pathname.startsWith('/.well-known/')) return

  const accept = (getRequestHeader(event, 'accept') || '').toLowerCase()
  const isHome = pathname === '/' || pathname === '' || pathname === '/index' || pathname === '/index.html'

  // Markdown negotiation. Inline body (no asset fetch, no redirect).
  if (isHome && accept.includes('text/markdown')) {
    setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
    setResponseHeader(event, 'Cache-Control', 'no-store, must-revalidate')
    setResponseHeader(event, 'Vary', 'Accept')
    setResponseHeader(event, 'Link', LINK_HEADER)
    setResponseStatus(event, 200)
    return MARKDOWN_BODY
  }

  // Standard HTML response: add Link header + Vary so content negotiation is
  // cacheable correctly. No-store on the home page to keep Cloudflare from
  // serving a stale HTML response to a markdown-preferring client.
  setResponseHeader(event, 'Link', LINK_HEADER)
  if (isHome) {
    setResponseHeader(event, 'Vary', 'Accept')
    setResponseHeader(event, 'Cache-Control', 'no-store, must-revalidate')
  }
})
