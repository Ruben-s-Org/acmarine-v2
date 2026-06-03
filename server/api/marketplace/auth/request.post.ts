import { queryOne, execute } from '~~/server/db/client'
import { randomToken, sha256Hex } from '~~/server/utils/crypto'
import { getEmailAdapter } from '~~/server/adapters/email'

interface RequestBody { email?: string }

const TOKEN_TTL_SECONDS = 15 * 60
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 60 * 60

const DEVICE_NONCE_COOKIE = 'acm_dev'

function getEnv(event: any) {
  return event.context.cloudflare?.env ?? {}
}

async function readOrCreateNonce(event: any): Promise<string> {
  let nonce = getCookie(event, DEVICE_NONCE_COOKIE)
  if (!nonce) {
    nonce = randomToken(16)
    setCookie(event, DEVICE_NONCE_COOKIE, nonce, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 180
    })
  }
  return nonce
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RequestBody>(event)
  const email = (body?.email || '').trim().toLowerCase()
  if (!email || !email.includes('@')) {
    // Generic response, never confirm whether email exists.
    return { ok: true }
  }

  // KV-based rate limit per email, sliding window.
  const env = getEnv(event)
  const kv = env.KV as { get(k: string, o?: any): Promise<any>; put(k: string, v: any, o?: any): Promise<void> } | undefined
  const now = Math.floor(Date.now() / 1000)
  const rateKey = `auth:rate:${email}`
  if (kv) {
    const raw = await kv.get(rateKey, 'json') as { count: number; windowStart: number } | null
    const w = raw && now - raw.windowStart < RATE_LIMIT_WINDOW ? raw : { count: 0, windowStart: now }
    w.count++
    await kv.put(rateKey, JSON.stringify(w), { expirationTtl: RATE_LIMIT_WINDOW })
    if (w.count > RATE_LIMIT_MAX) {
      // Still return generic 200 to prevent enumeration.
      return { ok: true }
    }
  }

  if (!kv) throw createError({ statusCode: 500, statusMessage: 'KV binding missing' })

  const nonce = await readOrCreateNonce(event)
  const token = randomToken(32)
  const fullHash = await sha256Hex(`${token}:${nonce}:${email}`)
  const lookupHash = await sha256Hex(`${token}:${nonce}`)

  // Two keys so the consume endpoint can find the email from token + nonce
  // (without enumerating users), then verify via the email-bound full hash.
  await Promise.all([
    kv.put(`auth:token:${fullHash}`, JSON.stringify({ email, createdAt: now }), { expirationTtl: TOKEN_TTL_SECONDS }),
    kv.put(`auth:lookup:${lookupHash}`, email, { expirationTtl: TOKEN_TTL_SECONDS })
  ])

  // Look up the user; we send the email regardless of existence (no enumeration).
  const user = await queryOne<{ id: string }>(event, `SELECT id FROM users WHERE email = ? LIMIT 1`, [email])

  await execute(
    event,
    `INSERT INTO auth_events (id, user_id, email, kind, ip, user_agent) VALUES (?, ?, ?, 'request', ?, ?)`,
    [
      'evt_' + randomToken(8),
      user?.id ?? null,
      email,
      getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-real-ip') || null,
      getHeader(event, 'user-agent') || null
    ]
  )

  const cfg = useRuntimeConfig(event)
  const apex = cfg.public.apexDomain as string
  // Marketplace callback lives at the apex (acmarine.co/auth/callback). The
  // device-nonce cookie is set on the apex and will travel with the click-back.
  const url = `https://${apex}/auth/callback?token=${encodeURIComponent(token)}`
  const adapterEnv = env
  const mailDomain = adapterEnv?.MAILGUN_DOMAIN || `mail.${apex}`
  const adapter = getEmailAdapter(adapterEnv)

  await adapter.send({
    from: `acmarine.co <auth@${mailDomain}>`,
    to: [email],
    subject: 'Your acmarine.co sign-in link',
    text: [
      'Sign in to acmarine.co with the link below. It expires in 15 minutes and can only be used once.',
      '',
      url,
      '',
      'If you did not ask for this, ignore this email.'
    ].join('\n'),
    tags: [{ name: 'kind', value: 'magic-link' }]
  })

  return { ok: true }
})
