<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import type { Listing, Inquiry, Article } from '~~/shared/types'

useHead({ title: 'Office. Aldridge & Charles Marine.' })
definePageMeta({ layout: 'admin' })

const authed = ref(false)
const password = ref('')
const loginErr = ref('')
const tab = ref<'listings' | 'articles' | 'inquiries'>('listings')
const listings = ref<Listing[]>([])
const inquiries = ref<Inquiry[]>([])
const articles = ref<Article[]>([])
const dialogOpen = ref(false)
const articleDialogOpen = ref(false)
const note = ref('')
const articleNote = ref('')
const submitting = ref(false)
const articleSubmitting = ref(false)

const form = reactive<Partial<Listing> & { _hero_file?: File | null; _gallery_files?: FileList | null; _specs_text?: string; _gallery_text?: string }>({
  status: 'available',
})

const articleForm = reactive<Partial<Article> & { _hero_file?: File | null; _keywords_text?: string; _original_slug?: string }>({})

async function checkAuth() {
  try {
    const r: any = await $fetch('/api/admin/whoami')
    authed.value = !!r.authenticated
    if (authed.value) { loadListings(); loadInquiries(); loadArticles() }
  } catch { authed.value = false }
}
checkAuth()

async function login() {
  loginErr.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    authed.value = true
    password.value = ''
    loadListings()
    loadInquiries()
    loadArticles()
  } catch {
    loginErr.value = 'Incorrect key.'
  }
}
async function logout() {
  await $fetch('/api/admin/login', { method: 'DELETE' })
  authed.value = false
}

async function loadListings() {
  const r: any = await $fetch('/api/listings?drafts=1')
  listings.value = r.listings || []
}
async function loadInquiries() {
  try {
    const r: any = await $fetch('/api/inquiries')
    inquiries.value = r.inquiries || []
  } catch {}
}
async function loadArticles() {
  try {
    const r: any = await $fetch('/api/articles')
    articles.value = r.articles || []
  } catch {}
}

function openNew() {
  Object.assign(form, { id: undefined, name: '', slug: '', builder: '', boatModel: '', boatClass: '', year: undefined, loa_m: undefined, beam_m: undefined, engine: '', power: undefined, engineHours: undefined, capacity: undefined, price: '', price_num: undefined, location: '', short: '', description: '', hero_image: '', _hero_file: null, _gallery_text: '', _gallery_files: null, _specs_text: '', specs: {}, gallery: [], type: undefined, condition: undefined, class_society: '', status: 'available' })
  dialogOpen.value = true
  note.value = ''
}
function openEdit(l: Listing) {
  Object.assign(form, { ...l, _hero_file: null, _gallery_files: null, _gallery_text: (l.gallery || []).join('\n'), _specs_text: Object.entries(l.specs || {}).map(([k, v]) => `${k}: ${v}`).join('\n') })
  dialogOpen.value = true
  note.value = ''
}

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const r: any = await $fetch('/api/upload', { method: 'POST', body: fd })
  return r.url
}

