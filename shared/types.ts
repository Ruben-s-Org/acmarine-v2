export interface Listing {
  id: string
  slug: string
  name: string
  builder?: string
  boatModel?: string
  boatClass?: string
  year?: number
  loa_m?: number
  beam_m?: number
  engine?: string
  power?: number
  engineHours?: number
  capacity?: number
  price?: string
  price_num?: number
  location?: string
  short?: string
  description?: string
  hero_image?: string
  gallery?: string[]
  specs?: Record<string, string>
  status?: 'available' | 'sale-pending' | 'sold' | 'draft'
  type?: 'motor' | 'sail'
  condition?: 'new' | 'used' | 'refit'
  class_society?: string
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  name: string
  email: string
  message: string
  listing_slug: string | null
  created_at: string
}

export interface Article {
  slug: string
  title: string
  seo_title?: string
  description: string
  keywords?: string[]
  content: string
  category?: string
  image_url?: string
  source_guid: string
  published_at: string
  created_at: string
}
