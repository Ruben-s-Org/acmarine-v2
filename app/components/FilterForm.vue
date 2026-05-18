<script setup lang="ts">
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const props = defineProps<{
  type: string
  boatClass: string
  condition: string
  builder: string
  boatModel: string
  loa_min: string
  loa_max: string
  year_min: string
  year_max: string
  price_min: string
  price_max: string
  power_min: string
  power_max: string
  engineHours_max: string
  capacity_min: string
  activeStatus: string
  lengthUnit: 'm' | 'ft'
}>()

const emit = defineEmits<{
  (e: 'update:type', v: string): void
  (e: 'update:boatClass', v: string): void
  (e: 'update:condition', v: string): void
  (e: 'update:builder', v: string): void
  (e: 'update:boatModel', v: string): void
  (e: 'update:loa_min', v: string): void
  (e: 'update:loa_max', v: string): void
  (e: 'update:year_min', v: string): void
  (e: 'update:year_max', v: string): void
  (e: 'update:price_min', v: string): void
  (e: 'update:price_max', v: string): void
  (e: 'update:power_min', v: string): void
  (e: 'update:power_max', v: string): void
  (e: 'update:engineHours_max', v: string): void
  (e: 'update:capacity_min', v: string): void
  (e: 'update:activeStatus', v: string): void
  (e: 'update:lengthUnit', v: 'm' | 'ft'): void
  (e: 'reset'): void
}>()

const inputCls = 'bg-white border-[#cdc4ad] text-navy h-10'
const labelCls = 'text-[0.68rem] uppercase tracking-widest text-ink/60'
</script>

<template>
  <div class="space-y-5">
    <div>
      <p class="font-serif text-navy text-xl mb-1">Filter</p>
      <p class="text-xs text-ink/55">Narrow your search.</p>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <button v-for="s in ['all','available','sale-pending']" :key="s" type="button"
        :class="['border px-2.5 py-1.5 text-[0.66rem] uppercase tracking-widest transition-colors', activeStatus === s ? 'bg-navy text-ivory border-navy' : 'border-rule text-navy hover:border-navy']"
        @click="emit('update:activeStatus', s)">{{ s === 'all' ? 'All' : s === 'sale-pending' ? 'Sale Pending' : s.charAt(0).toUpperCase() + s.slice(1) }}</button>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label :class="labelCls">Type</Label>
      <Select :model-value="type" @update:model-value="v => emit('update:type', String(v ?? ''))">
        <SelectTrigger :class="inputCls"><SelectValue placeholder="Sail & Motor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Sail &amp; Motor</SelectItem>
          <SelectItem value="motor">Motor</SelectItem>
          <SelectItem value="sail">Sail</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label :class="labelCls">Class</Label>
      <Select :model-value="boatClass" @update:model-value="v => emit('update:boatClass', String(v ?? ''))">
        <SelectTrigger :class="inputCls"><SelectValue placeholder="Any" /></SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Any</SelectItem>
          <SelectItem v-for="c in ['Motor Yachts','Sailing Yachts','Sport Yachts','Mega Yachts','Expedition','Trawlers','Catamarans','Sport Fishers']" :key="c" :value="c">{{ c }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1.5">
        <Label :class="labelCls">Make</Label>
        <Input :model-value="builder" @update:model-value="v => emit('update:builder', String(v ?? ''))" placeholder="Lurssen…" :class="inputCls" />
      </div>
      <div class="flex flex-col gap-1.5">
        <Label :class="labelCls">Model</Label>
        <Input :model-value="boatModel" @update:model-value="v => emit('update:boatModel', String(v ?? ''))" placeholder="FD80…" :class="inputCls" />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <Label :class="labelCls">Length</Label>
        <div class="inline-flex border border-[#cdc4ad]">
          <button type="button" @click="emit('update:lengthUnit', 'm')" :class="['px-2 py-0.5 text-[0.66rem] uppercase tracking-widest', lengthUnit === 'm' ? 'bg-navy text-ivory' : 'bg-white text-navy']">m</button>
          <button type="button" @click="emit('update:lengthUnit', 'ft')" :class="['px-2 py-0.5 text-[0.66rem] uppercase tracking-widest', lengthUnit === 'ft' ? 'bg-navy text-ivory' : 'bg-white text-navy']">ft</button>
        </div>
      </div>
      <div class="flex gap-2">
        <Input :model-value="loa_min" type="number" @update:model-value="v => emit('update:loa_min', String(v ?? ''))" placeholder="Min" :class="inputCls" />
        <Input :model-value="loa_max" type="number" @update:model-value="v => emit('update:loa_max', String(v ?? ''))" placeholder="Max" :class="inputCls" />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label :class="labelCls">Year</Label>
      <div class="flex gap-2">
        <Input :model-value="year_min" type="number" @update:model-value="v => emit('update:year_min', String(v ?? ''))" placeholder="From" :class="inputCls" />
        <Input :model-value="year_max" type="number" @update:model-value="v => emit('update:year_max', String(v ?? ''))" placeholder="To" :class="inputCls" />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label :class="labelCls">Price (USD)</Label>
      <div class="flex gap-2">
        <Input :model-value="price_min" type="number" @update:model-value="v => emit('update:price_min', String(v ?? ''))" placeholder="Min" :class="inputCls" />
        <Input :model-value="price_max" type="number" @update:model-value="v => emit('update:price_max', String(v ?? ''))" placeholder="Max" :class="inputCls" />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label :class="labelCls">Power (hp)</Label>
      <div class="flex gap-2">
        <Input :model-value="power_min" type="number" @update:model-value="v => emit('update:power_min', String(v ?? ''))" placeholder="Min" :class="inputCls" />
        <Input :model-value="power_max" type="number" @update:model-value="v => emit('update:power_max', String(v ?? ''))" placeholder="Max" :class="inputCls" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1.5">
        <Label :class="labelCls">Max hours</Label>
        <Input :model-value="engineHours_max" type="number" @update:model-value="v => emit('update:engineHours_max', String(v ?? ''))" placeholder="Any" :class="inputCls" />
      </div>
      <div class="flex flex-col gap-1.5">
        <Label :class="labelCls">Min guests</Label>
        <Input :model-value="capacity_min" type="number" @update:model-value="v => emit('update:capacity_min', String(v ?? ''))" placeholder="Any" :class="inputCls" />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <Label :class="labelCls">Condition</Label>
      <Select :model-value="condition" @update:model-value="v => emit('update:condition', String(v ?? ''))">
        <SelectTrigger :class="inputCls"><SelectValue placeholder="Any" /></SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Any</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="used">Used</SelectItem>
          <SelectItem value="refit">Recently refit</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <button type="button" class="w-full border border-rule hover:border-navy text-navy py-2.5 text-xs uppercase tracking-widest transition-colors" @click="emit('reset')">Reset filters</button>
  </div>
</template>
