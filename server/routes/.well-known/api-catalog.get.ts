// RFC 9727: well-known URI for API catalog discovery. Returns a Linkset that
// points agents at the OpenAPI document, plus a quick index of the public
// endpoints.

const CATALOG = {
  linkset: [
    {
      anchor: 'https://acmarine.co/',
      'service-desc': [
        {
          href: 'https://acmarine.co/.well-known/openapi.json',
          type: 'application/vnd.oai.openapi+json',
        },
      ],
    },
  ],
  endpoints: [
    {
      name: 'articles-index',
      description: 'List of published articles and guides.',
      method: 'GET',
      url: 'https://acmarine.co/api/articles',
      response: 'application/json',
    },
    {
      name: 'article-by-slug',
      description: 'Single article by slug.',
      method: 'GET',
      url: 'https://acmarine.co/api/articles/{slug}',
      response: 'application/json',
    },
    {
      name: 'listings-index',
      description: 'Yachts currently listed for sale.',
      method: 'GET',
      url: 'https://acmarine.co/api/listings',
      response: 'application/json',
    },
    {
      name: 'submit-inquiry',
      description: 'Submit an inquiry. We reply personally.',
      method: 'POST',
      url: 'https://acmarine.co/api/inquire',
      request: 'application/json',
    },
  ],
}

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'application/linkset+json; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
  return CATALOG
})
