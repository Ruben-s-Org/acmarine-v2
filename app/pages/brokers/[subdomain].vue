<script setup lang="ts">
const route = useRoute()
const subdomain = route.params.subdomain as string

const { data, error } = await useFetch(`/api/marketplace/brokers/${subdomain}`, { key: `broker-${subdomain}` })
if (error.value || !data.value?.broker) {
  throw createError({ statusCode: 404, statusMessage: 'Broker not found', fatal: true })
}
const broker = computed(() => data.value!.broker)

const { data: listingsData } = await useFetch('/api/marketplace/listings', {
  query: { broker: subdomain },
  key: `broker-${subdomain}-listings`
})
const listings = computed(() => listingsData.value?.listings ?? [])

useHead(() => ({
  title: `${broker.value.display_name} | acmarine.co`,
  meta: [
    { name: 'description', content: broker.value.bio || `${broker.value.display_name} yacht brokerage on acmarine.co` },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
}))
</script>

<template>
  <main class="container mx-auto px-4 lg:px-6 py-12 space-y-10">
    <section class="space-y-2">
      <h1 class="font-serif text-4xl text-navy tracking-tight">{{ broker.display_name }}</h1>
      <p class="text-sm text-ink/60">
        {{ broker.active_listings }} active listings
        <template v-if="broker.license_state"> &middot; License {{ broker.license_state }}</template>
      </p>
      <p v-if="broker.bio" class="text-ink/80 max-w-2xl pt-2">{{ broker.bio }}</p>
      <p class="text-sm pt-2 flex gap-4">
        <a v-if="broker.phone" :href="`tel:${broker.phone}`" class="text-brass-deep hover:text-navy">{{ broker.phone }}</a>
        <a v-if="broker.email" :href="`mailto:${broker.email}`" class="text-brass-deep hover:text-navy">{{ broker.email }}</a>
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="font-serif text-2xl text-navy">Inventory</h2>
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
</template>
