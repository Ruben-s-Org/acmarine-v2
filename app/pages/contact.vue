<script setup lang="ts">
import { useInquire } from '~/composables/useInquire'
const { openDialog } = useInquire()

useSeoMeta({
  title: 'Contact | Aldridge & Charles Marine',
  description: 'Reach Aldridge & Charles Marine, a private yachting firm based in South Florida. Brokerage, management, detailing, charter, and crew placement.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://acmarine.co/contact' }] })
</script>

<template>
  <div class="px-4 md:px-6">
    <main class="container mx-auto max-w-[760px] py-10 md:py-16">
      <p class="eyebrow">Contact</p>
      <h1 class="font-serif text-navy mt-3 mb-2" style="font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.05">Get in touch.</h1>
      <p class="text-xs uppercase tracking-widest text-ink/50 mb-10">We respond personally.</p>

      <p class="text-base md:text-lg leading-relaxed text-ink/84 mb-8">Whether you are considering buying or selling a yacht, looking for ongoing management, or placing crew, send us a short note. As a captain-owned firm, the reply you receive will come from someone who has run yachts themselves.</p>

      <h2 class="font-serif text-navy text-xl md:text-2xl mb-2">Email</h2>
      <p class="text-base md:text-lg leading-relaxed text-ink/84 mb-10"><a href="mailto:office@acmarine.co" class="text-brass-deep underline underline-offset-4">office@acmarine.co</a></p>

      <h2 class="font-serif text-navy text-xl md:text-2xl mb-2">After hours</h2>
      <p class="text-base md:text-lg leading-relaxed text-ink/84 mb-10">Existing clients reach their account director on our direct line. New inquiries are reviewed personally and answered within a few business hours.</p>

      <button type="button" class="bg-navy text-ivory hover:bg-navy-deep px-8 py-4 text-base tracking-wider" @click="openDialog()">Send a message</button>
    </main>
  </div>
</template>
