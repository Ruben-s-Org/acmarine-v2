// Marketplace EmailAdapter. Default impl uses the existing Mailgun setup
// (already wired for inquiry mail on acmarine.co). Resend is available as
// an alternative when RESEND_API_KEY is set. Console is the dev fallback
// when neither provider is configured.

export interface EmailMessage {
  from: string
  to: string[]
  subject: string
  text?: string
  html?: string
  replyTo?: string
  tags?: { name: string; value: string }[]
}

export interface EmailResult {
  ok: boolean
  id?: string
  error?: string
}

export interface EmailAdapter {
  send(msg: EmailMessage): Promise<EmailResult>
  readonly name: string
}

class MailgunAdapter implements EmailAdapter {
  readonly name = 'mailgun'
  constructor(private apiKey: string, private domain: string, private base: string) {}
  async send(msg: EmailMessage): Promise<EmailResult> {
    const form = new URLSearchParams()
    form.set('from', msg.from)
    for (const t of msg.to) form.append('to', t)
    form.set('subject', msg.subject)
    if (msg.text) form.set('text', msg.text)
    if (msg.html) form.set('html', msg.html)
    if (msg.replyTo) form.set('h:Reply-To', msg.replyTo)
    for (const t of msg.tags ?? []) form.append('o:tag', `${t.name}:${t.value}`)
    const url = `${this.base.replace(/\/+$/, '')}/v3/${this.domain}/messages`
    const auth = 'Basic ' + btoa(`api:${this.apiKey}`)
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString()
      })
      if (!r.ok) {
        const t = await r.text().catch(() => '')
        return { ok: false, error: `Mailgun ${r.status}: ${t.slice(0, 200)}` }
      }
      const data = await r.json().catch(() => ({})) as { id?: string }
      return { ok: true, id: data.id }
    } catch (e: any) {
      return { ok: false, error: e?.message || 'send failed' }
    }
  }
}

class ResendAdapter implements EmailAdapter {
  readonly name = 'resend'
  constructor(private apiKey: string) {}
  async send(msg: EmailMessage): Promise<EmailResult> {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: msg.from, to: msg.to, subject: msg.subject,
          text: msg.text, html: msg.html, reply_to: msg.replyTo, tags: msg.tags
        })
      })
      const data = await r.json().catch(() => ({})) as { id?: string; message?: string }
      if (!r.ok) return { ok: false, error: data.message || `Resend ${r.status}` }
      return { ok: true, id: data.id }
    } catch (e: any) {
      return { ok: false, error: e?.message || 'send failed' }
    }
  }
}

class ConsoleAdapter implements EmailAdapter {
  readonly name = 'console'
  async send(msg: EmailMessage): Promise<EmailResult> {
    console.log('[email:console]', {
      from: msg.from, to: msg.to, subject: msg.subject, replyTo: msg.replyTo,
      preview: (msg.text || msg.html || '').slice(0, 200)
    })
    return { ok: true, id: 'console:' + Math.random().toString(36).slice(2, 10) }
  }
}

interface EnvLike { MAILGUN_API_KEY?: string; MAILGUN_DOMAIN?: string; MAILGUN_BASE?: string; RESEND_API_KEY?: string }

export function getEmailAdapter(env: EnvLike | undefined): EmailAdapter {
  if (env?.MAILGUN_API_KEY && env?.MAILGUN_DOMAIN) {
    return new MailgunAdapter(env.MAILGUN_API_KEY, env.MAILGUN_DOMAIN, env.MAILGUN_BASE || 'https://api.mailgun.net')
  }
  if (env?.RESEND_API_KEY) return new ResendAdapter(env.RESEND_API_KEY)
  return new ConsoleAdapter()
}
