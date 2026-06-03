// SyndicationAdapter, per-channel feed generators behind a swappable interface.
// All three impls currently produce a minimal placeholder feed and mark the
// run as success; TODO: real integration with YachtWorld / YATCO / Rightboat
// endpoints, schemas, and credentials.

export type Channel = 'yachtworld' | 'yatco' | 'rightboat'

export interface FeedListing {
  id: string
  slug: string
  headline: string
  asking_price: number | null
  currency: string
  description: string | null
  vessel_name: string
  make: string | null
  model: string | null
  year: number | null
  length_ft: number | null
  location: string | null
}

export interface SyndicationResult {
  channel: Channel
  body: string
  contentType: string
  listingCount: number
}

export interface SyndicationAdapter {
  readonly name: string
  build(listings: FeedListing[]): Promise<SyndicationResult>
}

class YachtWorldFeed implements SyndicationAdapter {
  readonly name = 'yachtworld'
  async build(listings: FeedListing[]): Promise<SyndicationResult> {
    // TODO: real integration, YachtWorld accepts a tab-delimited feed plus an FTP
    // image bundle. Stubbed here as tab-delimited rows so the shape is realistic.
    const header = ['id', 'headline', 'make', 'model', 'year', 'length_ft', 'price', 'currency', 'location'].join('\t')
    const rows = listings.map(l => [l.id, l.headline, l.make ?? '', l.model ?? '', l.year ?? '', l.length_ft ?? '', l.asking_price ?? '', l.currency, l.location ?? ''].join('\t'))
    return {
      channel: 'yachtworld',
      body: [header, ...rows].join('\n'),
      contentType: 'text/tab-separated-values',
      listingCount: listings.length
    }
  }
}

class YatcoFeed implements SyndicationAdapter {
  readonly name = 'yatco'
  async build(listings: FeedListing[]): Promise<SyndicationResult> {
    // TODO: real integration, YATCO accepts XML.
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<yatco-feed>',
      ...listings.map(l => `  <listing id="${escapeXml(l.id)}"><headline>${escapeXml(l.headline)}</headline><price>${l.asking_price ?? ''}</price></listing>`),
      '</yatco-feed>'
    ].join('\n')
    return { channel: 'yatco', body: xml, contentType: 'application/xml', listingCount: listings.length }
  }
}

class RightboatFeed implements SyndicationAdapter {
  readonly name = 'rightboat'
  async build(listings: FeedListing[]): Promise<SyndicationResult> {
    // TODO: real integration, Rightboat accepts JSON.
    return {
      channel: 'rightboat',
      body: JSON.stringify({ listings }),
      contentType: 'application/json',
      listingCount: listings.length
    }
  }
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!))
}

export function getSyndicationAdapter(channel: Channel): SyndicationAdapter {
  switch (channel) {
    case 'yachtworld': return new YachtWorldFeed()
    case 'yatco': return new YatcoFeed()
    case 'rightboat': return new RightboatFeed()
  }
}
