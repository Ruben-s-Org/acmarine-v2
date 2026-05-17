// Curated rotation of yacht / marine photography sourced from Unsplash.
// Use `pickYachtPhoto(seed)` to deterministically assign one to an article or section.

export const YACHT_PHOTOS: string[] = [
  'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469796466635-455ede028aca?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540946485063-a8eaaba49a78?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542902093-d55926049754?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554473675-d0904f3cbf38?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490127252417-7c393f993ee4?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559310278-18a9192d909f?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599596755030-7d4a72cb46bb?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599639957043-f3c6c30c5e15?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599582909646-2b54e9e94be8?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1572215220933-7a803b48e0aa?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469796466635-455ede028aca?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564415051889-65820254fc01?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542937553-3fc16dd16f33?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495709362-d3989aabad9c?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606768666853-403c90a981ad?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531084218979-a37f86a48a59?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565027233194-1f4ebe71f9b1?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554254464-7046778097bd?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564415051889-65820254fc01?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517627043994-f33b08a3a4ad?w=1600&q=80&auto=format&fit=crop',
]

export function pickYachtPhoto(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  }
  const idx = Math.abs(h) % YACHT_PHOTOS.length
  return YACHT_PHOTOS[idx]
}
