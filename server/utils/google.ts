// Google API access via service account JWT (ported from valor-flights-website/cron).
// Used for Search Console sitemap registration and Indexing API URL submission.

import type { H3Event } from 'h3'

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
  return btoa(s).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}

export async function getGoogleAccessToken(event: H3Event, scope: string): Promise<string | null> {
  const env = (event.context as any)?.cloudflare?.env || {}
  const raw = env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) return null
  let sa: any
  try { sa = JSON.parse(raw) } catch { return null }
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: sa.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }
  const enc = new TextEncoder()
  const unsigned = `${b64url(enc.encode(JSON.stringify(header)))}.${b64url(enc.encode(JSON.stringify(claim)))}`

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(unsigned))
  const jwt = `${unsigned}.${b64url(sig)}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })
  if (!res.ok) return null
  const j: any = await res.json()
  return j.access_token || null
}

const SITE_ID = 'https://acmarine.co/'
const SITEMAP_URL = 'https://acmarine.co/sitemap.xml'

export async function pingGoogleSitemap(event: H3Event): Promise<{ ok: boolean; status?: number; error?: string }> {
  const token = await getGoogleAccessToken(event, 'https://www.googleapis.com/auth/webmasters')
  if (!token) return { ok: false, error: 'no access token (GOOGLE_SERVICE_ACCOUNT_JSON missing or invalid)' }
  const apiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_ID)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`
  const res = await fetch(apiUrl, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return { ok: false, status: res.status, error: (await res.text().catch(() => '')).slice(0, 200) }
  return { ok: true, status: res.status }
}

export async function submitToGoogleIndexing(event: H3Event, url: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  const token = await getGoogleAccessToken(event, 'https://www.googleapis.com/auth/indexing')
  if (!token) return { ok: false, error: 'no access token' }
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  })
  if (!res.ok) return { ok: false, status: res.status, error: (await res.text().catch(() => '')).slice(0, 200) }
  return { ok: true, status: res.status }
}

export async function submitAllArticlesToIndexing(event: H3Event): Promise<{ ok: number; failed: number; details: any[] }> {
  const env = (event.context as any)?.cloudflare?.env || {}
  const bucket = env.IMAGES as R2Bucket
  if (!bucket) return { ok: 0, failed: 0, details: [{ error: 'no R2' }] }
  const list = await bucket.list({ prefix: '_meta/articles/', limit: 1000 })
  const out = { ok: 0, failed: 0, details: [] as any[] }
  for (const o of list.objects) {
    const obj = await bucket.get(o.key)
    if (!obj) continue
    try {
      const a = JSON.parse(await obj.text())
      const url = `https://acmarine.co/articles/${a.slug}`
      const r = await submitToGoogleIndexing(event, url)
      if (r.ok) out.ok++; else out.failed++
      out.details.push({ url, ...r })
    } catch (e: any) {
      out.failed++
      out.details.push({ error: e?.message })
    }
  }
  return out
}
