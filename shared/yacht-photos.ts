// Self-hosted yacht photography (13 photos) served from our R2 bucket.
// Pre-loaded once, served via /api/images/_meta/stock/*.jpg, so the rotation
// can never break from an upstream Unsplash URL change.

export const YACHT_PHOTOS: string[] = Array.from({ length: 13 }, (_, i) =>
  `/api/images/_meta/stock/stock-${String(i + 1).padStart(2, '0')}.jpg`,
)

export function pickYachtPhoto(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  }
  const idx = Math.abs(h) % YACHT_PHOTOS.length
  return YACHT_PHOTOS[idx]
}
