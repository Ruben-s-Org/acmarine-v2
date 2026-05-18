// Admin-only: create or update an article. Content accepts either raw HTML
// (passes through) or markdown-lite (auto-converted). On save the sitemap is
// re-pinged to GSC and the article URL is submitted to the Indexing API so
// new articles surface quickly.

import type { Article } from '../../../shared/types'

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;')
}

function mdLiteToHtml(src: string): string {
  if (/<\s*(p|h2|h3|h4|ul|ol|blockquote|figure|table)[\s>]/i.test(src)) return src
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let para: string[] = []
  let list: string[] | null = null
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${para.join(' ')}</p>`)
      para = []
    }
  }
  const flushList = () => {
    if (list) {
      out.push(`<ul>${list.map(li => `<li>${li}</li>`).join('')}</ul>`)
      list = null
    }
  }
  const inline = (t: string): string =>
    t
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, txt, href) => `<a href="${escapeAttr(href)}">${txt}</a>`)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flushPara(); flushList(); continue }
    if (line.startsWith('### ')) { flushPara(); flushList(); out.push(`<h4>${inline(line.slice(4))}</h4>`); continue }
    if (line.startsWith('## ')) { flushPara(); flushList(); out.push(`<h3>${inline(line.slice(3))}</h3>`); continue }
    if (line.startsWith('# ')) { flushPara(); flushList(); out.push(`<h2>${inline(line.slice(2))}</h2>`); continue }
    if (line.startsWith('> ')) { flushPara(); flushList(); out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue }
    if (line.startsWith('- ') || line.startsWith('* ')) { flushPara(); list = list || []; list.push(inline(line.slice(2))); continue }
    flushList()
    para.push(inline(line))
  }
  flushPara(); flushList()
  return out.join('\n')
}

export default defineEventHandler(async (event) => {
  if (!(await verifySession(event))) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const body = await readBody<Partial<Article> & { _markdown?: boolean }>(event)
  if (!body?.title) throw createError({ statusCode: 400, statusMessage: 'title required' })
  if (!body?.content) throw createError({ statusCode: 400, statusMessage: 'content required' })

  const bucket = getBucket(event)
  const now = new Date().toISOString()

  const baseSlug = slugify(body.slug || body.title)
  let slug = baseSlug
  const existing = await getArticle(bucket, slug)
  if (!body.slug && existing) {
    let n = 2
    while (await getArticle(bucket, `${baseSlug}-${n}`)) n++
    slug = `${baseSlug}-${n}`
  }

  const content = mdLiteToHtml(String(body.content))

  const article: Article = {
    slug,
    title: String(body.title),
    seo_title: body.seo_title || existing?.seo_title,
    description: String(body.description || existing?.description || ''),
    keywords: Array.isArray(body.keywords) ? body.keywords : existing?.keywords,
    content,
    category: body.category || existing?.category,
    image_url: body.image_url || existing?.image_url,
    source_guid: body.source_guid || existing?.source_guid || `manual:${slug}`,
    published_at: body.published_at || existing?.published_at || now,
    created_at: existing?.created_at || now,
  }

  await writeArticle(bucket, article)

  // Fire-and-forget: ping sitemap + submit to Indexing API. Errors swallowed
  // so a Google outage doesn't break the admin save flow.
  try { await pingGoogleSitemap(event) } catch {}
  try { await submitToGoogleIndexing(event, `https://acmarine.co/articles/${slug}`) } catch {}

  return { ok: true, article }
})
