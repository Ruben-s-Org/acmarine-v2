interface CurrentUser {
  id: string
  email: string
  name: string | null
  role: 'super_admin' | 'broker_of_record' | 'broker' | 'staff'
  broker_id: string | null
  status: string
}
interface CurrentBroker {
  id: string
  subdomain: string
  display_name: string
  status: string
}

export const useCurrentUser = () => useState<CurrentUser | null>('current_user', () => null)
export const useCurrentBroker = () => useState<CurrentBroker | null>('current_broker', () => null)

export async function refreshMe() {
  const user = useCurrentUser()
  const broker = useCurrentBroker()
  try {
    const r = await $fetch<{ user: CurrentUser | null; broker: CurrentBroker | null }>('/api/marketplace/auth/me')
    user.value = r.user
    broker.value = r.broker ?? null
    return r
  } catch {
    user.value = null
    broker.value = null
    return { user: null, broker: null }
  }
}
