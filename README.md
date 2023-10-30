# Paddle Billing SDK

Unofficial Paddle Billing API SDK for Node.js runtime

See <https://developer.paddle.com/api-reference/overview>

## Getting Started

### Setup

```shell
npm i @team-gpt/paddle-billing-sdk
```

```shell
yarn add @team-gpt/paddle-billing-sdk
```

```shell
bun add @team-gpt/paddle-billing-sdk
```

### Peer dependencies

Axios - <https://axios-http.com/>

```shell
npm i axios
yarn add axios
```

### Endpoints

- [x] Prices
- [x] Products
- [x] Customer
- [ ] Discounts
- [ ] Addresses
- [ ] Businesses
- [x] Transactions
- [x] Subscriptions
- [ ] Adjustments
- [ ] Event Types
- [ ] Events
- [ ] Notifications

## Usage

### Authentication

Create an apikey from the Authentication page in Paddle platform:

- <https://vendors.paddle.com/authentication>
- <https://sandbox-vendors.paddle.com/authentication>

```environment
PADDLE_AUTH_SECRET=
NEXT_PUBLIC_PADDLE_VENDOR_ID=
NEXT_PUBLIC_PADDLE_SANDBOX=
```

### Paddle Client

```tsx
import { PaddleClient } from '@team-gpt/paddle-billing-sdk'

/**
 * @see https://developer.paddle.com/api-reference/overview
 */
export const paddleClient = new PaddleClient({
  authToken: process.env.PADDLE_AUTH_SECRET || 'MISSING',
  vendorId: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
  sandbox: Boolean(process.env.NEXT_PUBLIC_PADDLE_SANDBOX),
})
```

### Webhooks

Usage with Next.js API handlers

```ts
// /pages/api/webhooks/paddle-events.ts

import { WebhookEvents, signatureHeader } from 'paddle-billing-sdk'
import { NextApiRequest, NextApiResponse } from 'next'

const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET

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

### Receive webhooks

1. Create an account in <https://ngrok.com/>
2. Expose your local server

   ```shell
   ngrok http 3000
   ```

3. Add the exposed server to Paddle Notifications at <https://sandbox-vendors.paddle.com/notifications>

   ```shell
   https://xxx-xx-xxx-xxx-xx.ngrok-free.app/api/webhooks/paddle-events
   ```

4. Send a request

### TypeError: adapter is not a function

If you're getting this error while using the client then you need to install `axios` as a dependency:

```shell
npm i axios
```

```shell
yarn add axios
```

```shell
bun add axios
```

## Extend custom data

To extend the default custom data interfaces add the following to your codebase

```tsx
// Custom interfaces for metadata
declare module '@team-gpt/paddle-billing-sdk' {
  export interface PriceMetadata {
    myKey: string
  }
  export interface ProductMetadata {
    myKey: string
  }
  export interface CustomerMetadata {
    myKey: string
  }
  export interface TransactionMetadata {
    myKey: string
  }
  export interface SubscriptionMetadata {
    myKey: string
  }
}
```

## Testing

```shell
bun test
```

## License

MIT
