<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Overview | acmarine.co' })

const route = useRoute()
const welcome = computed(() => route.query.welcome === '1')

await refreshMe()
const user = useCurrentUser()
const broker = useCurrentBroker()

if (!user.value) await navigateTo('/auth/login')
else if (!broker.value) await navigateTo('/onboarding')

const { data: leadsData } = await useFetch<{ leads: any[] }>('/api/marketplace/broker/leads', { key: 'overview-leads' })
const { data: listingsData } = await useFetch<{ listings: any[] }>('/api/marketplace/broker/listings', { key: 'overview-listings' })
const { data: dealsData } = await useFetch<{ deals: any[] }>('/api/marketplace/broker/deals', { key: 'overview-deals' })

const newLeads = computed(() => (leadsData.value?.leads ?? []).filter(l => l.status === 'new').length)
const publishedListings = computed(() => (listingsData.value?.listings ?? []).filter(l => l.status === 'published').length)
const openDeals = computed(() => (dealsData.value?.deals ?? []).filter(d => !d.closed_at).length)

function ago(ts: number | null | undefined) {
  if (!ts) return ''
  const s = Math.floor(Date.now() / 1000) - ts
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-10 space-y-8 flex-1">
    <section v-if="welcome" class="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
      <p class="font-medium">Microsite live.</p>
      <p class="text-sm">
        <a :href="`https://${broker?.subdomain}.acmarine.co`" target="_blank" rel="noopener" class="underline">
          {{ broker?.subdomain }}.acmarine.co
        </a>
      </p>
    </section>

    <section>
      <h1 class="text-2xl font-semibold tracking-tight">Overview</h1>
      <p class="text-muted-foreground">{{ broker?.display_name }}</p>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <NuxtLink to="/dashboard/leads" class="rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
        <p class="text-xs uppercase tracking-wide text-muted-foreground">New leads</p>
        <p class="text-3xl font-semibold mt-1">{{ newLeads }}</p>
      </NuxtLink>
      <NuxtLink to="/dashboard/listings" class="rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
        <p class="text-xs uppercase tracking-wide text-muted-foreground">Published listings</p>
        <p class="text-3xl font-semibold mt-1">{{ publishedListings }}</p>
      </NuxtLink>
      <NuxtLink to="/dashboard/deals" class="rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
        <p class="text-xs uppercase tracking-wide text-muted-foreground">Open deals</p>
        <p class="text-3xl font-semibold mt-1">{{ openDeals }}</p>
      </NuxtLink>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Recent leads</h2>
      <div v-if="(leadsData?.leads ?? []).length" class="rounded-lg border border-border divide-y divide-border">
        <NuxtLink
          v-for="l in (leadsData?.leads ?? []).slice(0, 5)"
          :key="l.id"
          to="/dashboard/leads"
          class="flex items-center justify-between p-4 hover:bg-muted/40"
        >
          <div>
            <p class="font-medium">{{ l.name }}</p>
            <p class="text-sm text-muted-foreground">{{ l.email }} {{ l.listing_headline ? '· ' + l.listing_headline : '' }}</p>
          </div>
          <div class="text-right text-sm">
            <p :class="l.status === 'new' ? 'text-emerald-600' : 'text-muted-foreground'">{{ l.status }}</p>
            <p class="text-muted-foreground">{{ ago(l.created_at) }}</p>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="text-muted-foreground">No leads yet.</p>
    </section>
  </main>
</template>
