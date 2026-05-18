<script setup lang="ts">
import { useInquire } from '~/composables/useInquire'
const { openDialog } = useInquire()

useSeoMeta({ title: 'Contact. Aldridge & Charles Marine.', description: 'Write to the office. Aldridge & Charles Marine answers promptly.' })
useHead({ link: [{ rel: 'canonical', href: 'https://acmarine.co/contact' }] })
</script>

<template>
  <div class="px-4 md:px-6">
    <main class="container mx-auto max-w-[760px] py-10 md:py-16">
      <p class="eyebrow">Contact</p>
      <h1 class="font-serif text-navy mt-3 mb-2" style="font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.05">Write to the office.</h1>
      <p class="text-xs uppercase tracking-widest text-ink/50 mb-10">Replies promptly.</p>

      <p class="text-base md:text-lg leading-relaxed text-ink/84 mb-8">The director on duty answers every cold inquiry.</p>

      <h2 class="font-serif text-navy text-xl md:text-2xl mb-2">Office</h2>
      <p class="text-base md:text-lg leading-relaxed text-ink/84 mb-10"><a href="mailto:office@acmarine.co" class="text-brass-deep underline underline-offset-4">office@acmarine.co</a></p>

      <h2 class="font-serif text-navy text-xl md:text-2xl mb-2">Out of hours</h2>
      <p class="text-base md:text-lg leading-relaxed text-ink/84 mb-10">Retained principals reach the director on duty on the standing direct line. Cold inquiries are answered promptly.</p>

      <button type="button" class="bg-navy text-ivory hover:bg-navy-deep px-8 py-4 text-base tracking-wider" @click="openDialog()">Open the inquiry form</button>
    </main>
  </div>
</template>
