import { parseTheme, themeCssVars } from '#shared/theme'

export default defineEventHandler((event) => {
  const tenant = event.context.tenant
  if (!tenant) return { resolved: false }
  const theme = tenant.broker?.theme ? parseTheme(tenant.broker.theme) : null
  return {
    resolved: true,
    host: tenant.host,
    subdomain: tenant.subdomain,
    isApex: tenant.isApex,
    isApp: tenant.isApp,
    isMicrosite: tenant.isMicrosite,
    broker: tenant.broker
      ? {
          id: tenant.broker.id,
          subdomain: tenant.broker.subdomain,
          display_name: tenant.broker.display_name,
          status: tenant.broker.status,
          email: tenant.broker.email
        }
      : null,
    theme,
    themeCss: tenant.isMicrosite ? themeCssVars(theme) : ''
  }
})
