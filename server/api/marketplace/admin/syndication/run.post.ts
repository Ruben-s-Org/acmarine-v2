import { query, execute } from '~~/server/db/client'
import { requireSuperAdmin } from '~~/server/utils/authz'
import { getSyndicationAdapter, type Channel, type FeedListing } from '~~/server/adapters/syndication'
import { randomToken } from '~~/server/utils/crypto'

interface Body {
  channel?: Channel
  broker_id?: string
}

const CHANNELS: Channel[] = ['yachtworld', 'yatco', 'rightboat']

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  const body = await readBody<Body>(event)
  const channel = body?.channel
  if (!channel || !CHANNELS.includes(channel)) {
    throw createError({ statusCode: 400, statusMessage: 'channel required (yachtworld|yatco|rightboat)' })
  }
  if (!body?.broker_id) {
    throw createError({ statusCode: 400, statusMessage: 'broker_id required' })
  }

  const where: string[] = [`l.status = 'published'`, `b.syndication_enabled = 1`, `l.syndicate_${channel} = 1`, 'l.broker_id = ?']
  const args: unknown[] = [body.broker_id]

  const listings = await query<FeedListing>(
    event,
    `SELECT l.id, l.slug, l.headline, l.asking_price, l.currency, l.description,
            v.name AS vessel_name, v.make, v.model, v.year, v.length_ft, v.location
     FROM listings l
     JOIN vessels v ON v.id = l.vessel_id
     JOIN brokers b ON b.id = l.broker_id
     WHERE ${where.join(' AND ')}`,
    args
  )

  const runId = 'syn_' + randomToken(8)
  const adapter = getSyndicationAdapter(channel)

  await execute(
    event,
    `INSERT INTO syndication_runs (id, broker_id, channel, status, listing_count)
     VALUES (?, ?, ?, 'running', ?)`,
    [runId, body.broker_id, channel, listings.length]
  )

  try {
    const result = await adapter.build(listings)
    const env = (event.context as any).cloudflare?.env
    const blob = env?.BLOB as { put: (key: string, value: string, options?: any) => Promise<any> } | undefined
    const blobKey = `feeds/${channel}/${runId}.${channel === 'yatco' ? 'xml' : channel === 'rightboat' ? 'json' : 'tsv'}`
    if (blob) await blob.put(blobKey, result.body, { httpMetadata: { contentType: result.contentType } })

    await execute(
      event,
      `UPDATE syndication_runs SET status = 'success', blob_key = ?, finished_at = unixepoch() WHERE id = ?`,
      [blobKey, runId]
    )
    return { ok: true, run_id: runId, blob_key: blobKey, listing_count: result.listingCount }
  } catch (e: any) {
    await execute(
      event,
      `UPDATE syndication_runs SET status = 'failed', error = ?, finished_at = unixepoch() WHERE id = ?`,
      [e?.message || 'unknown', runId]
    )
    throw createError({ statusCode: 500, statusMessage: 'Syndication run failed' })
  }
})
