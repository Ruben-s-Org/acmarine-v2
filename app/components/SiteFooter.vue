<script setup lang="ts">
const year = new Date().getFullYear()
const links = [
  { href: '/articles', label: 'Articles' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]
</script>

<template>
  <footer class="bg-navy-deep text-ivory/70 py-12 px-6">
    <div class="container mx-auto text-center flex flex-col gap-3">
      <p class="font-serif text-xl text-ivory">Aldridge &amp; Charles Marine</p>
      <nav class="flex justify-center gap-6 flex-wrap" aria-label="Footer">
        <NuxtLink v-for="l in links" :key="l.href" :to="l.href" class="text-xs uppercase tracking-wider text-brass hover:text-ivory transition-colors">
          {{ l.label }}
        </NuxtLink>
      </nav>
      <p class="text-xs text-ivory/50 mt-4">&copy; {{ year }} Aldridge &amp; Charles Marine. All rights reserved.</p>
    </div>
  </footer>
</template>
