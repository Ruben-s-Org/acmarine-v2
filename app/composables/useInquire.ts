// Shared inquire dialog state across the app
const open = ref(false)
const listingSlug = ref<string>('')
const service = ref<string>('')

export function useInquire() {
  function openDialog(opts?: { listingSlug?: string; service?: string }) {
    listingSlug.value = opts?.listingSlug || ''
    service.value = opts?.service || ''
    open.value = true
  }
  function closeDialog() { open.value = false }
  return { open, listingSlug, service, openDialog, closeDialog }
}
