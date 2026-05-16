export default defineEventHandler(async (event) => {
  return { authenticated: await verifySession(event) }
})
