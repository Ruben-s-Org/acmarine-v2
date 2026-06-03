<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Sign in | acmarine.co' })

const email = ref('')
const submitted = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)

async function submit() {
  if (submitting.value || !email.value) return
  submitting.value = true
  error.value = null
  try {
    await $fetch('/api/marketplace/auth/request', { method: 'POST', body: { email: email.value } })
    submitted.value = true
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-dvh flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-sm space-y-6">
      <header class="text-center space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">acmarine.co</h1>
        <p class="text-sm text-muted-foreground">Sign in with a magic link.</p>
      </header>

      <div v-if="submitted" class="rounded-lg border border-border p-5 text-center space-y-2">
        <p class="font-medium">Check your inbox.</p>
        <p class="text-sm text-muted-foreground">
          If an account exists for <strong>{{ email }}</strong>, a sign-in link is on its way.
          The link expires in 15 minutes and can be used once.
        </p>
        <button class="text-sm text-muted-foreground underline" @click="submitted = false; email = ''">Use a different email</button>
      </div>

      <form v-else class="space-y-3" @submit.prevent="submit">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Email</span>
          <input v-model="email" type="email" required class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
        <button type="submit" :disabled="submitting" class="w-full rounded bg-primary px-4 py-2.5 text-primary-foreground font-medium disabled:opacity-60">
          {{ submitting ? 'Sending…' : 'Send sign-in link' }}
        </button>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <p class="text-xs text-muted-foreground text-center pt-2">
          New here? Sign in to create your broker workspace.
        </p>
      </form>
    </div>
  </div>
</template>
