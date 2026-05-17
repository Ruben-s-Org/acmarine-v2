<script setup lang="ts">
defineProps<{
  variant?: 'light' | 'dark'
  height?: number
  wide?: boolean
}>()
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center no-underline" aria-label="Aldridge and Charles Marine">
    <img
      v-if="wide"
      src="/img/logo-wide.png"
      alt="Aldridge & Charles Marine"
      width="468"
      height="29"
      :style="{ height: (height || 22) + 'px', width: 'auto' }"
      :class="variant === 'light' ? 'brightness-0 invert' : ''"
    />
    <img
      v-else
      src="/img/logo.png"
      alt="Aldridge & Charles Marine"
      width="469"
      height="144"
      :style="{ height: (height || 30) + 'px', width: 'auto' }"
      :class="variant === 'light' ? 'brightness-0 invert' : ''"
    />
  </NuxtLink>
</template>
