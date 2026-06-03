// Per-broker theme. Stored as JSON in brokers.theme. Runtime CSS-variable
// injection at SSR time. One component bundle, no per-tenant build.
//
// Shape kept deliberately small and stable; new fields default to base values
// so old theme blobs in the DB never break a render.

export interface BrokerTheme {
  colors?: Partial<{
    background: string
    foreground: string
    primary: string
    primaryForeground: string
    muted: string
    mutedForeground: string
    border: string
  }>
  radius?: string
  fontBody?: string
  fontHeading?: string
}

const DEFAULT: Required<Required<BrokerTheme>['colors']> & { radius: string; fontBody: string; fontHeading: string } = {
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222 47% 11%)',
  primary: 'hsl(222 47% 11%)',
  primaryForeground: 'hsl(0 0% 100%)',
  muted: 'hsl(210 40% 96%)',
  mutedForeground: 'hsl(215 16% 47%)',
  border: 'hsl(214 32% 91%)',
  radius: '0.5rem',
  fontBody: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  fontHeading: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
}

export function parseTheme(raw: string | null | undefined): BrokerTheme | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    if (v && typeof v === 'object') return v as BrokerTheme
  } catch {}
  return null
}

export function themeCssVars(theme: BrokerTheme | null | undefined): string {
  if (!theme) return ''
  const c = { ...DEFAULT, ...(theme.colors || {}) }
  const lines: string[] = []
  const map: Record<string, string> = {
    '--color-background': c.background,
    '--color-foreground': c.foreground,
    '--color-primary': c.primary,
    '--color-primary-foreground': c.primaryForeground,
    '--color-muted': c.muted,
    '--color-muted-foreground': c.mutedForeground,
    '--color-border': c.border,
    '--radius': theme.radius || DEFAULT.radius,
    '--font-body': theme.fontBody || DEFAULT.fontBody,
    '--font-heading': theme.fontHeading || DEFAULT.fontHeading
  }
  for (const [k, v] of Object.entries(map)) lines.push(`${k}:${v};`)
  return `:root{${lines.join('')}}`
}
