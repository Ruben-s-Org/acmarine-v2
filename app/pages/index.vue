<script setup lang="ts">
import { useInquire } from '~/composables/useInquire'
const { openDialog } = useInquire()

useSeoMeta({
  title: 'Aldridge & Charles Marine. Yacht Management, Brokerage, Refit, Charter, Crew & Detailing.',
  description: 'Aldridge & Charles Marine: a private office handling yacht management, brokerage, refit, charter, crew, detailing, and every other service a great yacht requires.',
  ogTitle: 'Aldridge & Charles Marine',
  ogDescription: 'A private office handling every service a great yacht requires.',
  ogImage: 'https://acmarine.com/og.svg',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://acmarine.com/' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Aldridge & Charles Marine',
        alternateName: 'ACMarine',
        url: 'https://acmarine.com/',
        description: 'A private marine office. Yacht management, brokerage, refit, charter, detailing, crew placement, engineering counsel, and concierge.',
        areaServed: [
          { '@type': 'Place', name: 'Mediterranean' },
          { '@type': 'Place', name: 'Caribbean' },
          { '@type': 'Place', name: 'Atlantic' },
          { '@type': 'Place', name: 'Pacific' },
        ],
        contactPoint: { '@type': 'ContactPoint', email: 'office@acmarine.com', contactType: 'office' },
      }),
    },
  ],
})

const services = [
  { name: 'Yacht Management', short: 'Management', body: "Flag, finance, compliance, payroll, insurance. We act as the principal's shoreside office, removing every operational decision that should not reach the saloon." },
  { name: 'Brokerage & Acquisition', short: 'Brokerage', body: 'Off-market vessels, selectively presented. Sea trials in our own time. Surveys we trust. A purchase process measured in months, not weeks.' },
  { name: 'Refit & Project Oversight', short: 'Refit', body: "Cosmetic refinishment through engineering re-power. We sit shipyard-side, owner's representative, until the launch is right and the paperwork is closed." },
  { name: 'Crew Placement', short: 'Crew', body: 'Captains, engineers, chefs, stewards, deckhands. People we have known for two decades or vetted before we put them forward.' },
  { name: 'Detailing & Daily Stewardship', short: 'Detailing', body: 'Varnish, paint, leather, teak, polish, deep wash and rinse. The hand work that decides whether a vessel ages with grace or with age.' },
  { name: 'Charter Programmes', short: 'Charter', body: 'Itineraries shaped to the principal, hospitality directed by people who have set the table themselves. Guests welcomed by name, never by spreadsheet.' },
  { name: 'Engineering & Technical Counsel', short: 'Engineering', body: "Re-power studies, propulsion modelling, electronics, classification. We speak the yard's language and translate it plainly to the office." },
  { name: 'Berths, Transits & Concierge', short: 'Concierge', body: 'Moorings reserved, customs handled, transits planned, provisions waiting at the passerelle. A telephone number that does not change.' },
]
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="hero-v1">
      <div class="hero-v1-inner">
        <h1 class="hero-v1-h1">
          The highest standard for <em>extraordinary</em> vessels.
        </h1>
        <p class="hero-v1-sub">
          Aldridge &amp; Charles is a private marine office. Management, brokerage, refit, charter, detailing, crew, engineering counsel, and every other matter a great yacht requires, handled by one office, one director, one telephone number. We grow by introduction and reputation.
        </p>
        <div class="hero-v1-cta">
          <button type="button" class="btn-v1-primary" @click="openDialog()">Request an Introduction</button>
          <a href="#services" class="btn-v1-ghost">View Services</a>
        </div>
      </div>
      <div class="hero-v1-rule" aria-hidden="true"></div>
    </section>

    <!-- SERVICES -->
    <section id="services" class="bg-ivory-soft border-y border-rule px-4 md:px-8 py-20 md:py-28">
      <div class="container mx-auto max-w-[1180px]">
        <div class="mb-12">
          <p class="eyebrow">Services</p>
          <h2 class="font-serif text-navy h2-section mt-6 max-w-[22ch]">Eight practices.</h2>
          <p class="text-base md:text-lg text-ink/70 leading-relaxed max-w-[56ch] mt-5">
            Trust earned by repetition. Reliability proved by record. Every service a great yacht requires, delivered by the same office, on the same telephone, in every time zone she sails.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
          <article v-for="s in services" :key="s.name" class="py-8 border-t border-rule">
            <h3 class="font-serif text-navy text-2xl mb-3">{{ s.name }}</h3>
            <p class="text-ink/74 leading-relaxed max-w-[42ch] mb-5">{{ s.body }}</p>
            <button type="button" class="font-serif italic text-brass-deep text-base underline underline-offset-4 decoration-brass/40 hover:text-navy hover:decoration-brass transition-colors" @click="openDialog({ service: s.name })">
              inquire
            </button>
          </article>
        </div>
      </div>
    </section>

    <!-- APPROACH -->
    <section id="approach" class="px-4 md:px-8 py-20 md:py-28">
      <div class="container mx-auto max-w-[880px]">
        <p class="eyebrow">Approach</p>
        <h2 class="font-serif text-navy h2-section mt-6 max-w-[18ch]">A house, not a firm.</h2>
        <div class="mt-10 space-y-6">
          <p class="text-base md:text-lg leading-relaxed text-ink/82 max-w-[64ch]">
            Aldridge &amp; Charles is built on four values: trust earned by repetition, reliability proved by record, restraint practised as a discipline, and time at sea as the only metric that finally matters.
          </p>
          <p class="text-base md:text-lg leading-relaxed text-ink/82 max-w-[64ch]">
            We are paid by retainer. Introductions come from clients, captains, and a small number of trusted brokers. If you have arrived here by way of search, you are welcome to write; we will answer plainly.
          </p>
        </div>
        <ul class="grid gap-4 mt-12">
          <li class="creed-item">One principal, one director, one telephone number.</li>
          <li class="creed-item">No referral fees, no kickbacks, no surprises on the invoice.</li>
          <li class="creed-item">Annual books reviewed by independent maritime counsel.</li>
          <li class="creed-item">Every vessel handled, presented, or detailed only after the office has stood aboard.</li>
        </ul>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="bg-navy text-ivory px-4 md:px-8 py-20 md:py-28 border-t border-rule">
      <div class="container mx-auto max-w-[720px]">
        <p class="eyebrow text-brass">Inquire</p>
        <h2 class="font-serif text-ivory text-4xl md:text-6xl mt-6 mb-8" style="line-height: 1.05">Write to the office.</h2>
        <p class="text-ivory/78 max-w-[56ch] mb-8 leading-relaxed text-base md:text-lg">
          Briefly tell us about your vessel or what you are looking for. The director on duty will respond within two working days.
        </p>
        <button type="button" class="bg-white text-navy hover:bg-ivory-soft px-9 py-5 text-base tracking-wider transition-colors" @click="openDialog()">
          Open the inquiry form
        </button>
        <p class="font-serif italic text-lg mt-10 text-ivory/78">
          Or write directly:
          <a href="mailto:office@acmarine.com" class="text-ivory underline underline-offset-4 decoration-brass">office@acmarine.com</a>
        </p>
      </div>
    </section>
  </div>
</template>
