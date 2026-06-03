<script setup lang="ts">
const { data } = await useFetch('/api/marketplace/brokers', { key: 'brokers-list' })
const brokers = computed(() => data.value?.brokers ?? [])

useHead({
  title: 'Brokers | acmarine.co',
  meta: [
    { name: 'description', content: 'Independent yacht brokers listing inventory on acmarine.co.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<template>
  <main class="container mx-auto px-4 lg:px-6 py-12 space-y-8">
    <section>
      <h1 class="text-3xl font-semibold tracking-tight text-navy">Brokers on acmarine.co</h1>
      <p class="text-ink/70 mt-1">Independent yacht brokers listing inventory on the platform.</p>
    </section>
    <div v-if="brokers.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="b in brokers"
        :key="b.id"
        :to="`/brokers/${b.subdomain}`"
        class="block rounded-lg border border-rule p-5 hover:shadow-md transition-shadow bg-ivory"
      >
        <p class="font-serif text-xl text-navy">{{ b.display_name }}</p>
        <p class="text-sm text-ink/60">{{ b.active_listings }} active listings</p>
        <p v-if="b.bio" class="mt-2 text-sm text-ink/70 line-clamp-3">{{ b.bio }}</p>
      </NuxtLink>
    </div>
    <p v-else class="text-ink/60">No brokers yet.</p>
  </main>
</template>
