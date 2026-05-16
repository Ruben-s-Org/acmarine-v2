<script setup lang="ts">
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion'
import { findService, LOCATIONS, SERVICES } from '~/../shared/seo-data'
import { useInquire } from '~/composables/useInquire'

const route = useRoute()
const svc = findService(String(route.params.service))
if (!svc) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
const { openDialog } = useInquire()

const canonical = `https://acmarine.com/services/${svc.slug}`
useSeoMeta({
  title: `${svc.name}. Aldridge & Charles Marine.`,
  description: `${svc.intro}`,
})
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Service', serviceType: svc.name, name: `${svc.name} by Aldridge & Charles Marine`, description: svc.description,
      provider: { '@type': 'ProfessionalService', name: 'Aldridge & Charles Marine', url: 'https://acmarine.com/' },
      areaServed: LOCATIONS.map(l => ({ '@type': 'Place', name: l.name })),
    }) },
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: svc.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    }) },
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.com/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://acmarine.com/#services' },
        { '@type': 'ListItem', position: 3, name: svc.name, item: canonical },
      ],
    }) },
  ],
})

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
        <span>{{ svc.name }}</span>
      </nav>

      <section class="max-w-[800px] py-10 md:py-16">
        <p class="eyebrow">Service</p>
        <h1 class="font-serif text-navy mt-4 mb-4" style="font-size: clamp(2.6rem, 7vw, 4.5rem); line-height: 1.05; letter-spacing: -0.01em">{{ svc.name }}.</h1>
        <p class="text-base md:text-xl leading-relaxed text-ink/78 max-w-[60ch] mb-8">{{ svc.tagline }}</p>
        <button type="button" class="bg-navy text-ivory hover:bg-navy-deep px-7 py-4 text-sm tracking-wider" @click="openDialog({ service: svc.name })">Inquire about {{ svc.shortName }}</button>
      </section>

      <section class="max-w-[880px] py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-5" style="line-height:1.1">{{ svc.name }} at Aldridge &amp; Charles.</h2>
        <p class="font-serif italic text-lg md:text-xl text-navy mb-5 max-w-[56ch]">{{ svc.intro }}</p>
        <p class="text-base md:text-lg leading-loose text-ink/82 mb-6 max-w-[62ch]">{{ svc.description }}</p>
        <ul class="grid gap-3 mt-8">
          <li v-for="h in svc.highlights" :key="h" class="creed-item">{{ h }}</li>
        </ul>
      </section>

      <section class="py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-3" style="line-height:1.1">Where we hold {{ svc.shortName.toLowerCase() }} retainers.</h2>
        <p class="text-base md:text-lg text-ink/70 mb-8 max-w-[56ch]">The office answers from four addresses. Each holds standing arrangements with the priority marinas, surveyors, yards, and counsel in its region.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink v-for="l in LOCATIONS" :key="l.slug" :to="`/services/${svc.slug}/${l.slug}`" class="block p-6 bg-white border border-rule hover:border-brass hover:-translate-y-0.5 transition-all">
            <p class="text-[0.7rem] uppercase tracking-widest text-brass-deep mb-2">{{ l.region }}</p>
            <h3 class="font-serif text-xl text-navy mb-1">{{ svc.shortName }} in {{ l.name }}.</h3>
            <p class="text-sm text-ink/60">{{ l.harbours.slice(0, 2).join(' · ') }}</p>
          </NuxtLink>
        </div>
      </section>

      <section class="py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-5" style="line-height:1.1">Frequently asked.</h2>
        <Accordion type="single" collapsible class="max-w-[820px]">
          <AccordionItem v-for="(f, i) in svc.faqs" :key="i" :value="`q-${i}`">
            <AccordionTrigger class="font-serif text-lg md:text-xl text-navy">{{ f.q }}</AccordionTrigger>
            <AccordionContent class="text-base text-ink/78 leading-relaxed">{{ f.a }}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section class="py-10 md:py-14 border-t border-rule">
        <h2 class="font-serif text-navy text-3xl md:text-5xl mb-6" style="line-height:1.1">Other practices.</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink v-for="s in otherServices" :key="s.slug" :to="`/services/${s.slug}`" class="block p-6 bg-white border border-rule hover:border-brass hover:-translate-y-0.5 transition-all">
            <h3 class="font-serif text-xl text-navy mb-2">{{ s.name }}.</h3>
            <p class="font-serif italic text-base text-ink/70">{{ s.tagline }}</p>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
