<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '~/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-vue-next'
import type { Listing } from '~~/shared/types'

useSeoMeta({
  title: 'The Fleet. Yachts currently presented by Aldridge & Charles Marine.',
  description: 'Yachts currently presented by Aldridge & Charles Marine. A short, considered roster of vessels for sale, charter, and management.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://acmarine.com/fleet' }] })

const { data } = await useFetch<{ listings: Listing[] }>('/api/listings')
const all = computed(() => data.value?.listings || [])

const type = ref('')
const boatClass = ref('')
const condition = ref('')
const builder = ref('')
const boatModel = ref('')
const loa_min = ref('')
const loa_max = ref('')
const year_min = ref('')
const year_max = ref('')
const price_min = ref('')
const price_max = ref('')
const power_min = ref('')
const power_max = ref('')
const engineHours_max = ref('')
const capacity_min = ref('')
const activeStatus = ref('all')
const lengthUnit = ref<'m' | 'ft'>('m')
const mobileFiltersOpen = ref(false)

const filtered = computed(() => {
  let items = all.value.filter(l => l.status !== 'draft')
  if (activeStatus.value !== 'all') items = items.filter(l => (l.status || 'available') === activeStatus.value)
  if (type.value) items = items.filter(l => l.type === type.value)
  if (boatClass.value) items = items.filter(l => (l.boatClass || '').toLowerCase().includes(boatClass.value.toLowerCase()))
  if (condition.value) items = items.filter(l => l.condition === condition.value)
  if (builder.value) items = items.filter(l => (l.builder || '').toLowerCase().includes(builder.value.toLowerCase()))
  if (boatModel.value) items = items.filter(l => (l.boatModel || '').toLowerCase().includes(boatModel.value.toLowerCase()))

  const pmin = parseFloat(power_min.value)
  const pmax = parseFloat(power_max.value)
  if (!isNaN(pmin) || !isNaN(pmax)) items = items.filter(l => typeof l.power === 'number' && (isNaN(pmin) || l.power >= pmin) && (isNaN(pmax) || l.power <= pmax))

  const ehmax = parseFloat(engineHours_max.value)
  if (!isNaN(ehmax)) items = items.filter(l => typeof l.engineHours === 'number' && l.engineHours <= ehmax)

  const cmin = parseFloat(capacity_min.value)
  if (!isNaN(cmin)) items = items.filter(l => typeof l.capacity === 'number' && l.capacity >= cmin)

  const lmin = parseFloat(loa_min.value)
  const lmax = parseFloat(loa_max.value)
  if (!isNaN(lmin) || !isNaN(lmax)) {
    items = items.filter(l => {
      if (typeof l.loa_m !== 'number') return false
      const min = lengthUnit.value === 'ft' && !isNaN(lmin) ? lmin / 3.28084 : lmin
      const max = lengthUnit.value === 'ft' && !isNaN(lmax) ? lmax / 3.28084 : lmax
      if (!isNaN(min) && l.loa_m < min) return false
      if (!isNaN(max) && l.loa_m > max) return false
      return true
    })
  }

  const ymin = parseInt(year_min.value)
  const ymax = parseInt(year_max.value)
  if (!isNaN(ymin) || !isNaN(ymax)) items = items.filter(l => typeof l.year === 'number' && (isNaN(ymin) || l.year >= ymin) && (isNaN(ymax) || l.year <= ymax))

  const prmin = parseFloat(price_min.value)
  const prmax = parseFloat(price_max.value)
  if (!isNaN(prmin) || !isNaN(prmax)) items = items.filter(l => typeof l.price_num === 'number' && (isNaN(prmin) || l.price_num >= prmin) && (isNaN(prmax) || l.price_num <= prmax))

  return items
})

const activeFilterCount = computed(() => {
  let n = 0
  if (type.value) n++
  if (boatClass.value) n++
  if (condition.value) n++
  if (builder.value) n++
  if (boatModel.value) n++
  if (loa_min.value || loa_max.value) n++
  if (year_min.value || year_max.value) n++
  if (price_min.value || price_max.value) n++
  if (power_min.value || power_max.value) n++
  if (engineHours_max.value) n++
  if (capacity_min.value) n++
  if (activeStatus.value !== 'all') n++
  return n
})

function reset() {
  type.value = ''; boatClass.value = ''; condition.value = ''; builder.value = ''; boatModel.value = ''
  loa_min.value = ''; loa_max.value = ''
  year_min.value = ''; year_max.value = ''
  price_min.value = ''; price_max.value = ''
  power_min.value = ''; power_max.value = ''
  engineHours_max.value = ''; capacity_min.value = ''
  activeStatus.value = 'all'
}

function lengthLabel(loa?: number) {
  if (typeof loa !== 'number') return ''
  const m = loa.toFixed(1).replace(/\.0$/, '')
  const ft = (loa * 3.28084).toFixed(0)
  return `${m} m / ${ft} ft`
}

