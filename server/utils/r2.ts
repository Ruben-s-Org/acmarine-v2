// Shared R2-backed store: listings, inquiries, articles
// Same bucket (acmarine-images) as v1, same key layout

import type { H3Event } from 'h3'
import type { Listing, Inquiry, Article } from '../../shared/types'

const LISTINGS_KEY = '_meta/listings.json'
const INQUIRY_PREFIX = '_meta/inquiries/'
const ARTICLE_PREFIX = '_meta/articles/'

export function getBucket(event: H3Event): R2Bucket {
  const env = (event.context as any)?.cloudflare?.env
  if (!env?.IMAGES) throw createError({ statusCode: 500, statusMessage: 'R2 binding IMAGES missing' })
  return env.IMAGES as R2Bucket
}

export function getEnv(event: H3Event): any {
  return (event.context as any)?.cloudflare?.env || {}
}

export async function readListings(bucket: R2Bucket): Promise<Record<string, Listing>> {
  const obj = await bucket.get(LISTINGS_KEY)
  if (!obj) return {}
  try { return JSON.parse(await obj.text()) as Record<string, Listing> } catch { return {} }
}

export async function writeListings(bucket: R2Bucket, data: Record<string, Listing>): Promise<void> {
  await bucket.put(LISTINGS_KEY, JSON.stringify(data), {
    httpMetadata: { contentType: 'application/json', cacheControl: 'no-store' },
  })
}

export async function appendInquiry(bucket: R2Bucket, e: Inquiry): Promise<void> {
  await bucket.put(`${INQUIRY_PREFIX}${e.created_at}-${e.id}.json`, JSON.stringify(e), {
    httpMetadata: { contentType: 'application/json', cacheControl: 'no-store' },
  })
}

export async function listInquiries(bucket: R2Bucket, limit = 200): Promise<Inquiry[]> {
  const list = await bucket.list({ prefix: INQUIRY_PREFIX, limit })
  const items: Inquiry[] = []
  for (const o of list.objects) {
    const obj = await bucket.get(o.key)
    if (!obj) continue
    try { items.push(JSON.parse(await obj.text())) } catch {}
  }
  items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  return items
}

export async function listArticles(bucket: R2Bucket, limit = 200): Promise<Article[]> {
  const list = await bucket.list({ prefix: ARTICLE_PREFIX, limit })
  const items: Article[] = []
  for (const o of list.objects) {
    const obj = await bucket.get(o.key)
    if (!obj) continue
    try { items.push(JSON.parse(await obj.text())) } catch {}
  }
  items.sort((a, b) => (b.published_at || b.created_at || '').localeCompare(a.published_at || a.created_at || ''))
  return items
}

export async function getArticle(bucket: R2Bucket, slug: string): Promise<Article | null> {
  const obj = await bucket.get(`${ARTICLE_PREFIX}${slug}.json`)
  if (!obj) return null
  try { return JSON.parse(await obj.text()) as Article } catch { return null }
}

export async function writeArticle(bucket: R2Bucket, article: Article): Promise<void> {
  await bucket.put(`${ARTICLE_PREFIX}${article.slug}.json`, JSON.stringify(article), {
    httpMetadata: { contentType: 'application/json', cacheControl: 'no-store' },
  })
}

export async function deleteArticle(bucket: R2Bucket, slug: string): Promise<void> {
  await bucket.delete(`${ARTICLE_PREFIX}${slug}.json`)
}

export function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export type { Listing, Inquiry, Article }
