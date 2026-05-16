<script setup lang="ts">
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'
import InquireDialog from '~/components/InquireDialog.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-ivory text-ink">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <InquireDialog />
  </div>
</template>
