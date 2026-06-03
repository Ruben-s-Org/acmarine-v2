import { queryOne, execute } from '~~/server/db/client'
import { requireBroker } from '~~/server/utils/authz'
import { generatePurchaseAgreementPdf } from '~~/server/utils/pdf'
import { randomToken } from '~~/server/utils/crypto'

export default defineEventHandler(async (event) => {
  const { brokerId } = await requireBroker(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const deal = await queryOne<any>(
    event,
    `SELECT d.*, v.name AS vessel_name, v.make, v.model, v.year, v.length_ft, v.beam_ft, v.hull_id,
       v.engine_make, v.engine_model, v.engine_hours, v.location AS vessel_location,
       buyer.name AS buyer_name, buyer.email AS buyer_email, buyer.phone AS buyer_phone,
       seller.name AS seller_name, seller.email AS seller_email, seller.phone AS seller_phone,
       b.display_name AS broker_display_name, b.legal_name AS broker_legal_name,
       b.license_number, b.license_state, b.email AS broker_email, b.phone AS broker_phone
     FROM deals d
     LEFT JOIN vessels v ON v.id = d.vessel_id
     LEFT JOIN contacts buyer ON buyer.id = d.buyer_contact_id
     LEFT JOIN contacts seller ON seller.id = d.seller_contact_id
     LEFT JOIN brokers b ON b.id = d.broker_id
     WHERE d.id = ? AND d.broker_id = ? LIMIT 1`,
    [id, brokerId]
  )
  if (!deal) throw createError({ statusCode: 404, statusMessage: 'Deal not found' })

  const now = Math.floor(Date.now() / 1000)
  const { bytes, hash } = await generatePurchaseAgreementPdf({
    broker: {
      display_name: deal.broker_display_name,
      legal_name: deal.broker_legal_name,
      license_number: deal.license_number,
      license_state: deal.license_state,
      email: deal.broker_email,
      phone: deal.broker_phone
    },
    buyer: { name: deal.buyer_name || 'Buyer (TBD)', email: deal.buyer_email, phone: deal.buyer_phone },
    seller: { name: deal.seller_name || 'Seller (TBD)', email: deal.seller_email, phone: deal.seller_phone },
    vessel: {
      name: deal.vessel_name || '',
      make: deal.make, model: deal.model, year: deal.year,
      length_ft: deal.length_ft, beam_ft: deal.beam_ft, hull_id: deal.hull_id,
      engine_make: deal.engine_make, engine_model: deal.engine_model, engine_hours: deal.engine_hours,
      location: deal.vessel_location
    },
    deal: {
      id: deal.id,
      offer_amount: deal.offer_amount, agreed_amount: deal.agreed_amount, currency: deal.currency,
      expected_close: deal.expected_close, contingencies: deal.notes
    },
    generatedAt: now
  })

  const docId = 'doc_' + randomToken(8)
  const blobKey = `documents/${brokerId}/${docId}.pdf`

  const env = (event.context as any).cloudflare?.env
  const blob = env?.BLOB as { put: (key: string, value: Uint8Array, options?: any) => Promise<any> } | undefined
  if (!blob) throw createError({ statusCode: 500, statusMessage: 'R2 binding missing' })
  await blob.put(blobKey, bytes, { httpMetadata: { contentType: 'application/pdf' } })

  await execute(
    event,
    `INSERT INTO documents (id, broker_id, deal_id, kind, blob_key, pdf_hash) VALUES (?, ?, ?, 'purchase_sale', ?, ?)`,
    [docId, brokerId, deal.id, blobKey, hash]
  )

  return { ok: true, document_id: docId, blob_key: blobKey, pdf_hash: hash }
})
