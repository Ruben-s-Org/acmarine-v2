import { queryOne } from '~~/server/db/client'
import { validateSubdomain } from '~~/server/utils/subdomains'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const sub = typeof q.subdomain === 'string' ? q.subdomain : ''
  const check = validateSubdomain(sub)
  if (!check.ok) return { available: false, reason: check.reason }
  const existing = await queryOne<{ subdomain: string }>(
    event,
    `SELECT subdomain FROM subdomains WHERE subdomain = ? LIMIT 1`,
    [sub.toLowerCase()]
  )
  if (existing) return { available: false, reason: 'taken' }
  return { available: true }
})
