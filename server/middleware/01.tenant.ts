import { resolveTenant, type TenantContext } from '../utils/tenant'

declare module 'h3' {
  interface H3EventContext {
    tenant?: TenantContext
  }
}

export default defineEventHandler(async (event) => {
  // Only resolve once per request; skip for asset requests handled by Workers Assets.
  if (event.context.tenant) return
  const url = getRequestURL(event)
  if (url.pathname.startsWith('/_nuxt') || url.pathname.startsWith('/__nuxt')) return
  event.context.tenant = await resolveTenant(event)
})
