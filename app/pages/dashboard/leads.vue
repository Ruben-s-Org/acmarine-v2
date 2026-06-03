<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Leads | acmarine.co' })

await refreshMe()
const user = useCurrentUser()
const broker = useCurrentBroker()
if (!user.value) await navigateTo('/auth/login')
else if (!broker.value) await navigateTo('/onboarding')

const statusFilter = ref<'all' | 'new' | 'contacted' | 'qualified' | 'closed'>('all')

const { data, refresh } = await useFetch<{ leads: any[] }>('/api/marketplace/broker/leads', {
  query: computed(() => statusFilter.value === 'all' ? {} : { status: statusFilter.value }),
  key: 'broker-leads',
  watch: [statusFilter]
})
const leads = computed(() => data.value?.leads ?? [])

const responseTime = (l: any) => {
  if (!l.first_response_at) return null
  return l.first_response_at - l.created_at
}
function fmtDuration(s: number | null) {
  if (s == null) return '—'
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}
function fmtDate(ts: number) {
  return new Date(ts * 1000).toLocaleString()
}

async function setStatus(lead: any, status: string) {
  await $fetch(`/api/broker/leads/${lead.id}`, { method: 'PATCH', body: { status } })
  await refresh()
}
async function markResponded(lead: any) {
  await $fetch(`/api/broker/leads/${lead.id}`, { method: 'PATCH', body: { responded: true, status: 'contacted' } })
  await refresh()
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-10 space-y-6 flex-1">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">Leads</h1>
      <div class="flex gap-2 text-sm">
        <button
          v-for="s in ['all','new','contacted','qualified','closed']"
          :key="s"
          @click="statusFilter = s as any"
          :class="['rounded border px-3 py-1', statusFilter === s ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:text-foreground']"
        >
          {{ s }}
        </button>
      </div>
    </header>

    <div v-if="leads.length" class="rounded-lg border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th class="p-3">Lead</th>
            <th class="p-3">Listing</th>
            <th class="p-3">Created</th>
            <th class="p-3">First response</th>
            <th class="p-3">Status</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="l in leads" :key="l.id">
            <td class="p-3">
              <p class="font-medium">{{ l.name }}</p>
              <p class="text-muted-foreground">
                <a :href="`mailto:${l.email}`" class="hover:underline">{{ l.email }}</a>
                <template v-if="l.phone"> · {{ l.phone }}</template>
              </p>
              <p v-if="l.message" class="text-muted-foreground mt-1 line-clamp-2">{{ l.message }}</p>
            </td>
            <td class="p-3 align-top">
              <a v-if="l.listing_slug" :href="`/listings/${l.listing_slug}`" target="_blank" rel="noopener" class="text-muted-foreground hover:underline">
                {{ l.listing_headline }}
              </a>
              <span v-else class="text-muted-foreground">general</span>
            </td>
            <td class="p-3 align-top text-muted-foreground">{{ fmtDate(l.created_at) }}</td>
            <td class="p-3 align-top">
              <span :class="responseTime(l) !== null ? 'text-foreground' : 'text-amber-600'">
                {{ fmtDuration(responseTime(l)) }}
              </span>
            </td>
            <td class="p-3 align-top">
              <select :value="l.status" @change="setStatus(l, ($event.target as HTMLSelectElement).value)" class="rounded border border-border bg-background px-2 py-1">
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="qualified">qualified</option>
                <option value="closed">closed</option>
              </select>
            </td>
            <td class="p-3 align-top">
              <button v-if="!l.first_response_at" @click="markResponded(l)" class="rounded border border-border px-2 py-1 hover:bg-muted/40">
                Mark responded
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-muted-foreground">No leads match.</p>
  </main>
</template>
