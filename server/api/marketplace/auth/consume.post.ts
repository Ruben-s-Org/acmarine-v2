import { queryOne, execute } from '~~/server/db/client'
import { randomToken, sha256Hex, constantTimeEqual } from '~~/server/utils/crypto'
import { createSession, setSessionCookie } from '~~/server/utils/mp-session'

interface ConsumeBody { token?: string }

function getEnv(event: any) {
  return event.context.cloudflare?.env ?? {}
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ConsumeBody>(event)
  const token = (body?.token || '').trim()
  if (!token) throw createError({ statusCode: 400, statusMessage: 'token required' })

  const nonce = getCookie(event, 'acm_dev')
  if (!nonce) {
    // Device cookie missing means this link was opened on a different device or
    // session, not allowed for security. Single device + single use.
    throw createError({ statusCode: 401, statusMessage: 'Sign in from the same device where you requested the link.' })
  }

  const env = getEnv(event)
  const kv = env.KV as { get(k: string, o?: any): Promise<any>; delete(k: string): Promise<void> } | undefined
  if (!kv) throw createError({ statusCode: 500, statusMessage: 'KV binding missing' })

  // We don't know the email yet, so we have to scan: but in fact the hash is
  // deterministic from (token, nonce, email). Trick: we stored value as {email}
  // keyed by hash(token:nonce:email). We can recompute the hash candidate for
  // any email and look it up. To avoid enumerating, we instead store a second
  // record keyed by `auth:token-only:<sha(token:nonce)>` pointing at the hash.
  // But simpler approach: try hash with each candidate. We have neither, so
  // we use a probe key.
  //
  // We attempt: read `auth:token:<sha(token:nonce:???)>` is not possible
  // without email. So at request time, also write a lookup key with just
  // `sha(token:nonce)` mapped to the email. That key is also TTL-bound and
  // single-use.

  const lookupHash = await sha256Hex(`${token}:${nonce}`)
  const lookupKey = `auth:lookup:${lookupHash}`
  const emailRaw = await kv.get(lookupKey, 'text') as string | null
  if (!emailRaw) {
    throw createError({ statusCode: 401, statusMessage: 'Link is invalid or expired.' })
  }
  const email = emailRaw

  const fullHash = await sha256Hex(`${token}:${nonce}:${email}`)
  const stored = await kv.get(`auth:token:${fullHash}`, 'json') as { email: string; createdAt: number } | null
  if (!stored || !constantTimeEqual(stored.email, email)) {
    throw createError({ statusCode: 401, statusMessage: 'Link is invalid or expired.' })
  }

  // Single-use: delete both records before issuing session.
  await Promise.all([
    kv.delete(`auth:token:${fullHash}`),
    kv.delete(lookupKey)
  ])

  // Resolve or create user.
  let user = await queryOne<{ id: string; email: string; role: string; broker_id: string | null; status: string }>(
    event,
    `SELECT id, email, role, broker_id, status FROM users WHERE email = ? LIMIT 1`,
    [email]
  )
  if (!user) {
    const uid = 'usr_' + randomToken(8)
    await execute(
      event,
      `INSERT INTO users (id, email, role, status) VALUES (?, ?, 'broker', 'active')`,
      [uid, email]
    )
    user = { id: uid, email, role: 'broker', broker_id: null, status: 'active' }
  }
  if (user.status === 'suspended') {
    throw createError({ statusCode: 403, statusMessage: 'Account suspended.' })
  }

  await execute(
    event,
    `UPDATE users SET last_login_at = unixepoch() WHERE id = ?`,
    [user.id]
  )

  const cookieValue = await createSession(event, {
    uid: user.id,
    email: user.email,
    role: user.role as any,
    brokerId: user.broker_id
  })
  setSessionCookie(event, cookieValue)

  await execute(
    event,
    `INSERT INTO auth_events (id, user_id, email, kind, ip, user_agent) VALUES (?, ?, ?, 'consume', ?, ?)`,
    [
      'evt_' + randomToken(8),
      user.id,
      email,
      getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-real-ip') || null,
      getHeader(event, 'user-agent') || null
    ]
  )

  return {
    ok: true,
    user: { id: user.id, email: user.email, role: user.role, brokerId: user.broker_id }
  }
})
