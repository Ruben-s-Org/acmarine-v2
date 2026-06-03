<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Deals | acmarine.co' })

await refreshMe()
const user = useCurrentUser()
const broker = useCurrentBroker()
if (!user.value) await navigateTo('/auth/login')
else if (!broker.value) await navigateTo('/onboarding')

const STAGES = [
  { id: 'inquiry', label: 'Inquiry' },
  { id: 'showing', label: 'Showing' },
  { id: 'offer', label: 'Offer' },
  { id: 'survey', label: 'Survey' },
  { id: 'sea_trial', label: 'Sea trial' },
  { id: 'closing', label: 'Closing' },
  { id: 'closed_won', label: 'Closed won' },
  { id: 'closed_lost', label: 'Closed lost' }
]

const { data, refresh } = await useFetch<{ deals: any[]; by_stage: Record<string, any[]> }>('/api/marketplace/broker/deals', { key: 'broker-deals' })
const byStage = computed(() => data.value?.by_stage ?? {})

async function moveDeal(deal: any, stage: string) {
  await $fetch(`/api/broker/deals/${deal.id}`, { method: 'PATCH', body: { stage } })
  await refresh()
}

function fmtPrice(p: number | null, c: string) {
  if (!p) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: c || 'USD', maximumFractionDigits: 0 }).format(p)
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-6 py-10 space-y-6 flex-1">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">Deals</h1>
    </header>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div v-for="s in STAGES" :key="s.id" class="rounded-lg border border-border p-3 space-y-2 min-h-48">
        <div class="flex items-baseline justify-between">
          <h2 class="text-xs uppercase tracking-wide text-muted-foreground">{{ s.label }}</h2>
          <span class="text-xs text-muted-foreground">{{ (byStage[s.id] || []).length }}</span>
        </div>
        <div v-if="(byStage[s.id] || []).length" class="space-y-2">
          <article
            v-for="d in byStage[s.id]"
            :key="d.id"
            class="rounded border border-border bg-background p-3 space-y-1"
          >
            <p class="font-medium text-sm">{{ d.vessel_name }}</p>
            <p class="text-xs text-muted-foreground">{{ [d.year, d.make, d.model].filter(Boolean).join(' · ') }}</p>
            <p v-if="d.buyer_name" class="text-xs">Buyer: {{ d.buyer_name }}</p>
            <p v-if="d.offer_amount" class="text-xs">Offer: {{ fmtPrice(d.offer_amount, d.currency) }}</p>
            <select :value="d.stage" @change="moveDeal(d, ($event.target as HTMLSelectElement).value)" class="w-full mt-1 rounded border border-border bg-background px-2 py-1 text-xs">
              <option v-for="o in STAGES" :key="o.id" :value="o.id">{{ o.label }}</option>
            </select>
          </article>
        </div>
        <p v-else class="text-xs text-muted-foreground">No deals.</p>
      </div>
    </div>
  </main>
</template>
