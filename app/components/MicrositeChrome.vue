<script setup lang="ts">
const props = defineProps<{ broker: { subdomain: string; display_name: string } | null; placement: 'header' | 'footer' }>()
const year = new Date().getFullYear()
</script>

<template>
  <header v-if="placement === 'header'" class="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border">
    <div class="container mx-auto flex items-center justify-between gap-4 py-3 px-4 lg:px-6">
      <a href="/" class="font-serif text-lg text-foreground tracking-tight">
        {{ broker?.display_name ?? 'acmarine.co' }}
      </a>
      <nav class="flex items-center gap-6 text-sm text-muted-foreground" aria-label="Microsite primary">
        <a href="/" class="hover:text-foreground">Inventory</a>
        <a href="https://acmarine.co" class="hover:text-foreground">acmarine.co</a>
      </nav>
    </div>
  </header>

  <footer v-else class="border-t border-border bg-background mt-16">
    <div class="container mx-auto px-4 lg:px-6 py-10 text-sm text-muted-foreground space-y-2 text-center">
      <p>
        Hosted on <a href="https://acmarine.co" class="hover:text-foreground underline">acmarine.co</a>.
        <span v-if="broker">{{ broker.display_name }} is an independent broker on the platform.</span>
      </p>
      <p class="text-xs">&copy; {{ year }} acmarine.co</p>
    </div>
  </footer>
</template>