async function save() {
  if (!form.name) { note.value = 'Name required.'; return }
  submitting.value = true
  note.value = 'Saving.'
  try {
    let hero = form.hero_image
    if (form._hero_file) hero = await uploadFile(form._hero_file)
    let gallery = (form._gallery_text || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    if (form._gallery_files) {
      for (const f of Array.from(form._gallery_files)) gallery.push(await uploadFile(f))
    }
    const specs: Record<string, string> = {}
    for (const line of (form._specs_text || '').split(/\r?\n/)) {
      const m = line.match(/^([^:]+):\s*(.+)$/)
      if (m) specs[m[1].trim()] = m[2].trim()
    }
    const payload: Partial<Listing> = {
      id: form.id, name: form.name, slug: form.slug || undefined,
      builder: form.builder, boatModel: form.boatModel, boatClass: form.boatClass,
      year: form.year, loa_m: form.loa_m, beam_m: form.beam_m,
      engine: form.engine, power: form.power, engineHours: form.engineHours, capacity: form.capacity,
      price: form.price, price_num: form.price_num,
      location: form.location, short: form.short, description: form.description,
      hero_image: hero, gallery: gallery.length ? gallery : undefined,
      specs: Object.keys(specs).length ? specs : undefined,
      status: form.status, type: form.type, condition: form.condition, class_society: form.class_society,
    }
    await $fetch('/api/listings', { method: 'POST', body: payload })
    dialogOpen.value = false
    note.value = ''
    loadListings()
  } catch (e: any) {
    note.value = `Save failed: ${e.statusMessage || e.message}`
  } finally {
    submitting.value = false
  }
}

async function remove(l: Listing) {
  if (!confirm(`Delete listing "${l.name}"? This cannot be undone.`)) return
  await $fetch(`/api/listings/${l.id}`, { method: 'DELETE' })
  loadListings()
}

function openNewArticle() {
  Object.assign(articleForm, {
    slug: '', title: '', seo_title: '', description: '', category: 'Brokerage',
    image_url: '', content: '', _hero_file: null, _keywords_text: '',
    _original_slug: '', published_at: '',
  })
  articleNote.value = ''
  articleDialogOpen.value = true
}
function openEditArticle(a: Article) {
  Object.assign(articleForm, {
    ...a,
    _hero_file: null,
    _keywords_text: (a.keywords || []).join(', '),
    _original_slug: a.slug,
  })
  articleNote.value = ''
  articleDialogOpen.value = true
}
async function saveArticle() {
  if (!articleForm.title) { articleNote.value = 'Title required.'; return }
  if (!articleForm.content) { articleNote.value = 'Content required.'; return }
  articleSubmitting.value = true
  articleNote.value = 'Saving.'
  try {
    let image_url = articleForm.image_url
    if (articleForm._hero_file) image_url = await uploadFile(articleForm._hero_file)
    const keywords = (articleForm._keywords_text || '').split(',').map(s => s.trim()).filter(Boolean)
    const payload: Partial<Article> = {
      slug: articleForm._original_slug || articleForm.slug || undefined,
      title: articleForm.title,
      seo_title: articleForm.seo_title || undefined,
      description: articleForm.description,
      category: articleForm.category,
      keywords: keywords.length ? keywords : undefined,
      image_url: image_url || undefined,
      content: articleForm.content,
      published_at: articleForm.published_at || undefined,
    }
    await $fetch('/api/articles', { method: 'POST', body: payload })
    articleDialogOpen.value = false
    articleNote.value = ''
    loadArticles()
  } catch (e: any) {
    articleNote.value = `Save failed: ${e.statusMessage || e.message}`
  } finally {
    articleSubmitting.value = false
  }
}
async function removeArticle(a: Article) {
  if (!confirm(`Delete article "${a.title}"? This cannot be undone.`)) return
  await $fetch(`/api/articles/${a.slug}`, { method: 'DELETE' })
  loadArticles()
}
</script>

<template>
  <div class="min-h-screen bg-ivory-soft">
    <header class="bg-ivory border-b border-rule px-6 py-4 flex justify-between items-center">
      <NuxtLink to="/" class="flex items-center gap-3 text-navy" aria-label="Aldridge and Charles Marine">
        <img src="/img/logo.png" alt="Aldridge & Charles Marine" width="469" height="144" style="height: 28px; width: auto" />
        <span class="font-sans text-[0.6rem] uppercase text-brass-deep ml-1" style="letter-spacing: 0.36em">Office</span>
      </NuxtLink>
      <Button v-if="authed" variant="outline" size="sm" @click="logout">Sign out</Button>
    </header>

    <main class="container mx-auto max-w-[1200px] px-6 py-10">
      <Card v-if="!authed" class="max-w-[440px] mx-auto mt-8 bg-ivory border-rule">
        <CardContent class="p-8">
          <h1 class="font-serif text-2xl text-navy mb-2">Office access</h1>
          <p class="text-sm text-ink/60 mb-6">Enter the office key to manage the fleet.</p>
          <form class="flex flex-col gap-4" @submit.prevent="login">
            <div>
              <Label class="text-xs uppercase tracking-widest text-ink/60 mb-2 block">Office key</Label>
              <Input v-model="password" type="password" autocomplete="current-password" required class="bg-white border-[#cdc4ad] text-navy py-3" autofocus />
            </div>
            <Button type="submit" class="bg-navy text-ivory hover:bg-navy-deep py-3">Enter</Button>
            <p v-if="loginErr" class="text-sm text-destructive">{{ loginErr }}</p>
          </form>
        </CardContent>
      </Card>

      <div v-else>
        <div class="flex border-b border-rule mb-10">
          <button v-for="t in ['listings','articles','inquiries']" :key="t" :class="['px-6 py-3 text-sm uppercase tracking-widest border-b-2 transition-colors', tab === t ? 'border-brass text-navy' : 'border-transparent text-ink/50 hover:text-navy']" @click="tab = t as any">{{ t }}</button>
        </div>

        <section v-if="tab === 'listings'">
          <div class="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h1 class="font-serif text-2xl md:text-3xl text-navy">Fleet listings</h1>
            <Button class="bg-navy text-ivory hover:bg-navy-deep" @click="openNew">New listing</Button>
          </div>
          <div v-if="listings.length === 0" class="text-center font-serif italic text-ink/50 py-12">No listings yet. Add one to begin.</div>
          <div v-else class="space-y-3">
            <div v-for="l in listings" :key="l.id" class="bg-ivory border border-rule p-4 grid grid-cols-[96px_1fr_auto] gap-4 items-center">
              <img v-if="l.hero_image" :src="l.hero_image" :alt="l.name" class="w-24 h-18 object-cover bg-navy">
              <div v-else class="w-24 h-18 bg-navy flex items-center justify-center text-brass font-serif text-xs">A&amp;C</div>
              <div>
                <h3 class="font-serif text-lg text-navy">{{ l.name }}</h3>
                <p class="text-xs text-ink/60">{{ [l.builder, l.year].filter(Boolean).join(', ') || 'Private' }} · {{ l.status }} · <NuxtLink :to="`/yacht/${l.slug}`" target="_blank" class="text-brass-deep">{{ l.slug }}</NuxtLink></p>
              </div>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="openEdit(l)">Edit</Button>
                <Button variant="destructive" size="sm" @click="remove(l)">Delete</Button>
              </div>
            </div>
          </div>
        </section>

        <section v-if="tab === 'articles'">
          <div class="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h1 class="font-serif text-2xl md:text-3xl text-navy">Articles</h1>
            <Button class="bg-navy text-ivory hover:bg-navy-deep" @click="openNewArticle">New article</Button>
          </div>
          <p class="text-xs text-ink/55 mb-6 max-w-[68ch] leading-relaxed">Manually seeded only. Save auto&middot;pings the sitemap to Google and submits the article URL to the Indexing API. Content accepts markdown ( <code>#</code> heading, <code>##</code> sub, <code>**bold**</code>, <code>[text](url)</code>, <code>- list</code>, <code>&gt; quote</code> ) or raw HTML.</p>
          <div v-if="articles.length === 0" class="text-center font-serif italic text-ink/50 py-12">No articles yet. Add one to begin.</div>
          <div v-else class="space-y-3">
            <div v-for="a in articles" :key="a.slug" class="bg-ivory border border-rule p-4 grid grid-cols-[96px_1fr_auto] gap-4 items-center">
              <img v-if="a.image_url" :src="a.image_url" :alt="a.title" class="w-24 h-18 object-cover bg-navy">
              <div v-else class="w-24 h-18 bg-navy flex items-center justify-center text-brass font-serif text-xs">A&amp;C</div>
              <div>
                <h3 class="font-serif text-lg text-navy">{{ a.title }}</h3>
                <p class="text-xs text-ink/60">{{ a.category || 'Article' }} &middot; {{ (a.published_at || '').slice(0, 10) }} &middot; <NuxtLink :to="`/articles/${a.slug}`" target="_blank" class="text-brass-deep">{{ a.slug }}</NuxtLink></p>
              </div>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="openEditArticle(a)">Edit</Button>
                <Button variant="destructive" size="sm" @click="removeArticle(a)">Delete</Button>
              </div>
            </div>
          </div>
        </section>

        <section v-if="tab === 'inquiries'">
          <h1 class="font-serif text-2xl md:text-3xl text-navy mb-6">Inquiries</h1>
          <div v-if="inquiries.length === 0" class="text-center font-serif italic text-ink/50 py-12">No inquiries yet.</div>
          <div v-else class="space-y-3">
            <div v-for="e in inquiries" :key="e.id" class="bg-ivory border border-rule p-5">
              <div class="flex justify-between items-baseline flex-wrap gap-2 mb-2">
                <div>
                  <span class="font-serif text-lg text-navy">{{ e.name }}</span>
                  <span v-if="e.email" class="text-sm text-ink/60"> · <a :href="`mailto:${e.email}`" class="text-brass-deep">{{ e.email }}</a></span>
                  <span v-if="e.phone" class="text-sm text-ink/60"> · <a :href="`tel:${e.phone}`" class="text-brass-deep">{{ e.phone }}</a></span>
                </div>
                <span class="text-xs text-ink/50">{{ new Date(e.created_at).toLocaleString() }}</span>
              </div>
              <p v-if="(e as any).listing_name || e.listing_slug || (e as any).service" class="text-sm italic text-ink/60 mb-2">
                <span v-if="(e as any).service">Source: <span class="text-brass-deep">{{ (e as any).service }}</span></span>
                <span v-else-if="(e as any).listing_name || e.listing_slug">Re: <NuxtLink :to="`/yacht/${e.listing_slug}`" target="_blank" class="text-brass-deep">{{ (e as any).listing_name || e.listing_slug }}</NuxtLink></span>
              </p>
              <p class="text-base text-ink/82 whitespace-pre-wrap">{{ e.message }}</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <Dialog v-model:open="articleDialogOpen">
      <DialogContent class="bg-ivory-soft max-w-[760px] p-0 border-0 max-h-[92vh] overflow-y-auto">
        <form class="p-6" @submit.prevent="saveArticle">
          <DialogTitle class="font-serif text-2xl text-navy mb-4">{{ articleForm._original_slug ? 'Edit article' : 'New article' }}</DialogTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Title</Label>
              <Input v-model="articleForm.title" required class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-1 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Slug (auto if empty)</Label>
              <Input v-model="articleForm.slug" :disabled="!!articleForm._original_slug" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-1 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Category</Label>
              <Select v-model="articleForm.category">
                <SelectTrigger class="bg-white border-[#cdc4ad] text-navy"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in ['Brokerage','Refit','Charter','Crew','Care','Industry']" :key="c" :value="c">{{ c }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">SEO title (optional, falls back to Title)</Label>
              <Input v-model="articleForm.seo_title" maxlength="80" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Meta description</Label>
              <Textarea v-model="articleForm.description" rows="2" maxlength="200" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Keywords (comma separated)</Label>
              <Input v-model="articleForm._keywords_text" placeholder="brokerage, refit, charter" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-1 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Published date (ISO, optional)</Label>
              <Input v-model="articleForm.published_at" placeholder="2026-05-18T12:00:00.000Z" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-1 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Hero image URL</Label>
              <Input v-model="articleForm.image_url" placeholder="/api/images/…" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Hero image upload (optional)</Label>
              <Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="bg-white border-[#cdc4ad]" @change="articleForm._hero_file = ($event.target as HTMLInputElement).files?.[0] || null" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Body (markdown or HTML)</Label>
              <Textarea v-model="articleForm.content" rows="18" class="bg-white border-[#cdc4ad] text-navy font-mono text-sm" placeholder="# Heading&#10;&#10;Opening paragraph.&#10;&#10;## Subheading&#10;&#10;More text. **Bold**, *italic*, [links](https://example.com).&#10;&#10;- bullet&#10;- bullet&#10;&#10;&gt; A quoted line." />
            </div>
          </div>
          <p v-if="articleNote" class="text-sm text-brass-deep mt-4">{{ articleNote }}</p>
          <div class="flex justify-end gap-3 mt-6 pt-5 border-t border-rule">
            <Button type="button" variant="outline" @click="articleDialogOpen = false">Cancel</Button>
            <Button type="submit" :disabled="articleSubmitting" class="bg-navy text-ivory hover:bg-navy-deep">{{ articleSubmitting ? 'Saving…' : 'Save article' }}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="dialogOpen">
      <DialogContent class="bg-ivory-soft max-w-[760px] p-0 border-0">
        <form class="p-6" @submit.prevent="save">
          <DialogTitle class="font-serif text-2xl text-navy mb-4">{{ form.id ? 'Edit listing' : 'New listing' }}</DialogTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div class="md:col-span-1 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Name</Label>
              <Input v-model="form.name" required class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-1 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Slug (auto if empty)</Label>
              <Input v-model="form.slug" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Builder</Label>
              <Input v-model="form.builder" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Model</Label>
              <Input v-model="form.boatModel" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Class</Label>
              <Select v-model="form.boatClass">
                <SelectTrigger class="bg-white border-[#cdc4ad] text-navy"><SelectValue placeholder="(unspecified)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in ['Motor Yachts','Sailing Yachts','Sport Yachts','Mega Yachts','Expedition','Trawlers','Catamarans','Sport Fishers']" :key="c" :value="c">{{ c }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Year</Label>
              <Input v-model.number="form.year" type="number" min="1900" max="2100" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">LOA (metres)</Label>
              <Input v-model.number="form.loa_m" type="number" step="0.1" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Beam (metres)</Label>
              <Input v-model.number="form.beam_m" type="number" step="0.1" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Engine</Label>
              <Input v-model="form.engine" placeholder="Twin MAN 1182hp D2868LE436" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Total Power (hp)</Label>
              <Input v-model.number="form.power" type="number" min="0" step="50" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Engine Hours</Label>
              <Input v-model.number="form.engineHours" type="number" min="0" step="10" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Guest Capacity</Label>
              <Input v-model.number="form.capacity" type="number" min="0" max="100" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Location</Label>
              <Input v-model="form.location" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Price (display)</Label>
              <Input v-model="form.price" placeholder="USD 12,500,000 or Price upon request" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Price (USD numeric, for filters)</Label>
              <Input v-model.number="form.price_num" type="number" min="0" step="100000" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Type</Label>
              <Select v-model="form.type as any">
                <SelectTrigger class="bg-white border-[#cdc4ad] text-navy"><SelectValue placeholder="(unspecified)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="sail">Sail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Condition</Label>
              <Select v-model="form.condition as any">
                <SelectTrigger class="bg-white border-[#cdc4ad] text-navy"><SelectValue placeholder="(unspecified)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refit">Recently refit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Classification</Label>
              <Input v-model="form.class_society" placeholder="Lloyd's, Bureau Veritas…" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Status</Label>
              <Select v-model="form.status as any">
                <SelectTrigger class="bg-white border-[#cdc4ad] text-navy"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sale-pending">Sale Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="draft">Draft (hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Short blurb</Label>
              <Input v-model="form.short" maxlength="200" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Description</Label>
              <Textarea v-model="form.description" rows="6" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Hero image upload</Label>
              <Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="bg-white border-[#cdc4ad]" @change="form._hero_file = ($event.target as HTMLInputElement).files?.[0] || null" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Hero image URL</Label>
              <Input v-model="form.hero_image" placeholder="/api/images/yachts/…" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Gallery (one URL per line)</Label>
              <Textarea v-model="form._gallery_text" rows="4" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Gallery upload (multiple)</Label>
              <Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple class="bg-white border-[#cdc4ad]" @change="form._gallery_files = ($event.target as HTMLInputElement).files" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-1.5">
              <Label class="text-xs uppercase tracking-widest text-ink/60">Specs (one per line, e.g. Range: 6,000 nm)</Label>
              <Textarea v-model="form._specs_text" rows="4" class="bg-white border-[#cdc4ad] text-navy" />
            </div>
          </div>
          <p v-if="note" class="text-sm text-brass-deep mt-4">{{ note }}</p>
          <div class="flex justify-end gap-3 mt-6 pt-5 border-t border-rule">
            <Button type="button" variant="outline" @click="dialogOpen = false">Cancel</Button>
            <Button type="submit" :disabled="submitting" class="bg-navy text-ivory hover:bg-navy-deep">{{ submitting ? 'Saving…' : 'Save listing' }}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
