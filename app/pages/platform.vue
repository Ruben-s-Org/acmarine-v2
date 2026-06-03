<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Admin | acmarine.co' })

await refreshMe()
const user = useCurrentUser()
if (!user.value) await navigateTo('/auth/login')
else if (user.value.role !== 'super_admin') {
  throw createError({ statusCode: 403, statusMessage: 'Super admin only', fatal: true })
}

const { data: brokers, refresh: refreshBrokers } = await useFetch<{ brokers: any[] }>('/api/marketplace/admin/brokers', { key: 'admin-brokers' })
const { data: health } = await useFetch<any>('/api/marketplace/admin/health', { key: 'admin-health' })

async function setBrokerStatus(id: string, status: string) {
  await $fetch(`/api/admin/brokers/${id}`, { method: 'PATCH', body: { status } })
  await refreshBrokers()
}
async function toggleSyndication(id: string, value: boolean) {
  await $fetch(`/api/admin/brokers/${id}`, { method: 'PATCH', body: { syndication_enabled: value } })
  await refreshBrokers()
}

function fmtDate(ts: number | null) { return ts ? new Date(ts * 1000).toISOString().slice(0, 10) : '' }
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-10 space-y-8 flex-1">
    <header>
      <p class="text-xs uppercase tracking-wide text-muted-foreground">Super admin</p>
      <h1 class="text-2xl font-semibold tracking-tight">Platform</h1>
    </header>

    <section v-if="health" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="rounded-lg border border-border p-5">
        <p class="text-xs uppercase tracking-wide text-muted-foreground">Brokers</p>
        <ul class="mt-2 text-sm space-y-1">
          <li v-for="b in health.brokers" :key="b.status">{{ b.status }}: {{ b.n }}</li>
        </ul>
      </div>
      <div class="rounded-lg border border-border p-5">
        <p class="text-xs uppercase tracking-wide text-muted-foreground">Listings</p>
        <ul class="mt-2 text-sm space-y-1">
          <li v-for="b in health.listings" :key="b.status">{{ b.status }}: {{ b.n }}</li>
        </ul>
      </div>
      <div class="rounded-lg border border-border p-5">
        <p class="text-xs uppercase tracking-wide text-muted-foreground">Leads</p>
        <ul class="mt-2 text-sm space-y-1">
          <li v-for="b in health.leads" :key="b.status">{{ b.status }}: {{ b.n }}</li>
        </ul>
      </div>
    </section>

    <section v-if="(health?.license_alerts?.expired?.length || 0) || (health?.license_alerts?.expiring_within_60_days?.length || 0)" class="rounded-lg border border-amber-300 bg-amber-50 p-5">
      <p class="font-medium text-amber-900">License alerts</p>
      <ul class="mt-2 text-sm space-y-1 text-amber-900">
        <li v-for="b in health.license_alerts.expired" :key="b.id">
          <strong>Expired</strong>, {{ b.display_name }} ({{ b.license_state }}): {{ fmtDate(b.license_expires) }}
        </li>
        <li v-for="b in health.license_alerts.expiring_within_60_days" :key="b.id">
          Expiring soon, {{ b.display_name }} ({{ b.license_state }}): {{ fmtDate(b.license_expires) }}
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-lg font-medium mb-3">Brokers</h2>
      <div class="rounded-lg border border-border overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-muted/40 text-left text-muted-foreground">
            <tr>
              <th class="p-3">Broker</th>
              <th class="p-3">Compliance</th>
              <th class="p-3">Activity</th>
              <th class="p-3">Status</th>
              <th class="p-3">Syndication</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="b in brokers?.brokers ?? []" :key="b.id">
              <td class="p-3">
                <p class="font-medium">{{ b.display_name }}</p>
                <p class="text-muted-foreground">{{ b.subdomain }}.acmarine.co</p>
                <p class="text-muted-foreground text-xs">{{ b.email }}</p>
              </td>
              <td class="p-3 text-muted-foreground">
                <div v-if="b.license_number">{{ b.license_state }} {{ b.license_number }}</div>
                <div v-if="b.license_expires" class="text-xs">expires {{ fmtDate(b.license_expires) }}</div>
              </td>
              <td class="p-3 text-muted-foreground">
                <p>{{ b.published_listings }} / {{ b.total_listings }} listings</p>
                <p>{{ b.open_leads }} open / {{ b.total_leads }} leads</p>
              </td>
              <td class="p-3">
                <select :value="b.status" @change="setBrokerStatus(b.id, ($event.target as HTMLSelectElement).value)" class="rounded border border-border bg-background px-2 py-1">
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="suspended">suspended</option>
                  <option value="archived">archived</option>
                </select>
              </td>
              <td class="p-3">
                <label class="flex items-center gap-2 text-xs">
                  <input type="checkbox" :checked="!!b.syndication_enabled" @change="toggleSyndication(b.id, ($event.target as HTMLInputElement).checked)" />
                  Enabled
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="health?.recent_auth_events?.length" class="space-y-3">
      <h2 class="text-lg font-medium">Recent auth events</h2>
      <div class="rounded-lg border border-border divide-y divide-border text-sm">
        <div v-for="e in health.recent_auth_events" :key="e.id" class="p-3 flex justify-between">
          <span><strong>{{ e.kind }}</strong> · {{ e.email }}</span>
          <span class="text-muted-foreground">{{ new Date(e.created_at * 1000).toLocaleString() }}</span>
        </div>
      </div>
    </section>
  </main>
</template>
