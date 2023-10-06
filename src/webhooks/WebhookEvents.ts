import crypto from 'crypto'
import { Readable } from 'stream'

export const signatureHeader = 'paddle-signature'

export class WebhookEvents {
  private signature: string
  private webhookSecret: string

  constructor(signature: string, webhookSecret?: string) {
    if (!webhookSecret) throw new Error('No Paddle webhook secret set!')

    this.signature = signature
    this.webhookSecret = webhookSecret
  }

  static async buffer(readable: Readable): Promise<Buffer> {
    const chunks: any[] = []
    for await (const chunk of readable) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks)
  }

  private extractHeaderElements(header: string): { ts: string; receivedH1: string } {
    const parts = header.split(';')

    if (parts.length !== 2) {
      throw new Error('Incompatible header format')
    }

    const tsPart = parts.find((part) => part.startsWith('ts='))
    const h1Part = parts.find((part) => part.startsWith('h1='))

    if (!tsPart || !h1Part) {
      throw new Error('Missing ts or h1 in header')
    }

    const ts = tsPart.split('=')[1]
    const receivedH1 = h1Part.split('=')[1]

    if (!ts || !receivedH1) {
      throw new Error('Missing ts or h1 values in header')
    }

    return { ts, receivedH1 }
  }

  private buildPayload(ts: string, requestBody: string): string {
    return [ts, requestBody].join(':')
  }

  private hashPayload(payload: string, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payload)
    return hmac.digest('hex')
  }

  private verifyPaddleSignature(requestBody: Buffer) {
    const { ts, receivedH1 } = this.extractHeaderElements(this.signature)
    const payload = this.buildPayload(ts, requestBody.toString('utf8'))
    const computedH1 = this.hashPayload(payload, this.webhookSecret)

    if (receivedH1 !== computedH1) {
      throw new Error('Invalid paddle signature')
    }
  }

  constructEvent(buf: Buffer) {
    this.verifyPaddleSignature(buf)
    return JSON.parse(buf.toString('utf8'))
  }
}
