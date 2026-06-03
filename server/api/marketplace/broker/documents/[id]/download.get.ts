import { queryOne } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const doc = await queryOne<{ blob_key: string; broker_id: string }>(
    event,
    `SELECT blob_key, broker_id FROM documents WHERE id = ? LIMIT 1`,
    [id]
  )
  if (!doc || doc.broker_id !== brokerId) throw createError({ statusCode: 404, statusMessage: 'Document not found' })

  const env = (event.context as any).cloudflare?.env
  const blob = env?.BLOB as { get: (key: string) => Promise<{ body: ReadableStream } | null> } | undefined
  if (!blob) throw createError({ statusCode: 500, statusMessage: 'R2 binding missing' })
  const obj = await blob.get(doc.blob_key)
  if (!obj) throw createError({ statusCode: 404, statusMessage: 'Object not found' })

  setHeader(event, 'content-type', 'application/pdf')
  setHeader(event, 'content-disposition', `inline; filename="acmarine-${id}.pdf"`)
  return obj.body
})
