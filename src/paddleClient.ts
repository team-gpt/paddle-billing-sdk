import axios, { AxiosInstance } from 'axios'

import { CustomerEndpoint } from './endpoints/CustomerEndpoint'
import { PricesEndpoint } from './endpoints/PricesEndpoint'
import { ProductEndpoint } from './endpoints/ProductEndpoint'
import { SubscriptionEndpoint } from './endpoints/SubscriptionEndpoint'
import { TransactionEndpoint } from './endpoints/TransactionEndpoint'

type PaddleClientConfig = {
  sandbox: boolean
  authToken: string
  vendorId: number
}

export class PaddleClient {
  config: PaddleClientConfig
  client: AxiosInstance

  prices: PricesEndpoint
  products: ProductEndpoint
  customers: CustomerEndpoint
  transactions: TransactionEndpoint
  subscriptions: SubscriptionEndpoint

  constructor(config: PaddleClientConfig) {
    this.config = config
    const baseURL = config.sandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com'
    this.client = axios.create({
      baseURL,
      adapter: 'http',
      headers: {
        Authorization: `Bearer ${config.authToken}`,
      },
    })

    // Initialize endpoints with axios instance
    this.prices = new PricesEndpoint(this)
    this.products = new ProductEndpoint(this)
    this.customers = new CustomerEndpoint(this)
    this.transactions = new TransactionEndpoint(this)
    this.subscriptions = new SubscriptionEndpoint(this)
  }
}
