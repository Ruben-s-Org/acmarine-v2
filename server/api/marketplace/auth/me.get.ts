import { readSession } from '~~/server/utils/mp-session'
import { queryOne } from '~~/server/db/client'

export default defineEventHandler(async (event) => {
  const session = await readSession(event)
  if (!session) return { user: null }

  const user = await queryOne<any>(
    event,
    `SELECT id, email, name, role, broker_id, status FROM users WHERE id = ? LIMIT 1`,
    [session.uid]
  )
  if (!user || user.status === 'suspended') return { user: null }

  let broker = null
  if (user.broker_id) {
    broker = await queryOne<any>(
      event,
      `SELECT id, subdomain, display_name, status FROM brokers WHERE id = ? LIMIT 1`,
      [user.broker_id]
    )
  }
  return { user, broker }
})
