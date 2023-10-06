# Paddle Billing SDK

See https://developer.paddle.com/api-reference/overview

## Getting Started

SDK for Node.js runtime to send API requests to Paddle Billing endpoints

## Setup

```bash
npm i @team-gpt/paddle-billing-sdk
```

```bash
yarn add @team-gpt/paddle-billing-sdk
```

## Endpoints

- [x] Prices
- [x] Products
- [x] Customer
- [ ] Discounts
- [ ] Addresses
- [ ] Businesses
- [ ] Transactions
- [x] Subscriptions
- [ ] Adjustments
- [ ] Event types
- [ ] Events
- [ ] Notifications

## Usage

### Paddle Client

```tsx
import { PaddleClient } from '@team-gpt/paddle-billing-sdk'

/**
 * @see https://developer.paddle.com/api-reference/prices/overview
 */
export const paddleClient = new PaddleClient({
  authToken: process.env.PADDLE_AUTH_SECRET || 'MISSING',
  vendorId: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
  sandbox: Boolean(process.env.NEXT_PUBLIC_PADDLE_SANDBOX),
})
```

### Webhooks

Usage with Next.js API handlers

```tsx
import { WebhookEvents, signatureHeader } from 'paddle-billing-sdk'
import { NextApiRequest, NextApiResponse } from 'next'

const authSecret = process.env.PADDLE_AUTH_SECRET
const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET

if (!authSecret) throw new Error('No Paddle auth secret set!')

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  if (!req.headers[signatureHeader] || typeof req.headers[signatureHeader] !== 'string') {
    res.status(400).end('Invalid signature')
    return
  }

  try {
    const sig = req.headers[signatureHeader]
    const events = new WebhookEvents(sig, webhookSecret)
    const buf = await WebhookEvents.buffer(req)
    const event = events.constructEvent(buf)
    console.log(event)
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    }
  }
}
```

## License

MIT
