<script setup lang="ts">
import { findLocation, SERVICES } from '~/../shared/seo-data'
import { useInquire } from '~/composables/useInquire'

const route = useRoute()
const loc = findLocation(String(route.params.location))
if (!loc) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
const { openDialog } = useInquire()

const canonical = `https://acmarine.co/locations/${loc.slug}`
useSeoMeta({
  title: `Yacht Services in ${loc.name} | Aldridge & Charles Marine`,
  description: `Aldridge & Charles Marine in ${loc.name}, ${loc.region}. Yacht management, brokerage, refit, charter, crew placement, detailing, and concierge.`.slice(0, 158),
})
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ProfessionalService',
      name: `Aldridge & Charles Marine ${loc.name}`, url: canonical,
      address: { '@type': 'PostalAddress', addressLocality: loc.name, addressCountry: loc.country },
      geo: loc.geo ? { '@type': 'GeoCoordinates', latitude: loc.geo.lat, longitude: loc.geo.lng } : undefined,
      areaServed: { '@type': 'Place', name: loc.region },
      knowsAbout: SERVICES.map(s => s.name),
    }) },
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.co/' },
        { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://acmarine.co/' },
        { '@type': 'ListItem', position: 3, name: loc.name, item: canonical },
      ],
    }) },
  ],
})
</script>

<template>
  <div class="px-4 md:px-6">
    <div class="container mx-auto max-w-[1180px] py-8 md:py-12">
      <nav class="text-xs uppercase tracking-wider text-ink/55 mb-5" aria-label="Breadcrumb">
        <NuxtLink to="/" class="text-navy hover:text-brass-deep mr-2">Home</NuxtLink>
        <span class="text-brass mr-2">›</span>
        <span>{{ loc.name }}</span>
      </nav>

      <section class="max-w-[800px] py-10 md:py-16">
        <p class="eyebrow">{{ loc.region }}</p>
        <h1 class="font-serif text-navy mt-4 mb-4" style="font-size: clamp(2.6rem, 7vw, 4.5rem); line-height: 1.05; letter-spacing: -0.01em">{{ loc.name }}.</h1>
        <p class="text-base md:text-xl leading-relaxed text-ink/78 max-w-[60ch] mb-8">{{ loc.name }} is {{ loc.flavor }}.</p>
        <button type="button" class="bg-navy text-ivory hover:bg-navy-deep px-7 py-4 text-sm tracking-wider" @click="openDialog({ service: `Services in ${loc.name}` })">Contact us in {{ loc.name }}</button>
      </section>

      <section class="max-w-[880px] py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-5" style="line-height:1.1">Our work in {{ loc.name }}.</h2>
        <p class="text-base md:text-lg leading-loose text-ink/82 max-w-[62ch]">{{ loc.description }}</p>
        <ul class="grid gap-3 mt-8">
          <li class="creed-item">Standing arrangements with {{ loc.harbours.join(', ') }}.</li>
          <li class="creed-item">A captain on our team as your direct contact, available by phone or email.</li>
          <li class="creed-item">The same standard of service across every port we cover.</li>
        </ul>
      </section>

      <section class="py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-3" style="line-height:1.1">Services we offer in {{ loc.name }}.</h2>
        <p class="text-base md:text-lg text-ink/70 mb-8 max-w-[56ch]">Every service we offer, available in {{ loc.name }}.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink v-for="s in SERVICES" :key="s.slug" :to="`/services/${s.slug}/${loc.slug}`" class="block p-6 bg-white border border-rule hover:border-brass hover:-translate-y-0.5 transition-all">
            <p class="text-[0.7rem] uppercase tracking-widest text-brass-deep mb-2">{{ s.shortName }}</p>
            <h3 class="font-serif text-xl text-navy mb-1">{{ s.name }} in {{ loc.name }}.</h3>
            <p class="font-serif italic text-base text-ink/70">{{ s.tagline }}</p>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
