import { clearSessionCookie } from '~~/server/utils/mp-session'

export default defineEventHandler((event) => {
  clearSessionCookie(event)
  return { ok: true }
})
