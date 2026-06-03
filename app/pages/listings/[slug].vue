<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data, error } = await useFetch(`/api/marketplace/listings/${slug}`, { key: `listing-${slug}` })

if (error.value || !data.value?.listing) {
  throw createError({ statusCode: 404, statusMessage: 'Listing not found', fatal: true })
}

const listing = computed(() => data.value!.listing)
const media = computed(() => data.value!.media ?? [])
const canonical = computed(() => data.value!.canonical as string)

const tenant = await loadTenant()
const isMicrosite = computed(() => tenant.isMicrosite === true)
const tenantBroker = computed(() => tenant.broker || null)

const priceLabel = computed(() => {
  const v = listing.value
  if (!v.asking_price) return 'POA'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: v.currency || 'USD', maximumFractionDigits: 0 }).format(v.asking_price)
})

const jsonLd = computed(() => {
  const v = listing.value
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: v.headline,
    description: v.description || v.vessel_description,
    brand: v.make ? { '@type': 'Brand', name: v.make } : undefined,
    model: v.model || undefined,
    productionDate: v.year ? String(v.year) : undefined,
    offers: {
      '@type': 'Offer',
      url: canonical.value,
      priceCurrency: v.currency || 'USD',
      price: v.asking_price || 0,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: v.broker_display_name,
        url: `https://${v.broker_subdomain}.acmarine.co`
      }
    },
    additionalProperty: [
      v.length_ft ? { '@type': 'PropertyValue', name: 'Length (ft)', value: v.length_ft } : null,
      v.beam_ft ? { '@type': 'PropertyValue', name: 'Beam (ft)', value: v.beam_ft } : null,
      v.draft_ft ? { '@type': 'PropertyValue', name: 'Draft (ft)', value: v.draft_ft } : null,
      v.engine_make ? { '@type': 'PropertyValue', name: 'Engine', value: `${v.engine_make}${v.engine_model ? ' ' + v.engine_model : ''}` } : null,
      v.engine_hours ? { '@type': 'PropertyValue', name: 'Engine hours', value: v.engine_hours } : null,
      v.fuel_type ? { '@type': 'PropertyValue', name: 'Fuel', value: v.fuel_type } : null
    ].filter(Boolean)
  }
})

useHead(() => ({
  title: `${listing.value.headline} | acmarine.co`,
  link: [{ rel: 'canonical', href: canonical.value }],
  meta: [
    { name: 'description', content: (listing.value.description || listing.value.vessel_description || '').slice(0, 160) },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { property: 'og:title', content: listing.value.headline },
    { property: 'og:description', content: (listing.value.description || '').slice(0, 200) },
    { property: 'og:type', content: 'product' },
    { property: 'og:url', content: canonical.value }
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd.value) }
  ]
}))
</script>

<template>
  <main class="container mx-auto px-4 lg:px-6 py-10 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-10">
      <article class="space-y-8">
        <div>
          <p class="text-sm text-muted-foreground">
            {{ [listing.year, listing.make, listing.model].filter(Boolean).join(' · ') }}
          </p>
          <h1 class="text-3xl font-semibold tracking-tight mt-1">{{ listing.headline }}</h1>
          <p class="mt-2 text-lg font-medium">{{ priceLabel }}</p>
          <p v-if="listing.location" class="text-sm text-muted-foreground">{{ listing.location }}</p>
        </div>

        <div class="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
          <span class="text-sm">Photos coming soon</span>
        </div>

        <section class="space-y-3">
          <h2 class="text-xl font-medium">About this vessel</h2>
          <p class="leading-relaxed whitespace-pre-line">{{ listing.description || listing.vessel_description }}</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-medium">Specifications</h2>
          <dl class="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
            <template v-for="row in [
              ['Make', listing.make],
              ['Model', listing.model],
              ['Year', listing.year],
              ['Length', listing.length_ft ? listing.length_ft + ' ft' : null],
              ['Beam', listing.beam_ft ? listing.beam_ft + ' ft' : null],
              ['Draft', listing.draft_ft ? listing.draft_ft + ' ft' : null],
              ['Hull', listing.hull_material],
              ['Engine', listing.engine_make ? (listing.engine_make + (listing.engine_model ? ' ' + listing.engine_model : '')) : null],
              ['Engine hours', listing.engine_hours],
              ['Fuel', listing.fuel_type],
              ['Location', listing.location]
            ]" :key="row[0]">
              <template v-if="row[1] !== null && row[1] !== undefined && row[1] !== ''">
                <dt class="text-muted-foreground">{{ row[0] }}</dt>
                <dd class="font-medium col-span-1 sm:col-span-2">{{ row[1] }}</dd>
              </template>
            </template>
          </dl>
        </section>
      </article>

      <aside class="space-y-6 lg:sticky lg:top-6 self-start">
        <div class="rounded-lg border border-border p-5 space-y-3">
          <p class="text-xs uppercase tracking-wide text-muted-foreground">Listed by</p>
          <NuxtLink :to="`/brokers/${listing.broker_subdomain}`" class="block font-medium hover:underline">
            {{ listing.broker_display_name }}
          </NuxtLink>
          <p v-if="listing.broker_phone" class="text-sm text-muted-foreground">{{ listing.broker_phone }}</p>
        </div>
        <div class="rounded-lg border border-border p-5">
          <h2 class="text-base font-medium mb-3">Inquire about this listing</h2>
          <LeadForm
            :listing-slug="listing.slug"
            :broker-subdomain="listing.broker_subdomain"
            :broker-name="listing.broker_display_name"
          />
        </div>
      </aside>
  </main>
</template>
