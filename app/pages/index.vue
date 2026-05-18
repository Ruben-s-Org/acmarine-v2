<script setup lang="ts">
import { useInquire } from '~/composables/useInquire'
const { openDialog } = useInquire()

useSeoMeta({
  title: 'Aldridge & Charles Marine | Captain-Owned Yacht Brokerage, Management & Crew in South Florida',
  description: 'Aldridge & Charles Marine is a captain-owned yachting firm based in South Florida. Yacht brokerage, management, detailing, charter, and crew placement.',
  ogTitle: 'Aldridge & Charles Marine',
  ogDescription: 'A captain-owned yachting firm in South Florida. Brokerage, management, detailing, charter, and crew placement.',
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
        description: 'A captain-owned yachting firm based in South Florida. Yacht brokerage, management, detailing, charter, and crew placement.',
        areaServed: [
          { '@type': 'Place', name: 'South Florida' },
          { '@type': 'Place', name: 'Florida' },
          { '@type': 'Place', name: 'The Bahamas' },
          { '@type': 'Place', name: 'Caribbean' },
        ],
        contactPoint: { '@type': 'ContactPoint', email: 'office@acmarine.co', contactType: 'customer service' },
      }),
    },
  ],
})

const services = [
  {
    name: 'Brokerage & Acquisition',
    short: 'Brokerage',
    body: 'Buying or selling a yacht is one of the most significant decisions an owner makes. We represent buyers and sellers across South Florida, with deep relationships in the Florida, Bahamas, and Caribbean markets, and a clear, transparent process from first offer to closing.',
  },
  {
    name: 'Detailing & Yacht Management',
    short: 'Detailing',
    body: 'Salt air and Florida sun are unforgiving on a yacht. Our detailing and management programs cover everything from weekly washes to annual haul-outs, with the same crew supervising your vessel month after month and a single point of contact handling every vendor.',
  },
  {
    name: 'Charter Programmes',
    short: 'Charter',
    body: 'Whether you are chartering your own yacht or arranging a private charter for friends and family, we plan the itinerary, brief the crew, and coordinate every aspect of the experience.',
  },
  {
    name: 'Crew Placement',
    short: 'Crew',
    body: 'We place captains, mates, engineers, chefs, and stewards on yachts throughout South Florida. Every candidate is licensed, references-checked, and met in person before we make an introduction.',
  },
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
          A private yachting firm based in South Florida. We handle yacht brokerage, management and detailing, charter, and crew placement for owners along the Atlantic coast and across the Caribbean.
        </p>
        <div class="hero-v1-cta">
          <button type="button" class="btn-v1-primary" @click="openDialog()">Contact our team</button>
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
          <h2 class="h-section" style="margin-top: clamp(0.6rem, 2vw, 1.4rem)">Our practices.</h2>
          <p class="body-prose" style="margin-top: clamp(1rem, 2.4vw, 1.6rem); max-width: 56ch">
            We handle the technical, operational, and administrative side of yacht ownership so you can focus on enjoying the water.
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
        <h2 class="h-section" style="margin-top: clamp(0.6rem, 2vw, 1.4rem); max-width: 20ch">Built for owners.</h2>
        <div class="mt-10 space-y-6">
          <p class="body-prose" style="color: rgba(26,26,26,0.82)">
            Aldridge &amp; Charles Marine is a captain-owned firm based in South Florida. We work with a limited number of clients each year, with the perspective of an operator rather than a desk.
          </p>
          <p class="body-prose" style="color: rgba(26,26,26,0.82)">
            Our pricing is straightforward, and we do not accept referral fees from yards, marinas, or vendors.
          </p>
        </div>
        <ul class="creed-list">
          <li>Captain-owned and led.</li>
          <li>Transparent pricing, no referral fees.</li>
          <li>Hands-on at the moments that matter.</li>
          <li>Strict confidentiality, always.</li>
        </ul>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="contact-strip section-pad">
      <div class="section-narrow" style="max-width: 720px">
        <p class="eyebrow">Contact</p>
        <h2 class="h-section" style="margin-top: clamp(0.6rem, 2vw, 1.4rem); max-width: 22ch">Get in touch.</h2>
        <p class="body-prose" style="margin-top: clamp(1rem, 2.4vw, 1.6rem); margin-bottom: clamp(1.5rem, 3vw, 2.5rem)">
          Send us a short note about your vessel or what you are looking for. A member of our team will respond personally, usually within a few business hours.
        </p>
        <button type="button" class="btn-contact" @click="openDialog()">Send a message</button>
        <p class="direct">
          Or reach us directly at
          <a href="mailto:office@acmarine.co">office@acmarine.co</a>
        </p>
      </div>
    </section>
  </div>
</template>
