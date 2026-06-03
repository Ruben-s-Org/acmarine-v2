<script setup lang="ts">
const route = useRoute()
const user = useCurrentUser()
const broker = useCurrentBroker()

async function logout() {
  await $fetch('/api/marketplace/auth/logout', { method: 'POST' })
  window.location.href = '/auth/login'
}

const nav = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Leads', to: '/dashboard/leads' },
  { label: 'Listings', to: '/dashboard/listings' },
  { label: 'Deals', to: '/dashboard/deals' }
]
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <header class="border-b border-border">
      <div class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <NuxtLink to="/dashboard" class="font-semibold">acmarine.co</NuxtLink>
          <nav class="flex gap-4 text-sm">
            <NuxtLink
              v-for="n in nav"
              :key="n.to"
              :to="n.to"
              :class="route.path === n.to ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'"
            >
              {{ n.label }}
            </NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <a v-if="broker?.subdomain" :href="`https://${broker.subdomain}.acmarine.co`" target="_blank" rel="noopener" class="hover:text-foreground">
            View microsite
          </a>
          <span>{{ user?.email }}</span>
          <button class="underline" @click="logout">Sign out</button>
        </div>
      </div>
    </header>
    <slot />
  </div>
</template>
