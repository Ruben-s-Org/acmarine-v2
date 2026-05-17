<script setup lang="ts">
defineProps<{
  variant?: 'light' | 'dark'
  height?: number
}>()
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center no-underline" aria-label="Aldridge and Charles Marine">
    <img
      src="/img/logo.png"
      alt="Aldridge & Charles Marine"
      :style="{ height: (height || 30) + 'px', width: 'auto' }"
      :class="variant === 'light' ? 'brightness-0 invert' : ''"
      width="469"
      height="144"
    />
  </NuxtLink>
</template>
