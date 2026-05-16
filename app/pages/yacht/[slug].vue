<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { useInquire } from '~/composables/useInquire'
import type { Listing } from '~~/shared/types'

const route = useRoute()
const slug = route.params.slug as string
const { data, error } = await useFetch<{ listings: Listing[] }>('/api/listings')
const listing = computed(() => (data.value?.listings || []).find(l => l.slug === slug))

if (!listing.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const l = listing.value
const { openDialog } = useInquire()

function lengthLabel(loa?: number) {
  if (typeof loa !== 'number') return ''
  const m = loa.toFixed(1).replace(/\.0$/, '')
  const ft = (loa * 3.28084).toFixed(0)
  return `${m} m / ${ft} ft`
}

const len = lengthLabel(l.loa_m)
const statusLabel = l.status === 'sale-pending' ? 'Sale Pending' : l.status === 'sold' ? 'Sold' : 'Available'

const specRows = [
  ['Class', l.boatClass],
  ['Builder', l.builder],
  ['Model', l.boatModel],
  ['Year', l.year ? String(l.year) : ''],
  ['Length overall', len],
  ['Beam', l.beam_m ? `${l.beam_m} m` : ''],
  ['Capacity', l.capacity ? `${l.capacity} guests` : ''],
  ['Engine', l.engine],
  ['Total Power', typeof l.power === 'number' ? `${l.power} hp` : ''],
  ['Engine Hours', typeof l.engineHours === 'number' ? l.engineHours.toLocaleString() : ''],
  ['Classification', l.class_society],
  ['Condition', l.condition ? l.condition.charAt(0).toUpperCase() + l.condition.slice(1) : ''],
  ['Location', l.location],
  ...Object.entries(l.specs || {}),
].filter(([, v]) => v)

const chips = [
  l.boatClass && { label: 'Class', value: l.boatClass },
  l.boatModel && { label: 'Model', value: l.boatModel },
  l.year && { label: 'Year', value: String(l.year) },
  len && { label: 'Length', value: len },
  typeof l.power === 'number' && { label: 'Power', value: `${l.power} hp` },
  typeof l.engineHours === 'number' && { label: 'Engine Hours', value: l.engineHours.toLocaleString() },
  l.capacity && { label: 'Capacity', value: `${l.capacity} guests` },
].filter(Boolean) as { label: string; value: string }[]

useSeoMeta({
  title: `${l.name}. Aldridge & Charles Marine.`,
  description: l.short || (l.description ? l.description.slice(0, 160) : `${l.name}, presented by Aldridge & Charles Marine.`),
  ogTitle: `${l.name}. Aldridge & Charles Marine.`,
  ogDescription: l.short || `${l.name}, presented by Aldridge & Charles Marine.`,
  ogImage: l.hero_image,
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: `https://acmarine.com/yacht/${l.slug}` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: l.name,
        description: l.short || l.description?.slice(0, 200),
        brand: l.builder ? { '@type': 'Brand', name: l.builder } : undefined,
        image: l.hero_image ? [l.hero_image] : undefined,
        offers: l.price ? { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', price: l.price }, availability: l.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } : undefined,
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.com' },
          { '@type': 'ListItem', position: 2, name: 'Fleet', item: 'https://acmarine.com/fleet' },
          { '@type': 'ListItem', position: 3, name: l.name },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="px-4 md:px-6 pt-6 md:pt-8 pb-12">
    <div class="container mx-auto max-w-[1180px]">
      <nav class="text-xs uppercase tracking-wider text-ink/55 mb-5" aria-label="Breadcrumb">
        <NuxtLink to="/fleet" class="text-navy hover:text-brass-deep mr-2">Fleet</NuxtLink>
        <span class="text-brass mr-2">›</span>
        <span>{{ l.name }}</span>
      </nav>

      <section class="grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-6 md:gap-12 mb-12">
        <div class="relative aspect-[4/3] bg-navy overflow-hidden">
          <img v-if="l.hero_image" :src="l.hero_image" :alt="l.name" class="w-full h-full object-cover" width="1200" height="900">
          <Badge class="absolute top-4 left-4 bg-navy text-ivory uppercase tracking-widest text-[0.66rem]">{{ statusLabel }}</Badge>
        </div>
        <div class="flex flex-col">
          <p class="eyebrow mb-2">{{ [l.builder, l.year].filter(Boolean).join(', ') || 'Private commission' }}<span v-if="l.boatClass"> · {{ l.boatClass }}</span></p>
          <h1 class="font-serif text-navy mb-2" style="font-size: clamp(1.85rem, 4.4vw, 2.8rem); line-height: 1.05; letter-spacing: -0.008em">{{ l.name }}</h1>
          <p class="font-serif italic text-xl text-brass-deep mb-1">{{ l.price || 'Price upon request' }}</p>
          <p v-if="len || l.location" class="font-serif text-base text-ink/62 mb-4">
            <span v-if="len">{{ len }}</span>
            <span v-if="len && l.location"> · </span>
            <span v-if="l.location">{{ l.location }}</span>
          </p>

          <div v-if="chips.length" class="grid gap-px bg-rule border border-rule mt-2 mb-5" style="grid-template-columns: repeat(auto-fit, minmax(110px, 1fr))">
            <div v-for="c in chips" :key="c.label" class="bg-ivory px-3.5 py-2.5 flex flex-col gap-0.5">
              <span class="font-sans text-[0.62rem] uppercase tracking-widest text-brass-deep">{{ c.label }}</span>
              <strong class="font-serif font-medium text-base text-navy">{{ c.value }}</strong>
            </div>
          </div>

          <p v-if="l.short" class="text-base text-ink/78 max-w-[48ch] my-4 leading-relaxed">{{ l.short }}</p>

          <div class="flex gap-3 flex-wrap mt-2">
            <button type="button" class="bg-navy text-ivory hover:bg-navy-deep px-5 py-3 text-sm tracking-wider" @click="openDialog({ listingSlug: l.slug })">Request a Viewing</button>
            <a :href="`mailto:office@acmarine.com?subject=${encodeURIComponent(l.name)}`" class="text-navy border border-rule hover:border-navy px-5 py-3 text-sm tracking-wider">Email the office</a>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 md:gap-12 mb-12">
        <div v-if="l.description">
          <h2 class="font-serif text-navy text-2xl md:text-3xl mb-4">Notes from the office</h2>
          <p v-for="(p, i) in l.description.split(/\n\n+/)" :key="i" class="text-base leading-loose text-ink/82 mb-4 max-w-[62ch]">{{ p }}</p>
        </div>
        <aside v-if="specRows.length">
          <h2 class="font-serif text-navy text-2xl md:text-3xl mb-4">Specification</h2>
          <table class="w-full font-serif text-sm">
            <tbody>
              <tr v-for="[k, v] in specRows" :key="k" class="border-b border-rule">
                <th class="text-left text-brass-deep font-medium italic w-2/5 py-2.5">{{ k }}</th>
                <td class="text-navy py-2.5">{{ v }}</td>
              </tr>
            </tbody>
          </table>
        </aside>
      </section>

      <section v-if="l.gallery?.length" class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
        <img v-for="g in l.gallery" :key="g" :src="g" :alt="l.name" loading="lazy" class="w-full aspect-[4/3] object-cover">
      </section>
    </div>
  </div>
</template>
