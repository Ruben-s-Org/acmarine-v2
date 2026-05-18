<script setup lang="ts">
import { useInquire } from '~/composables/useInquire'
const { openDialog } = useInquire()

useSeoMeta({
  title: 'Aldridge & Charles Marine. Yacht Management, Brokerage, Refit, Charter, Crew & Detailing.',
  description: 'Aldridge & Charles Marine: a private office handling yacht management, brokerage, refit, charter, crew, detailing, and every other service a great yacht requires.',
  ogTitle: 'Aldridge & Charles Marine',
  ogDescription: 'A private office handling every service a great yacht requires.',
  ogImage: 'https://acmarine.co/og.svg',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://acmarine.co/' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Aldridge & Charles Marine',
        alternateName: 'ACMarine',
        url: 'https://acmarine.co/',
        description: 'A private marine office. Yacht management, brokerage, refit, charter, detailing, crew placement, engineering counsel, and concierge.',
        areaServed: [
          { '@type': 'Place', name: 'Mediterranean' },
          { '@type': 'Place', name: 'Caribbean' },
          { '@type': 'Place', name: 'Atlantic' },
          { '@type': 'Place', name: 'Pacific' },
        ],
        contactPoint: { '@type': 'ContactPoint', email: 'office@acmarine.co', contactType: 'office' },
      }),
    },
  ],
})

const services = [
  { name: 'Brokerage & Acquisition', short: 'Brokerage', body: 'Off-market vessels, selectively presented. Sea trials in our own time. Surveys we trust. A purchase process measured in months, not weeks.' },
  { name: 'Detailing & Daily Stewardship', short: 'Detailing', body: 'Varnish, paint, leather, teak, polish, deep wash and rinse. The hand work that decides whether a vessel ages with grace or with age.' },
  { name: 'Charter Programmes', short: 'Charter', body: 'Itineraries shaped to the principal, hospitality directed by people who have set the table themselves. Guests welcomed by name, never by spreadsheet.' },
  { name: 'Crew Placement', short: 'Crew', body: 'Captains, engineers, chefs, stewards, deckhands. People we have known for two decades or vetted before we put them forward.' },
]
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="hero-v1">
      <div class="hero-v1-inner">
        <img src="/img/boat.png" alt="" class="hero-v1-boat-mobile" width="2400" height="1792" loading="eager" decoding="async" />
        <h1 class="hero-v1-h1">
          The highest standard for <em>extraordinary</em> vessels.
        </h1>
        <p class="hero-v1-sub">
          A private marine office for the owners of significant vessels. Brokerage, charter, crew, and the daily stewardship that keeps a great yacht in the state she deserves. We grow by introduction and by reputation.
        </p>
        <div class="hero-v1-cta">
          <button type="button" class="btn-v1-primary" @click="openDialog()">Request an Introduction</button>
          <a href="#services" class="btn-v1-ghost">View Services</a>
        </div>
      </div>
      <img src="/img/boat.png" alt="" class="hero-v1-boat" width="2400" height="1792" loading="eager" decoding="async" />
      <div class="hero-v1-rule" aria-hidden="true"></div>
    </section>

    <!-- SERVICES -->
    <section id="services" class="svc-strip section-pad">
      <div class="section-inner">
        <div class="section-head">
          <p class="eyebrow">Services</p>
          <h2 class="h-section" style="margin-top: clamp(0.6rem, 2vw, 1.4rem)">Four practices.</h2>
          <p class="body-prose" style="margin-top: clamp(1rem, 2.4vw, 1.6rem); max-width: 56ch">
            Trust earned by repetition. Reliability proved by record. The four services a great yacht requires most, delivered by the same office, on the same telephone, in every time zone she sails.
          </p>
        </div>
        <div class="svc-grid">
          <article v-for="s in services" :key="s.name" class="svc-item">
            <h3>{{ s.name }}</h3>
            <p>{{ s.body }}</p>
            <button type="button" class="svc-inquire" @click="openDialog({ service: s.name })">inquire</button>
          </article>
        </div>
      </div>
    </section>

    <!-- APPROACH -->
    <section id="approach" class="section-pad">
      <div class="section-narrow">
        <p class="eyebrow">Approach</p>
        <h2 class="h-section" style="margin-top: clamp(0.6rem, 2vw, 1.4rem); max-width: 18ch">A house, not a firm.</h2>
        <div class="mt-10 space-y-6">
          <p class="body-prose" style="color: rgba(26,26,26,0.82)">
            Aldridge &amp; Charles is built on four values: trust earned by repetition, reliability proved by record, restraint practised as a discipline, and time at sea as the only metric that finally matters.
          </p>
          <p class="body-prose" style="color: rgba(26,26,26,0.82)">
            We are paid by retainer. Introductions come from clients, captains, and a small number of trusted brokers. If you have arrived here by way of search, you are welcome to write; we will answer plainly.
          </p>
        </div>
        <ul class="creed-list">
          <li>One principal, one director, one telephone number.</li>
          <li>No referral fees, no kickbacks, no surprises on the invoice.</li>
          <li>Annual books reviewed by independent maritime counsel.</li>
          <li>Every vessel handled, presented, or detailed only after the office has stood aboard.</li>
        </ul>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="contact-strip section-pad">
      <div class="section-narrow" style="max-width: 720px">
        <p class="eyebrow">Inquire</p>
        <h2 class="h-section" style="margin-top: clamp(0.6rem, 2vw, 1.4rem); max-width: 18ch">Write to the office.</h2>
        <p class="body-prose" style="margin-top: clamp(1rem, 2.4vw, 1.6rem); margin-bottom: clamp(1.5rem, 3vw, 2.5rem)">
          Briefly tell us about your vessel or what you are looking for. The director on duty will respond promptly.
        </p>
        <button type="button" class="btn-contact" @click="openDialog()">Open the inquiry form</button>
        <p class="direct">
          Or write directly:
          <a href="mailto:office@acmarine.co">office@acmarine.co</a>
        </p>
      </div>
    </section>
  </div>
</template>
