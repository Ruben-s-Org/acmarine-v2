<script setup lang="ts">
import { useInquire } from '~/composables/useInquire'
import { pickYachtPhoto } from '~~/shared/yacht-photos'

const route = useRoute()
const slug = String(route.params.slug)
const { data } = await useFetch<{ article: any }>(`/api/articles/${slug}`)
const a = computed(() => data.value?.article)
if (!a.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const heroImg = computed(() => a.value.image_url || pickYachtPhoto(a.value.slug))
const { openDialog } = useInquire()
const canonical = `https://acmarine.co/articles/${a.value.slug}`

useSeoMeta({
  title: `${a.value.title}. Aldridge & Charles Marine.`,
  description: a.value.description,
  ogTitle: a.value.title,
  ogDescription: a.value.description,
  ogImage: a.value.image_url,
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'NewsArticle',
      headline: a.value.seo_title || a.value.title,
      description: a.value.description,
      datePublished: a.value.published_at,
      dateModified: a.value.created_at,
      image: a.value.image_url ? [a.value.image_url] : undefined,
      author: { '@type': 'Organization', name: 'Aldridge & Charles Marine' },
      publisher: { '@type': 'Organization', name: 'Aldridge & Charles Marine', url: 'https://acmarine.co/' },
      mainEntityOfPage: canonical,
      articleSection: a.value.category,
      keywords: (a.value.keywords || []).join(', '),
    }) },
  ],
})
</script>

<template>
  <div class="px-4 md:px-6 py-8 md:py-12">
    <article class="container mx-auto max-w-[760px]">
      <nav class="text-xs uppercase tracking-wider text-ink/55 mb-5">
        <NuxtLink to="/articles" class="text-navy hover:text-brass-deep mr-2">Articles</NuxtLink>
        <span class="text-brass mr-2">›</span>
        <span>{{ a.title }}</span>
      </nav>

      <header class="mb-10">
        <p class="text-[0.7rem] uppercase tracking-widest text-brass-deep mb-3">{{ a.category || 'Article' }} · {{ (a.published_at || '').slice(0, 10) }}</p>
        <h1 class="font-serif text-navy mb-4" style="font-size: clamp(2.2rem, 6vw, 3.6rem); line-height: 1.08">{{ a.title }}</h1>
        <p class="font-serif italic text-lg md:text-2xl text-ink/80 max-w-[56ch] leading-snug">{{ a.description }}</p>
      </header>

      <figure class="mb-10">
        <img :src="heroImg" :alt="a.title" width="1200" height="800" class="w-full aspect-[3/2] object-cover">
      </figure>

      <div class="article-body text-base md:text-lg leading-loose text-ink/86" v-html="a.content" />

      <section class="mt-16 bg-navy text-ivory px-6 md:px-10 py-12 -mx-4 md:mx-0">
        <p class="text-[0.7rem] uppercase tracking-widest text-brass mb-3">Inquire</p>
        <h2 class="font-serif text-ivory text-3xl md:text-4xl mb-4">Write to the office.</h2>
        <p class="text-ivory/78 max-w-[56ch] mb-6 leading-relaxed">If this article raised a question worth answering, write. The director on duty replies promptly.</p>
        <button type="button" class="bg-white text-navy hover:bg-ivory-soft px-7 py-4 text-sm tracking-wider" @click="openDialog()">Open the inquiry form</button>
      </section>
    </article>
  </div>
</template>

<style>
.article-body h2 { font-family: 'Cormorant Garamond', serif; color: #0a1e3a; font-size: clamp(1.5rem, 3.4vw, 2rem); margin: 2.4rem 0 1rem; line-height: 1.2; }
.article-body h3 { font-family: 'Cormorant Garamond', serif; color: #7a5e30; font-size: clamp(1.2rem, 2.6vw, 1.5rem); margin: 1.8rem 0 0.8rem; }
.article-body p { margin-bottom: 1.2rem; }
.article-body a { color: #7a5e30; text-decoration: underline; text-underline-offset: 3px; }
.article-body blockquote { border-left: 2px solid #b08d57; padding: 0.4rem 0 0.4rem 1.4rem; margin: 1.6rem 0; font-family: 'Cormorant Garamond', serif; font-style: italic; color: #0a1e3a; }
.article-body ul, .article-body ol { margin: 1rem 0 1.4rem 1.4rem; padding: 0; }
.article-body li { margin-bottom: 0.5rem; }
</style>
