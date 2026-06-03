<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Listings | acmarine.co' })

await refreshMe()
const user = useCurrentUser()
const broker = useCurrentBroker()
if (!user.value) await navigateTo('/auth/login')
else if (!broker.value) await navigateTo('/onboarding')

const { data, refresh } = await useFetch<{ listings: any[] }>('/api/marketplace/broker/listings', { key: 'broker-listings' })
const listings = computed(() => data.value?.listings ?? [])

const showCreate = ref(false)
const form = reactive({
  headline: '',
  vessel_name: '',
  make: '',
  model: '',
  year: undefined as number | undefined,
  length_ft: undefined as number | undefined,
  location: '',
  asking_price: undefined as number | undefined,
  description: '',
  publish: true
})
const creating = ref(false)
const createError = ref<string | null>(null)

async function createListing() {
  if (creating.value) return
  creating.value = true
  createError.value = null
  try {
    await $fetch('/api/marketplace/broker/listings', { method: 'POST', body: form })
    showCreate.value = false
    Object.assign(form, { headline: '', vessel_name: '', make: '', model: '', year: undefined, length_ft: undefined, location: '', asking_price: undefined, description: '', publish: true })
    await refresh()
  } catch (e: any) {
    createError.value = e?.data?.statusMessage || 'Save failed.'
  } finally {
    creating.value = false
  }
}

async function setStatus(listing: any, status: string) {
  await $fetch(`/api/broker/listings/${listing.id}`, { method: 'PATCH', body: { status } })
  await refresh()
}
async function toggleSyndication(listing: any, channel: string, value: boolean) {
  await $fetch(`/api/broker/listings/${listing.id}`, { method: 'PATCH', body: { [`syndicate_${channel}`]: value } })
  await refresh()
}

function fmtPrice(p: number | null, c: string) {
  if (!p) return 'POA'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: c || 'USD', maximumFractionDigits: 0 }).format(p)
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-10 space-y-6 flex-1">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">Listings</h1>
      <button class="rounded bg-primary px-4 py-2 text-primary-foreground" @click="showCreate = !showCreate">
        {{ showCreate ? 'Cancel' : 'New listing' }}
      </button>
    </header>

    <form v-if="showCreate" class="rounded-lg border border-border p-5 space-y-3" @submit.prevent="createListing">
      <div class="grid grid-cols-2 gap-3">
        <label class="block col-span-2">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Headline</span>
          <input v-model="form.headline" required class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" placeholder="Hatteras GT45, 2019, lightly used" />
        </label>
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Vessel name</span>
          <input v-model="form.vessel_name" required class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Asking price (USD)</span>
          <input v-model.number="form.asking_price" type="number" min="0" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Make</span>
          <input v-model="form.make" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Model</span>
          <input v-model="form.model" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Year</span>
          <input v-model.number="form.year" type="number" min="1900" max="2030" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Length (ft)</span>
          <input v-model.number="form.length_ft" type="number" step="0.1" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
        <label class="block col-span-2">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Location</span>
          <input v-model="form.location" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
        <label class="block col-span-2">
          <span class="text-xs uppercase tracking-wide text-muted-foreground">Description</span>
          <textarea v-model="form.description" rows="4" class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-base" />
        </label>
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.publish" type="checkbox" />
        Publish immediately
      </label>
      <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
      <button type="submit" :disabled="creating" class="rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60">
        {{ creating ? 'Saving…' : 'Save listing' }}
      </button>
    </form>

    <div v-if="listings.length" class="rounded-lg border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th class="p-3">Headline</th>
            <th class="p-3">Vessel</th>
            <th class="p-3">Price</th>
            <th class="p-3">Status</th>
            <th class="p-3">Syndication</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="l in listings" :key="l.id">
            <td class="p-3 max-w-xs">
              <p class="font-medium">{{ l.headline }}</p>
              <p class="text-xs text-muted-foreground">/{{ l.slug }}</p>
            </td>
            <td class="p-3 text-muted-foreground">
              {{ [l.year, l.make, l.model].filter(Boolean).join(' · ') }}
              <div v-if="l.length_ft" class="text-xs">{{ l.length_ft }} ft · {{ l.location || '' }}</div>
            </td>
            <td class="p-3">{{ fmtPrice(l.asking_price, l.currency) }}</td>
            <td class="p-3">
              <select :value="l.status" @change="setStatus(l, ($event.target as HTMLSelectElement).value)" class="rounded border border-border bg-background px-2 py-1">
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="sold">sold</option>
                <option value="withdrawn">withdrawn</option>
              </select>
            </td>
            <td class="p-3 text-xs text-muted-foreground">
              <label class="flex items-center gap-1">
                <input type="checkbox" :checked="!!l.syndicate_yachtworld" @change="toggleSyndication(l, 'yachtworld', ($event.target as HTMLInputElement).checked)" />
                YW
              </label>
              <label class="flex items-center gap-1">
                <input type="checkbox" :checked="!!l.syndicate_yatco" @change="toggleSyndication(l, 'yatco', ($event.target as HTMLInputElement).checked)" />
                YATCO
              </label>
              <label class="flex items-center gap-1">
                <input type="checkbox" :checked="!!l.syndicate_rightboat" @change="toggleSyndication(l, 'rightboat', ($event.target as HTMLInputElement).checked)" />
                Rightboat
              </label>
            </td>
            <td class="p-3">
              <a v-if="l.status === 'published'" :href="`/listings/${l.slug}`" target="_blank" rel="noopener" class="text-xs text-muted-foreground underline">View</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-muted-foreground">No listings yet. Add one to start.</p>
  </main>
</template>
