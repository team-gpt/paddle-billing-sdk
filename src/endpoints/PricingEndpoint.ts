import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'

type PriceStatus = 'active' | 'archived'

type ListPricesQueryParams = {
  after?: string
  id?: string
  include?: 'product'
  order_by?: string
  per_page?: number
  product_id?: string | string[]
  status?: PriceStatus
  recurring?: boolean
}

type BillingCycle = {
  interval: string
  frequency: number
}

type TrialPeriod = {
  interval: string
  frequency: number
}

type UnitPrice = {
  amount: string
  currency_code: string
}

type UnitPriceOverride = {
  country_codes: string[]
  unit_price: UnitPrice
}

type Quantity = {
  minimum: number
  maximum: number
}

export type Price = {
  id: string
  product_id: string
  description: string
  billing_cycle: BillingCycle | null
  trial_period: TrialPeriod | null
  tax_mode: string
  unit_price: UnitPrice
  unit_price_overrides: UnitPriceOverride[]
  quantity: Quantity
  status: 'active' | 'archived'
  custom_data: Record<string, unknown> | null
}

type PriceResponse = {
  data: Price[]
  meta: {
    request_id: string
  }
}

export class PricingEndpoint {
  private client: AxiosInstance

  constructor(paddleClient: PaddleClient) {
    this.client = paddleClient.client
  }

  async listPrices(queryParams?: ListPricesQueryParams): Promise<PriceResponse> {
    const response = await this.client.get<PriceResponse>('/prices', {
      params: {
        ...queryParams,
        ...(queryParams?.product_id && {
          product_id: Array.isArray(queryParams.product_id)
            ? queryParams.product_id.join(',')
            : queryParams.product_id,
        }),
      },
    })
    return response.data
  }

  // Assuming we're creating a price with all its attributes
  async createPrice(price: Price): Promise<PriceResponse> {
    const response = await this.client.post<PriceResponse>('/prices', price)
    return response.data
  }

  async getPrice(priceId: string): Promise<PriceResponse> {
    const response = await this.client.get<PriceResponse>(`/prices/${priceId}`)
    return response.data
  }

  // Assuming we can update a price with any of its attributes
  async updatePrice(priceId: string, updates: Partial<Price>): Promise<PriceResponse> {
    const response = await this.client.patch<PriceResponse>(`/prices/${priceId}`, updates)
    return response.data
  }
}
