// Subdomain reservation rules. Blocked names cover platform/security namespaces,
// app routes, generic vendor names, and short common slugs.

const HARD_BLOCKLIST = new Set([
  'www', 'app', 'admin', 'api', 'mail', 'mx', 'm', 'static', 'assets', 'cdn',
  'images', 'media', 'docs', 'help', 'blog', 'about', 'careers', 'jobs', 'press',
  'legal', 'terms', 'privacy', 'security', 'support', 'status', 'dev', 'staging',
  'preview', 'test', 'sandbox', 'dashboard', 'console', 'workers', 'auth',
  'login', 'signup', 'oauth', 'sso', 'billing', 'payments', 'stripe',
  'acmarine', 'marketplace', 'sell', 'buy', 'broker', 'brokers',
  'pages', 'cf', 'cloudflare', 'me', 'you', 'us', 'ftp', 'ssh', 'localhost'
])

const PROFANITY = new Set([
  // intentionally small; meant as a fence, not a filter. Add only obvious ones.
  'fuck', 'shit', 'cunt', 'bitch'
])

export interface SubdomainCheck {
  ok: boolean
  reason?: 'invalid_format' | 'too_short' | 'too_long' | 'blocked' | 'profane' | 'taken'
}

export function validateSubdomain(s: string): SubdomainCheck {
  const v = s.trim().toLowerCase()
  if (!/^[a-z0-9](?:[a-z0-9-]{0,28}[a-z0-9])?$/.test(v)) {
    return { ok: false, reason: 'invalid_format' }
  }
  if (v.length < 3) return { ok: false, reason: 'too_short' }
  if (v.length > 30) return { ok: false, reason: 'too_long' }
  if (HARD_BLOCKLIST.has(v)) return { ok: false, reason: 'blocked' }
  for (const word of PROFANITY) if (v.includes(word)) return { ok: false, reason: 'profane' }
  return { ok: true }
}
