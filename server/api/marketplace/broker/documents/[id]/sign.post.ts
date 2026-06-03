import { queryOne, execute } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'
import { getEsignAdapter } from '~~/server/adapters/esign'

interface Body {
  signer_name?: string
  signer_email?: string
  consent?: boolean
}

const CONSENT_TEXT = 'I agree to sign this document electronically and that my electronic signature has the same legal effect as a handwritten signature. acmarine.co will record the time, my IP, my user agent, and the hash of the document I am signing.'

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const body = await readBody<Body>(event)
  if (!body?.signer_name || !body?.signer_email || !body?.consent) {
    throw createError({ statusCode: 400, statusMessage: 'signer_name, signer_email, and consent are required' })
  }

  const doc = await queryOne<{ id: string; broker_id: string; pdf_hash: string; deal_id: string }>(
    event,
    `SELECT id, broker_id, pdf_hash, deal_id FROM documents WHERE id = ? LIMIT 1`,
    [id]
  )
  if (!doc || doc.broker_id !== brokerId) throw createError({ statusCode: 404, statusMessage: 'Document not found' })

  const adapter = getEsignAdapter()
  const ip = getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-real-ip') || null
  const ua = getHeader(event, 'user-agent') || null

  const audit = await adapter.sign({
    dealId: doc.deal_id,
    documentId: doc.id,
    signerName: body.signer_name,
    signerEmail: body.signer_email,
    signerIp: ip,
    signerUserAgent: ua,
    pdfHash: doc.pdf_hash,
    consentText: CONSENT_TEXT
  })

  await execute(
    event,
    `UPDATE documents SET signed_at = unixepoch(), signer_name = ?, signer_email = ?, signer_ip = ?, signer_user_agent = ?, audit_trail = ? WHERE id = ?`,
    [body.signer_name, body.signer_email, ip, ua, JSON.stringify(audit), id]
  )

  return { ok: true, receipt: audit.receipt, pdf_hash: doc.pdf_hash, signed_at: Math.floor(Date.now() / 1000) }
})
