export default defineEventHandler(async (event) => {
  if (!(await verifySession(event))) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const id = getRouterParam(event, 'id')!
  const bucket = getBucket(event)
  const all = await readListings(bucket)
  if (!all[id]) throw createError({ statusCode: 404, statusMessage: 'not found' })
  delete all[id]
  await writeListings(bucket, all)
  return { ok: true }
})
