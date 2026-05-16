export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const includeDrafts = query.drafts === '1' && (await verifySession(event))
  const bucket = getBucket(event)
  const all = await readListings(bucket)
  const items = Object.values(all).filter(l => includeDrafts || l.status !== 'draft')
  items.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
  return { listings: items }
})
