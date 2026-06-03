<script setup lang="ts">
const props = defineProps<{
  listing: {
    slug: string
    headline: string
    asking_price: number | null
    currency: string
    make: string | null
    model: string | null
    year: number | null
    length_ft: number | null
    location: string | null
    broker_subdomain: string
    broker_display_name: string
    cover_blob_key: string | null
  }
  hideBroker?: boolean
}>()

const priceLabel = computed(() => {
  if (!props.listing.asking_price) return 'POA'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: props.listing.currency, maximumFractionDigits: 0 }).format(props.listing.asking_price)
})

const subtitle = computed(() => {
  const parts: string[] = []
  if (props.listing.year) parts.push(String(props.listing.year))
  if (props.listing.make) parts.push(props.listing.make)
  if (props.listing.model) parts.push(props.listing.model)
  if (props.listing.length_ft) parts.push(`${props.listing.length_ft}'`)
  return parts.join(' · ')
})
</script>

<template>
  <NuxtLink :to="`/listings/${listing.slug}`" class="group block rounded-lg border border-border overflow-hidden bg-background hover:shadow-md transition-shadow">
    <div class="aspect-[4/3] bg-muted relative flex items-center justify-center text-muted-foreground">
      <span class="text-xs">no photo yet</span>
    </div>
    <div class="p-4 space-y-1">
      <p class="text-xs text-muted-foreground">{{ subtitle }}</p>
      <h3 class="font-medium leading-snug group-hover:underline">{{ listing.headline }}</h3>
      <div class="flex items-baseline justify-between pt-1">
        <span class="font-semibold">{{ priceLabel }}</span>
        <span v-if="listing.location" class="text-xs text-muted-foreground">{{ listing.location }}</span>
      </div>
      <p v-if="!hideBroker" class="text-xs text-muted-foreground pt-1">
        {{ listing.broker_display_name }}
      </p>
    </div>
  </NuxtLink>
</template>
