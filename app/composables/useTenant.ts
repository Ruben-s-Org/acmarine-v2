import { parseTheme, themeCssVars } from '#shared/theme'

export interface TenantPayload {
  resolved: boolean
  host?: string
  subdomain: string | null
  isApex: boolean
  isApp: boolean
  isMicrosite: boolean
  broker: null | {
    id: string
    subdomain: string
    display_name: string
    status: string
    email: string
  }
  theme: ReturnType<typeof parseTheme>
  themeCss: string
}

const empty = (): TenantPayload => ({
  resolved: false,
  subdomain: null,
  isApex: false,
  isApp: false,
  isMicrosite: false,
  broker: null,
  theme: null,
  themeCss: ''
})

export const useTenant = () => useState<TenantPayload>('tenant', empty)

export async function loadTenant(): Promise<TenantPayload> {
  const state = useTenant()
  if (state.value.resolved) return state.value

  if (import.meta.server) {
    const event = useRequestEvent()
    const t = event?.context?.tenant
    if (t) {
      const theme = t.broker?.theme ? parseTheme(t.broker.theme) : null
      const payload: TenantPayload = {
        resolved: true,
        host: t.host,
        subdomain: t.subdomain,
        isApex: t.isApex,
        isApp: t.isApp,
        isMicrosite: t.isMicrosite,
        broker: t.broker
          ? {
              id: t.broker.id,
              subdomain: t.broker.subdomain,
              display_name: t.broker.display_name,
              status: t.broker.status,
              email: t.broker.email
            }
          : null,
        theme,
        themeCss: t.isMicrosite ? themeCssVars(theme) : ''
      }
      state.value = payload
      return payload
    }
  }

  const payload = await $fetch<TenantPayload>('/api/marketplace/tenant')
  state.value = payload
  return payload
}
