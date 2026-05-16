import type { H3Event } from 'h3'

const COOKIE_NAME = 'acm_admin'

async function hmac(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export async function makeSessionToken(secret: string): Promise<string> {
  return hmac(secret, 'admin:v1')
}

export async function verifySession(event: H3Event): Promise<boolean> {
  const env = getEnv(event)
  const secret = env.SESSION_SECRET
  if (!secret) return false
  const cookieHeader = getRequestHeader(event, 'cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  if (!match) return false
  const expected = await makeSessionToken(secret)
  const provided = match[1]
  if (provided.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < provided.length; i++) diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

export function setSessionCookie(event: H3Event, token: string): void {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 86400,
  })
}

export function clearSessionCookie(event: H3Event): void {
  setCookie(event, COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
}
