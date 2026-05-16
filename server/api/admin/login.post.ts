export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const password = body?.password || ''
  const env = getEnv(event)
  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    await new Promise(r => setTimeout(r, 400))
    throw createError({ statusCode: 401, statusMessage: 'invalid' })
  }
  const token = await makeSessionToken(env.SESSION_SECRET)
  setSessionCookie(event, token)
  return { ok: true }
})
