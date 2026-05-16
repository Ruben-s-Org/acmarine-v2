<script setup lang="ts">
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { X } from 'lucide-vue-next'
import { useInquire } from '~/composables/useInquire'

const { open, listingSlug, service, closeDialog } = useInquire()
const name = ref('')
const email = ref('')
const message = ref('')
const note = ref('')
const submitting = ref(false)

const title = computed(() => {
  if (service.value) return `${service.value}. Inquire.`
  if (listingSlug.value) return 'Request a viewing.'
  return 'Write to the office.'
})

watch(open, (v) => {
  if (!v) return
  note.value = ''
  // Reset message only if no preset
  if (service.value && !message.value.trim()) {
    message.value = `I would like to inquire about your ${service.value} service.`
  } else if (listingSlug.value && !message.value.trim()) {
    message.value = `Regarding ${listingSlug.value.replace(/-/g, ' ')}.`
  }
})

async function submit(e: Event) {
  e.preventDefault()
  if (!name.value || !email.value || !message.value) {
    note.value = 'Please complete every field.'
    return
  }
  submitting.value = true
  try {
    const res = await $fetch('/api/inquire', {
      method: 'POST',
      body: { name: name.value, email: email.value, message: message.value, listing_slug: listingSlug.value || null },
    })
    note.value = 'Thank you. The office will write to you.'
    name.value = ''
    email.value = ''
    message.value = ''
    setTimeout(() => closeDialog(), 1200)
  } catch (err) {
    note.value = 'Something went wrong. Please write to office@acmarine.com directly.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="bg-ivory-soft border-0 max-w-[560px] p-0 shadow-2xl">
      <button type="button" class="absolute top-3 right-3 w-10 h-10 flex items-center justify-center text-navy hover:text-brass-deep" @click="closeDialog" aria-label="Close">
        <X class="w-5 h-5" />
      </button>
      <div class="p-8">
        <p class="eyebrow mb-3">Inquire</p>
        <DialogTitle class="font-serif text-3xl text-navy mb-2">{{ title }}</DialogTitle>
        <DialogDescription class="text-sm text-ink/70 mb-6 leading-relaxed">
          Tell us, briefly. The director on duty replies within two working days.
        </DialogDescription>

        <form class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit="submit">
          <div class="flex flex-col gap-2">
            <Label class="text-[0.72rem] uppercase tracking-widest text-ink/60">Name</Label>
            <Input v-model="name" type="text" autocomplete="name" required class="bg-white border border-[#cdc4ad] text-navy" />
          </div>
          <div class="flex flex-col gap-2">
            <Label class="text-[0.72rem] uppercase tracking-widest text-ink/60">Email</Label>
            <Input v-model="email" type="email" autocomplete="email" required class="bg-white border border-[#cdc4ad] text-navy" />
          </div>
          <div class="flex flex-col gap-2 sm:col-span-2">
            <Label class="text-[0.72rem] uppercase tracking-widest text-ink/60">Vessel or matter</Label>
            <Textarea v-model="message" rows="5" required class="bg-white border border-[#cdc4ad] text-navy resize-y" />
          </div>
          <Button type="submit" :disabled="submitting" class="sm:col-span-2 bg-navy hover:bg-navy-deep text-ivory tracking-wider py-6">
            {{ submitting ? 'Sending…' : 'Send' }}
          </Button>
          <p v-if="note" class="sm:col-span-2 text-sm text-brass-deep">{{ note }}</p>
        </form>

        <p class="mt-6 font-serif text-base text-ink/70">
          Or write directly:
          <a href="mailto:office@acmarine.com" class="underline underline-offset-4 decoration-brass text-navy">office@acmarine.com</a>
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
