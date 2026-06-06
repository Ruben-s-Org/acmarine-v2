import type { H3Event } from 'h3'
import { queryOne } from '../db/client'

export interface Broker {
  id: string
  subdomain: string
  display_name: string
  legal_name: string | null
  email: string
  phone: string | null
  bio: string | null
  avatar_url: string | null
  cover_url: string | null
  license_number: string | null
  license_state: string | null
  license_expires: number | null
  status: 'pending' | 'approved' | 'suspended' | 'archived'
  approved_at: number | null
  broker_of_record_user_id: string | null
  theme: string | null
  syndication_enabled: number
  created_at: number
  updated_at: number
}

export interface TenantContext {
  host: string
  subdomain: string | null
  isApex: boolean
  isApp: boolean
  isMicrosite: boolean
  broker: Broker | null
}

const APP_SUBDOMAINS = new Set(['app', 'admin', 'api'])
const RESERVED = new Set(['www', 'mail', 'm', 'static', 'assets', 'cdn', 'images', 'media', 'docs', 'help', 'blog', 'about', 'careers', 'jobs', 'press', 'legal', 'terms', 'privacy', 'security', 'support', 'status', 'dev', 'staging', 'preview', 'test', 'sandbox', 'app', 'admin', 'api', 'dashboard', 'console', 'workers'])

function getEnv(event: H3Event) {
  return (event.context as any).cloudflare?.env ?? {}
}

function getApexDomain(event: H3Event): string {
  const cfg = useRuntimeConfig(event)
  return (cfg.public.apexDomain as string) || 'acmarine.co'
}

function parseHost(host: string): { hostname: string; subdomain: string | null; apexLike: string; isWorkersDev: boolean } {
  const hostname = host.split(':')[0]!.toLowerCase()
  const parts = hostname.split('.')
  const isWorkersDev = hostname.endsWith('.workers.dev')
  if (isWorkersDev) {
    // worker-name.account.workers.dev, no real subdomain semantics for tenancy.
    return { hostname, subdomain: null, apexLike: hostname, isWorkersDev: true }
  }
  if (hostname === 'localhost' || /^[0-9.]+$/.test(hostname)) {
    return { hostname, subdomain: null, apexLike: hostname, isWorkersDev: false }
  }
  if (parts.length < 2) return { hostname, subdomain: null, apexLike: hostname, isWorkersDev: false }
  const apexLike = parts.slice(-2).join('.')
  const subdomain = parts.length > 2 ? parts.slice(0, -2).join('.') : null
  return { hostname, subdomain, apexLike, isWorkersDev: false }
}

export async function resolveTenant(event: H3Event): Promise<TenantContext> {
  const rawHost = getHeader(event, 'host') || ''
  const apexDomain = getApexDomain(event)
  const { hostname, subdomain, isWorkersDev } = parseHost(rawHost)

  // Allow ?broker=foo override for local dev / preview without DNS.
  const url = getRequestURL(event)
  const overrideSub = url.searchParams.get('broker')

  const effective = overrideSub || subdomain
  // ?broker=X always means "act like the broker microsite", even when the
  // request is on the apex. This is how we test microsite rendering without
  // wildcard DNS.
  const isApex = !effective || (!overrideSub && (hostname === apexDomain || isWorkersDev))
  const isApp = !!effective && APP_SUBDOMAINS.has(effective)
  const isMicrosite = !!effective && !isApex && !isApp && !RESERVED.has(effective)

  if (!isMicrosite) {
    return { host: hostname, subdomain: effective, isApex, isApp, isMicrosite: false, broker: null }
  }

  const broker = await loadBroker(event, effective!)
  return {
    host: hostname,
    subdomain: effective,
    isApex: false,
    isApp: false,
    isMicrosite: true,
    broker
  }
}

const KV_PREFIX = 'tenant:'
const KV_TTL_SECONDS = 60 * 10

async function loadBroker(event: H3Event, subdomain: string): Promise<Broker | null> {
  const env = getEnv(event)
  const kv = env.KV as KVNamespace | undefined

  // KV is best-effort. On free plan the daily write quota can run out, and
  // a transient KV error must never break tenant resolution; D1 is the source
  // of truth, KV is just a cache-aside.
  if (kv) {
    try {
      const cached = await kv.get(KV_PREFIX + subdomain, 'json') as Broker | null
      if (cached) return cached
    } catch {}
  }

  const row = await queryOne<Broker>(
    event,
    `SELECT * FROM brokers WHERE subdomain = ? AND status IN ('approved','pending') LIMIT 1`,
    [subdomain]
  )

  // Only positive-cache. Negative caching exhausts the KV write budget for
  // every random subdomain a crawler probes. D1 lookups for unknown subs are
  // cheap (indexed point read) and acceptable.
  if (kv && row) {
    try {
      await kv.put(KV_PREFIX + subdomain, JSON.stringify(row), { expirationTtl: KV_TTL_SECONDS })
    } catch {}
  }

  return row
}

export async function invalidateTenantCache(event: H3Event, subdomain: string) {
  const env = getEnv(event)
  const kv = env.KV as KVNamespace | undefined
  if (!kv) return
  try { await kv.delete(KV_PREFIX + subdomain) } catch {}
}

// Minimal type to avoid pulling @cloudflare/workers-types as a dep.
type KVNamespace = {
  get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream'): Promise<any>
  put(key: string, value: string | ArrayBuffer, options?: { expirationTtl?: number }): Promise<void>
  delete(key: string): Promise<void>
}
