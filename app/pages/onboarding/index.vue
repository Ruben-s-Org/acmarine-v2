<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Set up your brokerage | acmarine.co' })

await refreshMe()
const user = useCurrentUser()
if (!user.value) {
  await navigateTo('/auth/login')
}

const form = reactive({
  display_name: '',
  legal_name: '',
  phone: '',
  bio: '',
  subdomain: '',
  license_number: '',
  license_state: '',
  license_expires: ''
})

const subdomainCheck = ref<{ available: boolean; reason?: string } | null>(null)
const checking = ref(false)
let checkTimer: any = null

watch(() => form.subdomain, (v) => {
  if (checkTimer) clearTimeout(checkTimer)
  subdomainCheck.value = null
  if (!v) return
  checkTimer = setTimeout(async () => {
    checking.value = true
    try {
      subdomainCheck.value = await $fetch<{ available: boolean; reason?: string }>('/api/marketplace/onboarding/check-subdomain', {
        query: { subdomain: v }
      })
    } finally {
      checking.value = false
    }
  }, 300)
})

const submitting = ref(false)
const submitError = ref<string | null>(null)

async function submit() {
  if (submitting.value) return
  submitting.value = true
  submitError.value = null
  try {
    const r = await $fetch<{ ok: true; microsite_url: string; subdomain: string }>('/api/marketplace/onboarding/complete', {
      method: 'POST', body: form
    })
    window.location.href = '/dashboard?welcome=1'
  } catch (e: any) {
    submitError.value = e?.data?.statusMessage || 'Could not save.'
  } finally {
    submitting.value = false
  }
}

const reasonLabel: Record<string, string> = {
  invalid_format: 'Use letters, numbers, and dashes only.',
  too_short: 'At least 3 characters.',
  too_long: 'At most 30 characters.',
  blocked: 'Reserved name, try another.',
  profane: 'Try another name.',
  taken: 'Already taken.'
}
</script>

<template>
  <div class="min-h-dvh px-6 py-10">
    <div class="mx-auto max-w-2xl space-y-8">
      <header class="space-y-1">
        <p class="text-xs uppercase tracking-wider text-muted-foreground">Onboarding</p>
        <h1 class="text-3xl font-semibold tracking-tight">Set up your brokerage</h1>
        <p class="text-muted-foreground">A few details and your microsite is live. License info stays private until your broker-of-record approves syndication.</p>
      </header>

      <form class="space-y-6 rounded-lg border border-border p-6" @submit.prevent="submit">
        <section class="space-y-3">
          <h2 class="font-medium">Public profile</h2>
          <label class="block">
            <span class="text-xs uppercase tracking-wide text-muted-foreground">Display name</span>
            <input v-model="form.display_name" required class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" placeholder="Acme Yachts" />
          </label>
          <label class="block">
            <span class="text-xs uppercase tracking-wide text-muted-foreground">Microsite subdomain</span>
            <div class="mt-1 flex items-center rounded border border-border bg-background overflow-hidden">
              <input v-model="form.subdomain" required class="flex-1 px-3 py-2 text-base" placeholder="acme" />
              <span class="px-3 text-sm text-muted-foreground">.acmarine.co</span>
            </div>
            <p v-if="checking" class="mt-1 text-xs text-muted-foreground">Checking…</p>
            <p v-else-if="subdomainCheck && subdomainCheck.available" class="mt-1 text-xs text-emerald-600">Available.</p>
            <p v-else-if="subdomainCheck && !subdomainCheck.available" class="mt-1 text-xs text-red-600">
              {{ reasonLabel[subdomainCheck.reason || 'invalid_format'] }}
            </p>
          </label>
          <label class="block">
            <span class="text-xs uppercase tracking-wide text-muted-foreground">Bio</span>
            <textarea v-model="form.bio" rows="3" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
          </label>
          <label class="block">
            <span class="text-xs uppercase tracking-wide text-muted-foreground">Phone</span>
            <input v-model="form.phone" type="tel" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
          </label>
        </section>

        <section class="space-y-3">
          <h2 class="font-medium">Compliance</h2>
          <div class="grid grid-cols-3 gap-3">
            <label class="block col-span-2">
              <span class="text-xs uppercase tracking-wide text-muted-foreground">License number</span>
              <input v-model="form.license_number" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
            </label>
            <label class="block">
              <span class="text-xs uppercase tracking-wide text-muted-foreground">State</span>
              <input v-model="form.license_state" maxlength="2" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" placeholder="FL" />
            </label>
          </div>
          <label class="block">
            <span class="text-xs uppercase tracking-wide text-muted-foreground">License expires</span>
            <input v-model="form.license_expires" type="date" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
          </label>
          <label class="block">
            <span class="text-xs uppercase tracking-wide text-muted-foreground">Legal name (optional)</span>
            <input v-model="form.legal_name" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
          </label>
        </section>

        <div class="space-y-2">
          <button type="submit" :disabled="submitting || (subdomainCheck && !subdomainCheck.available)" class="w-full rounded bg-primary px-4 py-2.5 text-primary-foreground font-medium disabled:opacity-60">
            {{ submitting ? 'Saving…' : 'Launch my microsite' }}
          </button>
          <p v-if="submitError" class="text-sm text-red-600 text-center">{{ submitError }}</p>
        </div>
      </form>
    </div>
  </div>
</template>
