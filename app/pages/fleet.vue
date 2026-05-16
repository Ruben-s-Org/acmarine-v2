<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
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
    <section class="text-center bg-gradient-to-b from-ivory to-ivory-soft pt-16 md:pt-24 pb-6 md:pb-10 px-4">
      <div class="container mx-auto max-w-[880px]">
        <p class="eyebrow text-brass-deep">Brokerage</p>
        <h1 class="font-serif text-navy mt-5 mb-4" style="font-size: clamp(2.2rem, 7vw, 4rem); line-height: 1.05">
          Extraordinary vessels.
        </h1>
        <p class="text-base md:text-lg text-ink/74 leading-relaxed max-w-[60ch] mx-auto">
          Search the dossier, then write to view, to receive the full briefing, or to be introduced to her captain.
        </p>
      </div>
    </section>

    <section class="bg-gradient-to-b from-ivory-soft to-ivory pb-20 md:pb-28 px-4">
      <div class="container mx-auto max-w-[1180px]">
        <Card class="bg-white/70 backdrop-blur border-rule mb-12">
          <CardContent class="p-5 md:p-7">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Type</Label>
                <Select v-model="type">
                  <SelectTrigger class="bg-white border-[#cdc4ad] text-navy"><SelectValue placeholder="Sail & Motor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Sail &amp; Motor</SelectItem>
                    <SelectItem value="motor">Motor</SelectItem>
                    <SelectItem value="sail">Sail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Class</Label>
                <Select v-model="boatClass">
                  <SelectTrigger class="bg-white border-[#cdc4ad] text-navy"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Any</SelectItem>
                    <SelectItem v-for="c in ['Motor Yachts','Sailing Yachts','Sport Yachts','Mega Yachts','Expedition','Trawlers','Catamarans','Sport Fishers']" :key="c" :value="c">{{ c }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Make</Label>
                <Input v-model="builder" placeholder="Lurssen, Feadship…" class="bg-white border-[#cdc4ad] text-navy" />
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Model</Label>
                <Input v-model="boatModel" placeholder="FD80, X65…" class="bg-white border-[#cdc4ad] text-navy" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Length</Label>
                <div class="flex gap-2">
                  <Input v-model="loa_min" type="number" placeholder="Min" class="bg-white border-[#cdc4ad] text-navy" />
                  <Input v-model="loa_max" type="number" placeholder="Max" class="bg-white border-[#cdc4ad] text-navy" />
                  <div class="inline-flex border border-[#cdc4ad]">
                    <button type="button" @click="lengthUnit = 'm'" :class="['px-3 text-xs uppercase tracking-wider', lengthUnit === 'm' ? 'bg-navy text-ivory' : 'bg-white text-navy']">m</button>
                    <button type="button" @click="lengthUnit = 'ft'" :class="['px-3 text-xs uppercase tracking-wider', lengthUnit === 'ft' ? 'bg-navy text-ivory' : 'bg-white text-navy']">ft</button>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Year</Label>
                <div class="flex gap-2">
                  <Input v-model="year_min" type="number" placeholder="From" class="bg-white border-[#cdc4ad] text-navy" />
                  <Input v-model="year_max" type="number" placeholder="To" class="bg-white border-[#cdc4ad] text-navy" />
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Price (USD)</Label>
                <div class="flex gap-2">
                  <Input v-model="price_min" type="number" placeholder="Min" class="bg-white border-[#cdc4ad] text-navy" />
                  <Input v-model="price_max" type="number" placeholder="Max" class="bg-white border-[#cdc4ad] text-navy" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Power (hp)</Label>
                <div class="flex gap-2">
                  <Input v-model="power_min" type="number" placeholder="Min" class="bg-white border-[#cdc4ad] text-navy" />
                  <Input v-model="power_max" type="number" placeholder="Max" class="bg-white border-[#cdc4ad] text-navy" />
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Max engine hours</Label>
                <Input v-model="engineHours_max" type="number" placeholder="Any" class="bg-white border-[#cdc4ad] text-navy" />
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Min capacity</Label>
                <Input v-model="capacity_min" type="number" placeholder="Any" class="bg-white border-[#cdc4ad] text-navy" />
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-[0.7rem] uppercase tracking-widest text-ink/60">Condition</Label>
                <Select v-model="condition">
                  <SelectTrigger class="bg-white border-[#cdc4ad] text-navy"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Any</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refit">Recently refit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-rule flex-wrap gap-3">
              <div class="flex gap-2 flex-wrap">
                <button v-for="s in ['all','available','sale-pending','sold']" :key="s" type="button"
                  :class="['border px-3.5 py-2 text-xs uppercase tracking-wider transition-colors', activeStatus === s ? 'bg-navy text-ivory border-navy' : 'border-rule text-navy hover:border-navy']"
                  @click="activeStatus = s">{{ s === 'all' ? 'All listings' : (STATUS_LABEL[s] || s) }}</button>
              </div>
              <button type="button" class="text-sm text-ink/60 hover:text-navy underline underline-offset-4" @click="reset">Reset</button>
            </div>
          </CardContent>
        </Card>

        <div class="flex flex-wrap justify-center gap-6 md:gap-8" v-if="filtered.length">
          <NuxtLink v-for="l in filtered" :key="l.id" :to="`/yacht/${l.slug}`" class="block flex-1 min-w-[280px] max-w-[420px] bg-white border border-rule hover:border-brass hover:-translate-y-1 transition-all">
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
        <p v-else class="text-center font-serif italic text-ink/60 py-12">No vessels currently match. Please write to the office for matters not yet presented publicly.</p>
      </div>
    </section>
  </div>
</template>
