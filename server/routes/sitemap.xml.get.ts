import { SERVICES, LOCATIONS } from '../../shared/seo-data'

export default defineEventHandler(async (event) => {
  const urls: { loc: string; lastmod?: string; priority?: string }[] = [
    { loc: 'https://acmarine.com/', priority: '1.0' },
    { loc: 'https://acmarine.com/fleet', priority: '0.9' },
    { loc: 'https://acmarine.com/articles', priority: '0.85' },
    { loc: 'https://acmarine.com/contact', priority: '0.7' },
    { loc: 'https://acmarine.com/privacy', priority: '0.4' },
    { loc: 'https://acmarine.com/terms', priority: '0.4' },
  ]
  for (const s of SERVICES) {
    urls.push({ loc: `https://acmarine.com/services/${s.slug}`, priority: '0.9' })
    for (const l of LOCATIONS) urls.push({ loc: `https://acmarine.com/services/${s.slug}/${l.slug}`, priority: '0.8' })
  }
  for (const l of LOCATIONS) urls.push({ loc: `https://acmarine.com/locations/${l.slug}`, priority: '0.85' })

  try {
    const bucket = getBucket(event)
    const listings = await readListings(bucket)
    for (const v of Object.values(listings)) {
      if (v.status === 'draft') continue
      urls.push({ loc: `https://acmarine.com/yacht/${encodeURIComponent(v.slug)}`, lastmod: (v.updated_at || v.created_at || '').slice(0, 10), priority: '0.8' })
    }
    const articles = await listArticles(bucket, 1000)
    for (const a of articles) {
      urls.push({ loc: `https://acmarine.com/articles/${a.slug}`, lastmod: (a.published_at || a.created_at || '').slice(0, 10), priority: '0.75' })
    }
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority || '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')
  return xml
})
