<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import type { Article } from '~~/shared/types'
import { pickYachtPhoto } from '~~/shared/yacht-photos'

useSeoMeta({
  title: 'Articles & Guides | Aldridge & Charles Marine',
  description: 'Practical articles on buying and selling yachts, ongoing management, detailing, and crew placement in South Florida and the Caribbean.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://acmarine.co/articles' }] })

const { data } = await useFetch<{ articles: Article[] }>('/api/articles')
const articles = computed(() => data.value?.articles || [])
function imageFor(a: Article) { return a.image_url || pickYachtPhoto(a.slug) }
</script>

<template>
  <div class="px-4 md:px-6">
    <section class="text-center bg-gradient-to-b from-ivory to-ivory-soft pt-16 md:pt-24 pb-10 px-4">
      <div class="container mx-auto max-w-[880px]">
        <p class="eyebrow">Articles</p>
        <h1 class="font-serif text-navy mt-5 mb-4" style="font-size: clamp(2.2rem, 7vw, 4rem); line-height: 1.05">Articles &amp; guides.</h1>
        <p class="text-base md:text-lg text-ink/74 max-w-[60ch] mx-auto leading-relaxed">Practical writing on buying and selling yachts, ongoing management, detailing, and crew placement across South Florida and the Caribbean. Updated when we have something useful to share.</p>
      </div>
    </section>

    <section class="container mx-auto max-w-[1180px] py-12 md:py-16">
      <div v-if="articles.length" class="flex flex-wrap justify-center gap-6 md:gap-8">
        <NuxtLink v-for="a in articles" :key="a.slug" :to="`/articles/${a.slug}`" class="block flex-1 min-w-[280px] max-w-[420px] bg-white border border-rule hover:border-brass hover:-translate-y-1 transition-all">
          <div class="relative aspect-[4/3] bg-navy overflow-hidden">
            <img :src="imageFor(a)" :alt="a.title" loading="lazy" class="w-full h-full object-cover" @error="(($event.target as HTMLImageElement).src = '/api/images/_meta/stock/stock-01.jpg')">
          </div>
          <div class="p-5 md:p-6">
            <p class="text-[0.7rem] uppercase tracking-widest text-brass-deep mb-2">{{ a.category || 'Article' }} · {{ (a.published_at || a.created_at || '').slice(0, 10) }}</p>
            <h3 class="font-serif text-navy text-2xl mb-1 font-medium">{{ a.title }}</h3>
            <p class="text-sm text-ink/65 line-clamp-3">{{ a.description }}</p>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="text-center font-serif italic text-ink/60 py-12">We publish when we have something useful to share. The first articles will appear shortly.</p>
    </section>
  </div>
</template>
