import { execute, queryOne } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'

interface Body {
  headline?: string
  asking_price?: number | null
  description?: string | null
  status?: 'draft' | 'published' | 'sold' | 'withdrawn'
  syndicate_yachtworld?: boolean
  syndicate_yatco?: boolean
  syndicate_rightboat?: boolean
}

const FIELDS = [
  'headline', 'asking_price', 'description',
  'syndicate_yachtworld', 'syndicate_yatco', 'syndicate_rightboat'
] as const

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const existing = await queryOne<{ id: string; status: string; published_at: number | null }>(
    event,
    `SELECT id, status, published_at FROM listings WHERE id = ? AND broker_id = ? LIMIT 1`,
    [id, brokerId]
  )
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Listing not found' })

  const body = await readBody<Body>(event)
  const updates: string[] = []
  const args: unknown[] = []

  for (const f of FIELDS) {
    if (f in (body ?? {})) {
      updates.push(`${f} = ?`)
      const v = (body as any)[f]
      args.push(typeof v === 'boolean' ? (v ? 1 : 0) : v)
    }
  }
  if (body?.status && ['draft', 'published', 'sold', 'withdrawn'].includes(body.status)) {
    updates.push('status = ?')
    args.push(body.status)
    if (body.status === 'published' && !existing.published_at) {
      updates.push('published_at = unixepoch()')
    }
  }
  if (!updates.length) return { ok: true, changed: false }

  updates.push('updated_at = unixepoch()')
  args.push(id, brokerId)
  await execute(
    event,
    `UPDATE listings SET ${updates.join(', ')} WHERE id = ? AND broker_id = ?`,
    args
  )
  return { ok: true, changed: true }
})
