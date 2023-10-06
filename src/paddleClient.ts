import axios, { AxiosInstance } from 'axios'

import { CustomerEndpoint } from './endpoints/CustomerEndpoint'
import { PricingEndpoint } from './endpoints/PricingEndpoint'
import { ProductEndpoint } from './endpoints/ProductEndpoint'
import { SubscriptionEndpoint } from './endpoints/SubscriptionEndpoint'

type PaddleClientConfig = {
  sandbox: boolean
  authToken: string
  vendorId: number
}

export class PaddleClient {
  config: PaddleClientConfig
  client: AxiosInstance

  products: ProductEndpoint
  prices: PricingEndpoint
  customers: CustomerEndpoint
  subscriptions: SubscriptionEndpoint

  constructor(config: PaddleClientConfig) {
    this.config = config
    const baseURL = config.sandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com'
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${config.authToken}`,
      },
    })

    // Initialize endpoints with axios instance
    this.products = new ProductEndpoint(this)
    this.prices = new PricingEndpoint(this)
    this.customers = new CustomerEndpoint(this)
    this.subscriptions = new SubscriptionEndpoint(this)
  }
}
