<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Signing in…' })

const route = useRoute()
const status = ref<'pending' | 'success' | 'error'>('pending')
const error = ref<string | null>(null)

onMounted(async () => {
  const token = route.query.token as string | undefined
  if (!token) { status.value = 'error'; error.value = 'Missing token.'; return }
  try {
    const r = await $fetch<{ ok: boolean; user: { brokerId: string | null } }>('/api/marketplace/auth/consume', {
      method: 'POST', body: { token }
    })
    status.value = 'success'
    await refreshMe()
    // Soft navigation can flake on auth transitions, force a hard nav.
    window.location.href = r.user.brokerId ? '/dashboard' : '/onboarding'
  } catch (e: any) {
    status.value = 'error'
    error.value = e?.data?.statusMessage || 'Could not sign you in.'
  }
})
</script>

<template>
  <div class="min-h-dvh flex items-center justify-center px-6">
    <div class="text-center space-y-3">
      <p v-if="status === 'pending'" class="text-muted-foreground">Signing you in…</p>
      <p v-else-if="status === 'success'" class="text-muted-foreground">Signed in. Redirecting…</p>
      <template v-else>
        <p class="text-red-600 font-medium">Sign-in failed.</p>
        <p class="text-sm text-muted-foreground">{{ error }}</p>
        <NuxtLink to="/auth/login" class="text-sm underline">Try again</NuxtLink>
      </template>
    </div>
  </div>
</template>
