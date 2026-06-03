import type { H3Event } from 'h3'
import { requireSession, type SessionData } from './mp-session'

export interface BrokerScope {
  session: SessionData
  brokerId: string
}

export async function requireBroker(event: H3Event): Promise<BrokerScope> {
  const session = await requireSession(event)
  if (session.role === 'super_admin') {
    const q = getQuery(event)
    const brokerId = typeof q.broker_id === 'string' ? q.broker_id : session.brokerId
    if (!brokerId) throw createError({ statusCode: 400, statusMessage: 'broker_id required for super_admin' })
    return { session, brokerId }
  }
  if (!session.brokerId) throw createError({ statusCode: 403, statusMessage: 'No broker scope' })
  return { session, brokerId: session.brokerId }
}

export async function requireSuperAdmin(event: H3Event): Promise<SessionData> {
  const session = await requireSession(event)
  if (session.role !== 'super_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Super admin only' })
  }
  return session
}
