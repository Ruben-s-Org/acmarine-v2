<script setup lang="ts">
const props = defineProps<{
  listingSlug?: string
  brokerSubdomain?: string
  brokerName?: string
  compact?: boolean
}>()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: props.listingSlug ? `Hi${props.brokerName ? ' ' + props.brokerName : ''}, I'd like more information on this listing.` : ''
})

const submitting = ref(false)
const result = ref<{ ok: boolean; lead_id?: string; error?: string } | null>(null)

async function submit() {
  if (submitting.value) return
  submitting.value = true
  result.value = null
  try {
    const r = await $fetch<{ ok: boolean; lead_id: string }>('/api/marketplace/leads', {
      method: 'POST',
      body: {
        ...form,
        listing_slug: props.listingSlug,
        broker_subdomain: props.brokerSubdomain
      }
    })
    result.value = { ok: true, lead_id: r.lead_id }
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
  } catch (e: any) {
    result.value = { ok: false, error: e?.data?.statusMessage || e?.message || 'submit failed' }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="submit">
    <div :class="compact ? 'grid grid-cols-2 gap-3' : 'space-y-3'">
      <label class="block">
        <span class="text-xs uppercase tracking-wide text-muted-foreground">Name</span>
        <input v-model="form.name" required class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
      </label>
      <label class="block">
        <span class="text-xs uppercase tracking-wide text-muted-foreground">Email</span>
        <input v-model="form.email" type="email" required class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
      </label>
    </div>
    <label class="block">
      <span class="text-xs uppercase tracking-wide text-muted-foreground">Phone (optional)</span>
      <input v-model="form.phone" type="tel" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
    </label>
    <label class="block">
      <span class="text-xs uppercase tracking-wide text-muted-foreground">Message</span>
      <textarea v-model="form.message" rows="4" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
    </label>
    <button type="submit" :disabled="submitting" class="w-full rounded bg-primary px-4 py-2.5 text-primary-foreground font-medium disabled:opacity-60">
      {{ submitting ? 'Sending…' : 'Send inquiry' }}
    </button>
    <p v-if="result?.ok" class="text-sm text-emerald-600">Thanks, your message is on its way. Lead ID {{ result.lead_id }}.</p>
    <p v-else-if="result && !result.ok" class="text-sm text-red-600">{{ result.error }}</p>
    <p class="text-xs text-muted-foreground">
      We respond fast. Your message goes directly to the broker.
    </p>
  </form>
</template>
