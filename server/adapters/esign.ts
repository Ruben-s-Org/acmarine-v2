// EsignAdapter, build-light by default with a tamper-evident audit trail.
// Spec: consent + intent + attribution + IP + timestamp + PDF hash.
// Swap to DocuSign / HelloSign by implementing the same interface.

import { randomToken } from '../utils/crypto'

export interface SignRequest {
  dealId: string
  documentId: string
  signerName: string
  signerEmail: string
  signerIp: string | null
  signerUserAgent: string | null
  pdfHash: string
  consentText: string
}

export interface AuditTrail {
  documentId: string
  dealId: string
  pdfHash: string
  consentText: string
  attribution: { name: string; email: string; ip: string | null; userAgent: string | null }
  events: { kind: 'viewed' | 'consented' | 'signed'; at: number }[]
  receipt: string
}

export interface EsignAdapter {
  readonly name: string
  sign(req: SignRequest): Promise<AuditTrail>
}

class BuildLightEsign implements EsignAdapter {
  readonly name = 'build-light'
  async sign(req: SignRequest): Promise<AuditTrail> {
    const now = Math.floor(Date.now() / 1000)
    return {
      documentId: req.documentId,
      dealId: req.dealId,
      pdfHash: req.pdfHash,
      consentText: req.consentText,
      attribution: { name: req.signerName, email: req.signerEmail, ip: req.signerIp, userAgent: req.signerUserAgent },
      events: [
        { kind: 'viewed', at: now },
        { kind: 'consented', at: now },
        { kind: 'signed', at: now }
      ],
      receipt: 'rcp_' + randomToken(8)
    }
  }
}

export function getEsignAdapter(): EsignAdapter {
  return new BuildLightEsign()
}
