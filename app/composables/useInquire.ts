// Shared inquiry dialog state across the app.
// Open with { listingSlug, listingName } from a yacht detail, { service } from
// a service card or location page, or empty for a generic inquiry.

const open = ref(false)
const listingSlug = ref<string>('')
const listingName = ref<string>('')
const service = ref<string>('')

export function useInquire() {
  function openDialog(opts?: { listingSlug?: string; listingName?: string; service?: string }) {
    listingSlug.value = opts?.listingSlug || ''
    listingName.value = opts?.listingName || ''
    service.value = opts?.service || ''
    open.value = true
  }
  function closeDialog() { open.value = false }
  return { open, listingSlug, listingName, service, openDialog, closeDialog }
}
