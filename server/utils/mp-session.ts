import type { H3Event } from 'h3'
import { sign, verify } from './crypto'

const SESSION_COOKIE = 'acm_sess'
const SESSION_TTL_DAYS = 30

export interface SessionData {
  uid: string
  email: string
  role: 'super_admin' | 'broker_of_record' | 'broker' | 'staff'
  brokerId: string | null
  exp: number // unix seconds
}

function getSecret(event: H3Event): string {
  const cfg = useRuntimeConfig(event)
  const s = cfg.sessionSecret as string
  if (!s) throw createError({ statusCode: 500, statusMessage: 'sessionSecret not configured' })
  return s
}

export async function createSession(event: H3Event, data: Omit<SessionData, 'exp'>): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_DAYS * 86400
  const payload = JSON.stringify({ ...data, exp })
  const b64 = btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const sig = await sign(getSecret(event), b64)
  return `${b64}.${sig}`
}

export async function readSession(event: H3Event): Promise<SessionData | null> {
  const cookie = getCookie(event, SESSION_COOKIE)
  if (!cookie) return null
  const dot = cookie.lastIndexOf('.')
  if (dot < 1) return null
  const b64 = cookie.slice(0, dot)
  const sig = cookie.slice(dot + 1)
  const ok = await verify(getSecret(event), b64, sig)
  if (!ok) return null
  try {
    const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : ''
    const json = atob(b64.replace(/-/g, '+').replace(/_/g, '/') + pad)
    const data = JSON.parse(json) as SessionData
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch {
    return null
  }
}

export function setSessionCookie(event: H3Event, value: string) {
  setCookie(event, SESSION_COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 86400
  })
}

export function clearSessionCookie(event: H3Event) {
  setCookie(event, SESSION_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })
}

export async function requireSession(event: H3Event): Promise<SessionData> {
  const s = await readSession(event)
  if (!s) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  return s
}
