<script setup lang="ts">
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { Menu } from 'lucide-vue-next'
import BrandMark from './BrandMark.vue'
import { useInquire } from '~/composables/useInquire'

const { openDialog } = useInquire()
const drawerOpen = ref(false)

const nav = [
  { href: '/fleet', label: 'Fleet' },
  { href: '/#services', label: 'Services' },
  { href: '/articles', label: 'Articles' },
]
</script>

<template>
  <header class="sticky top-0 z-40 backdrop-blur-md bg-ivory/85 border-b border-rule">
    <div class="container mx-auto flex items-center justify-between gap-4 py-5 px-4 lg:px-6">
      <BrandMark />

      <nav class="hidden md:flex items-center gap-9" aria-label="Primary">
        <NuxtLink v-for="item in nav" :key="item.href" :to="item.href" class="text-sm tracking-wide text-navy hover:text-brass-deep transition-colors">
          {{ item.label }}
        </NuxtLink>
        <button
          type="button"
          class="border border-navy text-navy hover:bg-navy hover:text-ivory px-4 py-2 text-sm transition-colors"
          @click="openDialog()"
        >
          Inquire
        </button>
      </nav>

      <Sheet v-model:open="drawerOpen">
        <SheetTrigger as-child>
          <button class="md:hidden border border-rule w-10 h-10 flex items-center justify-center" aria-label="Open menu">
            <Menu class="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="top" class="bg-ivory pt-20 pb-8 px-6 border-b border-rule">
          <nav class="flex flex-col gap-1" aria-label="Mobile">
            <NuxtLink to="/" class="font-serif text-2xl py-3 border-b border-rule text-navy" @click="drawerOpen = false">Home</NuxtLink>
            <NuxtLink v-for="item in nav" :key="item.href" :to="item.href" class="font-serif text-2xl py-3 border-b border-rule text-navy" @click="drawerOpen = false">
              {{ item.label }}
            </NuxtLink>
            <NuxtLink to="/contact" class="font-serif text-2xl py-3 border-b border-rule text-navy" @click="drawerOpen = false">Contact</NuxtLink>
            <button type="button" class="mt-6 bg-navy text-ivory py-4 px-6 text-sm tracking-wider" @click="drawerOpen = false; openDialog()">
              Inquire
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>
