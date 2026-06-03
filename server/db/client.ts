import type { H3Event } from 'h3'

export interface D1Result<T = unknown> {
  results: T[]
  meta: { duration: number; rows_read: number; rows_written: number; changes: number; last_row_id: number }
  success: boolean
}

export interface D1PreparedStatement {
  bind(...args: unknown[]): D1PreparedStatement
  all<T = unknown>(): Promise<D1Result<T>>
  first<T = unknown>(): Promise<T | null>
  run(): Promise<D1Result>
  raw<T = unknown>(): Promise<T[]>
}

export interface D1Database {
  prepare(sql: string): D1PreparedStatement
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
  exec(sql: string): Promise<{ count: number; duration: number }>
}

function readEnv(event: H3Event) {
  return (event.context as any).cloudflare?.env ?? {}
}

export function getDB(event: H3Event): D1Database {
  const env = readEnv(event)
  const db = env.DB as D1Database | undefined
  if (!db) throw createError({ statusCode: 500, statusMessage: 'D1 binding `DB` not available' })
  return db
}

export async function query<T = Record<string, unknown>>(
  event: H3Event,
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const stmt = getDB(event).prepare(sql)
  const bound = params.length ? stmt.bind(...params) : stmt
  const { results } = await bound.all<T>()
  return results
}

export async function queryOne<T = Record<string, unknown>>(
  event: H3Event,
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const stmt = getDB(event).prepare(sql)
  const bound = params.length ? stmt.bind(...params) : stmt
  return await bound.first<T>()
}

export async function execute(event: H3Event, sql: string, params: unknown[] = []) {
  const stmt = getDB(event).prepare(sql)
  const bound = params.length ? stmt.bind(...params) : stmt
  return await bound.run()
}

export async function batch(event: H3Event, statements: { sql: string; params?: unknown[] }[]) {
  const db = getDB(event)
  const prepared = statements.map(({ sql, params = [] }) => {
    const stmt = db.prepare(sql)
    return params.length ? stmt.bind(...params) : stmt
  })
  return await db.batch(prepared)
}