const STATUS_LABEL: Record<string, string> = { 'sale-pending': 'Sale Pending', sold: 'Sold', available: 'Available', draft: 'Draft' }
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="text-center pt-12 md:pt-16 pb-6 md:pb-10 px-4 border-b border-rule">
      <div class="container mx-auto max-w-[880px]">
        <p class="eyebrow text-brass-deep">Brokerage</p>
        <h1 class="font-serif text-navy mt-4 mb-3" style="font-size: clamp(2.2rem, 7vw, 4rem); line-height: 1.05">
          Extraordinary vessels.
        </h1>
        <p class="text-base md:text-lg text-ink/74 leading-relaxed max-w-[60ch] mx-auto">
          Search the dossier, then write to view, to receive the full briefing, or to be introduced to her captain.
        </p>
      </div>
    </section>

    <section class="px-4 md:px-6 py-8 md:py-12">
      <div class="container mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8">

        <!-- DESKTOP SIDEBAR -->
        <aside class="hidden lg:block">
          <div class="sticky top-[64px] max-h-[calc(100vh-80px)] overflow-y-auto pr-2 -mr-2">
            <FilterForm
              v-model:type="type"
              v-model:boatClass="boatClass"
              v-model:condition="condition"
              v-model:builder="builder"
              v-model:boatModel="boatModel"
              v-model:loa_min="loa_min"
              v-model:loa_max="loa_max"
              v-model:year_min="year_min"
              v-model:year_max="year_max"
              v-model:price_min="price_min"
              v-model:price_max="price_max"
              v-model:power_min="power_min"
              v-model:power_max="power_max"
              v-model:engineHours_max="engineHours_max"
              v-model:capacity_min="capacity_min"
              v-model:activeStatus="activeStatus"
              v-model:lengthUnit="lengthUnit"
              @reset="reset"
            />
          </div>
        </aside>

        <!-- LISTINGS -->
        <div>
          <!-- mobile filter bar -->
          <div class="lg:hidden flex items-center justify-between mb-6 sticky top-[52px] z-30 bg-ivory/95 backdrop-blur py-3 -mx-4 px-4 border-b border-rule">
            <Sheet v-model:open="mobileFiltersOpen">
              <SheetTrigger as-child>
                <button type="button" class="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-sm tracking-wider text-navy bg-white">
                  <SlidersHorizontal class="w-4 h-4" />
                  <span>Filters</span>
                  <span v-if="activeFilterCount" class="bg-navy text-ivory px-2 py-0.5 text-xs ml-1">{{ activeFilterCount }}</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" class="bg-ivory p-0 w-[88%] sm:w-[400px] overflow-y-auto">
                <SheetTitle class="font-serif text-2xl text-navy px-6 pt-6 pb-2">Filter</SheetTitle>
                <div class="p-6 pt-2">
                  <FilterForm
                    v-model:type="type"
                    v-model:boatClass="boatClass"
                    v-model:condition="condition"
                    v-model:builder="builder"
                    v-model:boatModel="boatModel"
                    v-model:loa_min="loa_min"
                    v-model:loa_max="loa_max"
                    v-model:year_min="year_min"
                    v-model:year_max="year_max"
                    v-model:price_min="price_min"
                    v-model:price_max="price_max"
                    v-model:power_min="power_min"
                    v-model:power_max="power_max"
                    v-model:engineHours_max="engineHours_max"
                    v-model:capacity_min="capacity_min"
                    v-model:activeStatus="activeStatus"
                    v-model:lengthUnit="lengthUnit"
                    @reset="reset"
                  />
                  <button type="button" class="w-full mt-6 bg-navy text-ivory py-3 text-sm tracking-wider" @click="mobileFiltersOpen = false">View {{ filtered.length }} {{ filtered.length === 1 ? 'vessel' : 'vessels' }}</button>
                </div>
              </SheetContent>
            </Sheet>
            <p class="text-xs uppercase tracking-widest text-ink/55">{{ filtered.length }} {{ filtered.length === 1 ? 'vessel' : 'vessels' }}</p>
          </div>

          <p class="hidden lg:block text-xs uppercase tracking-widest text-ink/55 mb-5">{{ filtered.length }} {{ filtered.length === 1 ? 'vessel' : 'vessels' }} presented</p>

          <div v-if="filtered.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink v-for="l in filtered" :key="l.id" :to="`/yacht/${l.slug}`" class="block bg-white border border-rule hover:border-brass hover:-translate-y-1 transition-all">
              <div class="relative aspect-[4/3] bg-navy overflow-hidden">
                <img v-if="l.hero_image" :src="l.hero_image" :alt="l.name" loading="lazy" class="w-full h-full object-cover">
                <Badge class="absolute top-3 left-3 bg-navy text-ivory uppercase tracking-widest text-[0.66rem]">{{ STATUS_LABEL[l.status || 'available'] }}</Badge>
              </div>
              <div class="p-5 md:p-6">
                <p class="text-[0.7rem] uppercase tracking-widest text-brass-deep mb-2">{{ [l.builder, l.year].filter(Boolean).join(', ') || 'Private commission' }}</p>
                <h3 class="font-serif text-navy text-2xl mb-1 font-medium">{{ l.name }}</h3>
                <p class="text-sm text-ink/60 mb-3">{{ lengthLabel(l.loa_m) }}<span v-if="l.location"> · {{ l.location }}</span></p>
                <p class="font-serif italic text-base text-navy border-t border-rule pt-3">{{ l.price || 'Price upon request' }}</p>
              </div>
            </NuxtLink>
          </div>
          <p v-else class="text-center font-serif italic text-ink/60 py-16">No vessels currently match. Please write to the office for matters not yet presented publicly.</p>
        </div>

      </div>
    </section>
  </div>
</template>
