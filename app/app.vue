<script setup lang="ts">
// Marketplace tenant resolution happens server-side via middleware. On apex
// (acmarine.co) loadTenant returns isApex=true and themeCss is empty, so the
// existing ACM landing renders unchanged. On a broker subdomain we inject the
// :root CSS variable block that powers per-broker theming.
const tenant = await loadTenant()
useHead(() => tenant.themeCss ? { style: [{ innerHTML: tenant.themeCss, id: 'broker-theme' }] } : {})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
