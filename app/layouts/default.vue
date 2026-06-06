<script setup lang="ts">
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'
import InquireDialog from '~/components/InquireDialog.vue'
import MicrositeChrome from '~/components/MicrositeChrome.vue'

// loadTenant runs in app.vue and caches in useState; this only reads it.
const tenant = useTenant()
const isMicrosite = computed(() => tenant.value.isMicrosite && !!tenant.value.broker)
const broker = computed(() => tenant.value.broker)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-ivory text-ink">
    <template v-if="isMicrosite">
      <MicrositeChrome placement="header" :broker="broker" />
      <main class="flex-1">
        <slot />
      </main>
      <MicrositeChrome placement="footer" :broker="broker" />
    </template>
    <template v-else>
      <SiteHeader />
      <main class="flex-1">
        <slot />
      </main>
      <SiteFooter />
      <InquireDialog />
    </template>
  </div>
</template>
