// Web-crypto helpers. All implementations use crypto.subtle / Web Crypto so
// they run on Workers without any Node polyfill.

const enc = new TextEncoder()
const dec = new TextDecoder()

function bytesToHex(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let out = ''
  for (const b of arr) out += b.toString(16).padStart(2, '0')
  return out
}

function bytesToB64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let s = ''
  for (const b of arr) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 2 ? '==' : s.length % 4 === 3 ? '=' : ''
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad)
  const arr = new Uint8Array(b.length)
  for (let i = 0; i < b.length; i++) arr[i] = b.charCodeAt(i)
  return arr
}

export function randomToken(bytes = 32): string {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)
  return bytesToB64Url(buf)
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(input))
  return bytesToHex(digest)
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function sign(secret: string, payload: string): Promise<string> {
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return bytesToB64Url(sig)
}

export async function verify(secret: string, payload: string, signature: string): Promise<boolean> {
  try {
    const key = await hmacKey(secret)
    return await crypto.subtle.verify('HMAC', key, b64UrlToBytes(signature), enc.encode(payload))
  } catch {
    return false
  }
}
