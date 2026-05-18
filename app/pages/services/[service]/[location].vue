<script setup lang="ts">
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion'
import { findService, findLocation, SERVICES, LOCATIONS } from '~/../shared/seo-data'
import { useInquire } from '~/composables/useInquire'

const route = useRoute()
const svc = findService(String(route.params.service))
const loc = findLocation(String(route.params.location))
if (!svc || !loc) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
const { openDialog } = useInquire()

const canonical = `https://acmarine.co/services/${svc.slug}/${loc.slug}`
useSeoMeta({
  title: `${svc.name} in ${loc.name} | Aldridge & Charles Marine`,
  description: `${svc.name} in ${loc.name}, ${loc.region}. ${svc.intro}`.slice(0, 158),
})
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Service', serviceType: svc.name, name: `${svc.name} in ${loc.name}`, description: svc.description,
      provider: { '@type': 'ProfessionalService', name: 'Aldridge & Charles Marine', url: 'https://acmarine.co/' },
      areaServed: { '@type': 'Place', name: loc.name, geo: loc.geo ? { '@type': 'GeoCoordinates', latitude: loc.geo.lat, longitude: loc.geo.lng } : undefined },
    }) },
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ProfessionalService',
      name: `Aldridge & Charles Marine ${loc.name}`, url: `https://acmarine.co/locations/${loc.slug}`,
      address: { '@type': 'PostalAddress', addressLocality: loc.name, addressCountry: loc.country },
      knowsAbout: [svc.name], areaServed: { '@type': 'Place', name: loc.region },
    }) },
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: svc.faqs.map(f => ({ '@type': 'Question', name: `${f.q.replace(/\?$/, '')} (in ${loc.name})?`, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    }) },
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.co/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://acmarine.co/#services' },
        { '@type': 'ListItem', position: 3, name: svc.name, item: `https://acmarine.co/services/${svc.slug}` },
        { '@type': 'ListItem', position: 4, name: loc.name, item: canonical },
      ],
    }) },
  ],
})

const otherLocations = LOCATIONS.filter(l => l.slug !== loc.slug)
const otherServices = SERVICES.filter(s => s.slug !== svc.slug).slice(0, 4)
</script>

<template>
  <div class="px-4 md:px-6">
    <div class="container mx-auto max-w-[1180px] py-8 md:py-12">
      <nav class="text-xs uppercase tracking-wider text-ink/55 mb-5" aria-label="Breadcrumb">
        <NuxtLink to="/" class="text-navy hover:text-brass-deep mr-2">Home</NuxtLink>
        <span class="text-brass mr-2">›</span>
        <NuxtLink to="/#services" class="text-navy hover:text-brass-deep mr-2">Services</NuxtLink>
        <span class="text-brass mr-2">›</span>
        <NuxtLink :to="`/services/${svc.slug}`" class="text-navy hover:text-brass-deep mr-2">{{ svc.name }}</NuxtLink>
        <span class="text-brass mr-2">›</span>
        <span>{{ loc.name }}</span>
      </nav>

      <section class="max-w-[800px] py-10 md:py-16">
        <p class="eyebrow">{{ svc.name }} · {{ loc.name }}</p>
        <h1 class="font-serif text-navy mt-4 mb-4" style="font-size: clamp(2.4rem, 6.4vw, 4.2rem); line-height: 1.05; letter-spacing: -0.01em">{{ svc.name }} in {{ loc.name }}.</h1>
        <p class="text-base md:text-xl leading-relaxed text-ink/78 max-w-[60ch] mb-8">{{ svc.tagline }} Available in {{ loc.name }}, {{ loc.region }}, with the same team and standard we offer across every port we cover.</p>
        <button type="button" class="bg-navy text-ivory hover:bg-navy-deep px-7 py-4 text-sm tracking-wider" @click="openDialog({ service: `${svc.name} in ${loc.name}` })">Contact us about {{ svc.shortName.toLowerCase() }} in {{ loc.name }}</button>
      </section>

      <section class="max-w-[880px] py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-5" style="line-height:1.1">{{ svc.name }} in {{ loc.name }}.</h2>
        <p class="font-serif italic text-lg md:text-xl text-navy mb-5 max-w-[56ch]">{{ svc.intro }}</p>
        <p class="text-base md:text-lg leading-loose text-ink/82 mb-6 max-w-[62ch]">{{ svc.description }}</p>
        <h3 class="font-serif text-navy text-xl md:text-2xl mt-8 mb-3">{{ loc.name }}, in our experience.</h3>
        <p class="text-base md:text-lg leading-loose text-ink/82 max-w-[62ch]">{{ loc.description }}</p>
        <ul class="grid gap-3 mt-8">
          <li class="creed-item">Standing arrangements with {{ loc.harbours.join(', ') }}.</li>
          <li v-for="h in svc.highlights.slice(0, 3)" :key="h" class="creed-item">{{ h }}</li>
        </ul>
      </section>

      <section class="py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-3" style="line-height:1.1">{{ svc.shortName }} in other ports.</h2>
        <p class="text-base md:text-lg text-ink/70 mb-8 max-w-[56ch]">The same team and the same standard, in every port we cover.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink v-for="l in otherLocations" :key="l.slug" :to="`/services/${svc.slug}/${l.slug}`" class="block p-6 bg-white border border-rule hover:border-brass hover:-translate-y-0.5 transition-all">
            <p class="text-[0.7rem] uppercase tracking-widest text-brass-deep mb-2">{{ l.region }}</p>
            <h3 class="font-serif text-xl text-navy mb-1">{{ svc.shortName }} in {{ l.name }}.</h3>
            <p class="text-sm text-ink/60">{{ l.harbours.slice(0, 2).join(' · ') }}</p>
          </NuxtLink>
        </div>
      </section>

      <section class="py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-6" style="line-height:1.1">Other services in {{ loc.name }}.</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink v-for="s in otherServices" :key="s.slug" :to="`/services/${s.slug}/${loc.slug}`" class="block p-6 bg-white border border-rule hover:border-brass hover:-translate-y-0.5 transition-all">
            <h3 class="font-serif text-xl text-navy mb-2">{{ s.name }} in {{ loc.name }}.</h3>
            <p class="font-serif italic text-base text-ink/70">{{ s.tagline }}</p>
          </NuxtLink>
        </div>
      </section>

      <section class="py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-5" style="line-height:1.1">Frequently asked, in {{ loc.name }}.</h2>
        <Accordion type="single" collapsible class="max-w-[820px]">
          <AccordionItem v-for="(f, i) in svc.faqs" :key="i" :value="`q-${i}`">
            <AccordionTrigger class="font-serif text-lg md:text-xl text-navy">{{ f.q }}</AccordionTrigger>
            <AccordionContent class="text-base text-ink/78 leading-relaxed">{{ f.a }}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  </div>
</template>
