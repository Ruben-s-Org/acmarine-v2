<script setup lang="ts">
const props = defineProps<{
  broker: {
    id: string
    subdomain: string
    display_name: string
    status: string
    email: string
  }
}>()

const { data: listingsData } = await useFetch<{ listings: any[] }>('/api/marketplace/listings', {
  query: { broker: props.broker.subdomain },
  key: () => `microsite-${props.broker.subdomain}-listings`
})
const listings = computed(() => listingsData.value?.listings ?? [])

const { data: brokerData } = await useFetch<{ broker: any }>(`/api/marketplace/brokers/${props.broker.subdomain}`, {
  key: () => `microsite-${props.broker.subdomain}-profile`
})
const profile = computed(() => brokerData.value?.broker ?? null)

useHead(() => ({
  title: `${props.broker.display_name}, yacht brokerage`,
  meta: [
    { name: 'description', content: profile.value?.bio || `${props.broker.display_name} yacht brokerage on acmarine.co` },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#0a1e3a' },
    { property: 'og:title', content: props.broker.display_name },
    { property: 'og:description', content: profile.value?.bio || '' },
    { property: 'og:type', content: 'website' }
  ],
  link: [{ rel: 'canonical', href: `https://${props.broker.subdomain}.acmarine.co/` }]
}))
</script>

<template>
  <div>
    <section class="border-b border-rule bg-ivory">
      <div class="container mx-auto px-4 lg:px-6 py-16 sm:py-20 space-y-4">
        <p class="text-xs uppercase tracking-[0.22em] text-brass-deep">acmarine.co broker</p>
        <h1 class="font-serif text-4xl sm:text-5xl text-navy tracking-tight">{{ broker.display_name }}</h1>
        <p v-if="profile?.bio" class="text-ink/80 max-w-2xl text-lg leading-relaxed">{{ profile.bio }}</p>
        <p class="text-sm text-ink/60 pt-2 flex flex-wrap gap-4">
          <span v-if="profile?.license_state">License {{ profile.license_state }}</span>
          <a v-if="profile?.phone" :href="`tel:${profile.phone}`" class="text-brass-deep hover:text-navy">{{ profile.phone }}</a>
          <a v-if="profile?.email" :href="`mailto:${profile.email}`" class="text-brass-deep hover:text-navy">{{ profile.email }}</a>
        </p>
      </div>
    </section>

    <main class="container mx-auto px-4 lg:px-6 py-12 space-y-12">
      <section class="space-y-4">
        <div class="flex items-baseline justify-between">
          <h2 class="font-serif text-2xl text-navy">Inventory</h2>
          <span class="text-sm text-ink/60">{{ listings.length }} listed</span>
        </div>
        <div v-if="listings.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ListingCard v-for="l in listings" :key="l.id" :listing="l" hide-broker />
        </div>
        <p v-else class="text-ink/60">No active listings.</p>
      </section>

      <section class="rounded-lg border border-rule p-6 bg-ivory">
        <h2 class="font-serif text-xl text-navy mb-3">Contact {{ broker.display_name }}</h2>
        <LeadForm :broker-subdomain="broker.subdomain" :broker-name="broker.display_name" />
      </section>
    </main>
  </div>
</template>
