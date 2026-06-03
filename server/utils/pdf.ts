import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { sha256Hex } from './crypto'

export interface PurchaseAgreementData {
  broker: { display_name: string; legal_name?: string | null; license_number?: string | null; license_state?: string | null; email: string; phone?: string | null }
  buyer: { name: string; email?: string | null; phone?: string | null; address?: string | null }
  seller: { name: string; email?: string | null; phone?: string | null; address?: string | null }
  vessel: {
    name: string; make?: string | null; model?: string | null; year?: number | null
    length_ft?: number | null; beam_ft?: number | null; hull_id?: string | null
    engine_make?: string | null; engine_model?: string | null; engine_hours?: number | null
    location?: string | null
  }
  deal: {
    id: string
    offer_amount?: number | null
    agreed_amount?: number | null
    currency: string
    expected_close?: number | null
    contingencies?: string | null
  }
  generatedAt: number
}

function fmtCurrency(n: number | null | undefined, currency: string) {
  if (!n && n !== 0) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(n)
}
function fmtDate(ts: number | null | undefined) {
  if (!ts) return ''
  return new Date(ts * 1000).toISOString().slice(0, 10)
}

export async function generatePurchaseAgreementPdf(d: PurchaseAgreementData): Promise<{ bytes: Uint8Array; hash: string }> {
  const pdf = await PDFDocument.create()
  pdf.setTitle(`acmarine.co Purchase & Sale Agreement, deal ${d.deal.id}`)
  pdf.setProducer('acmarine.co')
  pdf.setCreator('acmarine.co')
  pdf.setCreationDate(new Date(d.generatedAt * 1000))

  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const page = pdf.addPage([595.28, 841.89]) // A4
  const { width, height } = page.getSize()
  const margin = 56
  let y = height - margin

  const drawTitle = (s: string) => {
    page.drawText(s, { x: margin, y, size: 18, font: fontBold, color: rgb(0.05, 0.07, 0.13) })
    y -= 24
  }
  const drawH2 = (s: string) => {
    y -= 8
    page.drawText(s, { x: margin, y, size: 11, font: fontBold, color: rgb(0.05, 0.07, 0.13) })
    y -= 14
  }
  const drawKV = (k: string, v: string) => {
    page.drawText(k, { x: margin, y, size: 9, font, color: rgb(0.4, 0.45, 0.55) })
    page.drawText(v, { x: margin + 130, y, size: 10, font, color: rgb(0.05, 0.07, 0.13) })
    y -= 14
  }
  const drawP = (s: string, opts: { size?: number } = {}) => {
    const size = opts.size ?? 9
    const maxWidth = width - margin * 2
    const words = s.split(/\s+/)
    let line = ''
    for (const w of words) {
      const test = line ? `${line} ${w}` : w
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        page.drawText(line, { x: margin, y, size, font })
        y -= 12
        line = w
      } else {
        line = test
      }
    }
    if (line) { page.drawText(line, { x: margin, y, size, font }); y -= 14 }
  }
  const hr = () => {
    page.drawLine({ start: { x: margin, y: y + 4 }, end: { x: width - margin, y: y + 4 }, thickness: 0.5, color: rgb(0.85, 0.86, 0.9) })
    y -= 6
  }

  drawTitle('Purchase & Sale Agreement')
  page.drawText(`acmarine.co, deal ${d.deal.id}`, { x: margin, y, size: 9, font, color: rgb(0.4, 0.45, 0.55) }); y -= 16
  page.drawText(`Generated ${fmtDate(d.generatedAt)}`, { x: margin, y, size: 9, font, color: rgb(0.4, 0.45, 0.55) }); y -= 20

  drawH2('Broker'); hr()
  drawKV('Display name', d.broker.display_name)
  if (d.broker.legal_name) drawKV('Legal name', d.broker.legal_name)
  if (d.broker.license_number) drawKV('License', `${d.broker.license_number}${d.broker.license_state ? ' (' + d.broker.license_state + ')' : ''}`)
  drawKV('Email', d.broker.email)
  if (d.broker.phone) drawKV('Phone', d.broker.phone)

  drawH2('Buyer'); hr()
  drawKV('Name', d.buyer.name)
  if (d.buyer.email) drawKV('Email', d.buyer.email)
  if (d.buyer.phone) drawKV('Phone', d.buyer.phone)

  drawH2('Seller'); hr()
  drawKV('Name', d.seller.name)
  if (d.seller.email) drawKV('Email', d.seller.email)
  if (d.seller.phone) drawKV('Phone', d.seller.phone)

  drawH2('Vessel'); hr()
  drawKV('Name', d.vessel.name)
  drawKV('Make/Model/Year', [d.vessel.year, d.vessel.make, d.vessel.model].filter(Boolean).join(' '))
  if (d.vessel.length_ft) drawKV('Length', `${d.vessel.length_ft} ft`)
  if (d.vessel.beam_ft) drawKV('Beam', `${d.vessel.beam_ft} ft`)
  if (d.vessel.hull_id) drawKV('Hull ID', d.vessel.hull_id)
  if (d.vessel.engine_make) drawKV('Engine', `${d.vessel.engine_make}${d.vessel.engine_model ? ' ' + d.vessel.engine_model : ''}${d.vessel.engine_hours ? ', ' + d.vessel.engine_hours + ' hrs' : ''}`)
  if (d.vessel.location) drawKV('Location', d.vessel.location)

  drawH2('Terms'); hr()
  if (d.deal.offer_amount) drawKV('Offer', fmtCurrency(d.deal.offer_amount, d.deal.currency))
  if (d.deal.agreed_amount) drawKV('Agreed price', fmtCurrency(d.deal.agreed_amount, d.deal.currency))
  if (d.deal.expected_close) drawKV('Expected close', fmtDate(d.deal.expected_close))

  drawH2('Conditions'); hr()
  drawP('This agreement is subject to a satisfactory survey and sea trial within thirty (30) days of signing, plus clear title transfer and standard marine warranties customary in Florida brokerage practice. Buyer\'s deposit (typically 10%) will be held in a non-interest-bearing escrow account by the listing broker until closing or rejection.', { size: 9 })
  if (d.deal.contingencies) drawP(d.deal.contingencies, { size: 9 })

  drawH2('Signatures'); hr()
  drawP('Buyer signature: ______________________________   Date: ______________', { size: 10 }); y -= 6
  drawP('Seller signature: ______________________________   Date: ______________', { size: 10 }); y -= 6
  drawP('Broker signature: _____________________________   Date: ______________', { size: 10 }); y -= 18

  page.drawText('Tamper-evident audit trail: hash of this document is recorded with timestamp, IP, and consent metadata at acmarine.co.', {
    x: margin, y, size: 7, font, color: rgb(0.4, 0.45, 0.55)
  })

  const bytes = await pdf.save()
  // SHA-256 of the bytes (binary) via crypto.subtle.
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
  return { bytes, hash }
}

export async function pdfBytesHash(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export { sha256Hex }
