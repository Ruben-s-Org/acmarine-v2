<script setup lang="ts">
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { MailCheck } from 'lucide-vue-next'
import { useInquire } from '~/composables/useInquire'

const { open, listingSlug, listingName, service, closeDialog } = useInquire()
const name = ref('')
const email = ref('')
const phone = ref('')
const message = ref('')
const note = ref('')
const submitting = ref(false)
const submitted = ref(false)

const title = computed(() => {
  if (service.value) return `${service.value}.`
  if (listingName.value || listingSlug.value) return 'Request a viewing.'
  return 'Write to the office.'
})

watch(open, (v) => {
  if (!v) {
    setTimeout(() => { submitted.value = false; note.value = '' }, 250)
    return
  }
  note.value = ''
  submitted.value = false
  if (service.value && !message.value.trim()) {
    message.value = `I would like to inquire about your ${service.value} service.`
  } else if (listingName.value && !message.value.trim()) {
    message.value = `Regarding ${listingName.value}.`
  } else if (listingSlug.value && !message.value.trim()) {
    message.value = `Regarding ${listingSlug.value.replace(/-/g, ' ')}.`
  }
})

async function submit(e: Event) {
  e.preventDefault()
  const n = name.value.trim()
  const e1 = email.value.trim()
  const p1 = phone.value.trim()
  const m = message.value.trim()
  if (!n || !m || (!e1 && !p1)) {
    note.value = 'Please leave your name, a way for us to reach you, and a brief note.'
    return
  }
  submitting.value = true
  try {
    await $fetch('/api/inquire', {
      method: 'POST',
      body: {
        name: n, email: e1, phone: p1, message: m,
        service: service.value || null,
        listing_slug: listingSlug.value || null,
        listing_name: listingName.value || null,
      },
    })
    submitted.value = true
    name.value = ''; email.value = ''; phone.value = ''; message.value = ''
    setTimeout(() => closeDialog(), 4500)
  } catch (err) {
    note.value = 'Something went wrong. Please write to office@acmarine.co directly.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="bg-ivory-soft border-0 max-w-[560px] p-0 shadow-2xl">
      <!-- THANK YOU STATE -->
      <div v-if="submitted" class="p-10 sm:p-14 text-center flex flex-col items-center">
        <div class="w-16 h-16 flex items-center justify-center bg-navy text-ivory mb-6">
          <MailCheck class="w-8 h-8" :stroke-width="1.5" />
        </div>
        <DialogTitle class="font-serif text-3xl md:text-4xl text-navy mb-3" style="line-height: 1.1">Thank you.</DialogTitle>
        <DialogDescription class="font-serif italic text-lg text-ink/75 max-w-[34ch] leading-snug">
          The office has your note. We will write to you promptly.
        </DialogDescription>
        <button type="button" class="mt-8 text-xs uppercase tracking-widest text-brass-deep hover:text-navy underline underline-offset-4 decoration-brass/40" @click="closeDialog">Close</button>
      </div>

      <!-- FORM STATE -->
      <div v-else class="p-8">
        <p class="eyebrow mb-3">Inquire</p>
        <DialogTitle class="font-serif text-3xl text-navy mb-2">{{ title }}</DialogTitle>
        <DialogDescription class="text-sm text-ink/70 mb-6 leading-relaxed">
          Tell us, briefly. The director on duty replies promptly.
        </DialogDescription>

        <form class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit="submit" novalidate>
          <div class="flex flex-col gap-2 sm:col-span-2">
            <Label class="text-[0.72rem] uppercase tracking-widest text-ink/60">Name</Label>
            <Input v-model="name" type="text" autocomplete="name" class="bg-white border border-[#cdc4ad] text-navy" />
          </div>
          <div class="flex flex-col gap-2">
            <Label class="text-[0.72rem] uppercase tracking-widest text-ink/60">Email</Label>
            <Input v-model="email" type="email" autocomplete="email" inputmode="email" class="bg-white border border-[#cdc4ad] text-navy" />
          </div>
          <div class="flex flex-col gap-2">
            <Label class="text-[0.72rem] uppercase tracking-widest text-ink/60">Phone</Label>
            <Input v-model="phone" type="tel" autocomplete="tel" inputmode="tel" class="bg-white border border-[#cdc4ad] text-navy" />
          </div>
          <div class="flex flex-col gap-2 sm:col-span-2">
            <Label class="text-[0.72rem] uppercase tracking-widest text-ink/60">Vessel or matter</Label>
            <Textarea v-model="message" rows="5" class="bg-white border border-[#cdc4ad] text-navy resize-y" />
          </div>
          <Button type="submit" :disabled="submitting" class="sm:col-span-2 bg-navy hover:bg-navy-deep text-ivory tracking-wider py-6">
            {{ submitting ? 'Sending…' : 'Send' }}
          </Button>
          <p v-if="note" class="sm:col-span-2 text-sm text-brass-deep">{{ note }}</p>
        </form>

        <p class="mt-6 font-serif text-base text-ink/70">
          Or write directly:
          <a href="mailto:office@acmarine.co" class="underline underline-offset-4 decoration-brass text-navy">office@acmarine.co</a>
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
