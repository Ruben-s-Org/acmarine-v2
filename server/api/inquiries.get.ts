export default defineEventHandler(async (event) => {
  if (!(await verifySession(event))) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const bucket = getBucket(event)
  return { inquiries: await listInquiries(bucket) }
})
