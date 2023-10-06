import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'
import { Price } from './PricingEndpoint'

export interface SubscriptionMetadata {
  [key: string]: boolean | number | string
}

type Discount = {
  id: string
  starts_at: Date
  ends_at: Date
}

type BillingDetails = {
  enable_checkout: boolean
  purchase_order_number: string
  additional_information: string
}

type PaymentTerms = {
  interval: string
  frequency: number
}

type Period = {
  starts_at: Date
  ends_at: Date
}

type Cycling = {
  interval: string
  frequency: number
}

type ScheduledChange = {
  action: 'cancel' | 'pause' | 'resume'
  effective_at: Date
  resume_at: Date | null
}

type ManagementURLs = {
  update_payment_method: string | null
  cancel: string
}

type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing'

type SubscriptionItem = {
  status: SubscriptionStatus
  quantity: number
  recurring: boolean
  created_at: Date
  updated_at: Date
  previously_billed_at: Date | null
  next_billed_at: Date | null
  trial_dates: Period | null
  price: Price
  custom_data?: SubscriptionMetadata
}

export type Subscription = {
  id: string
  status: SubscriptionStatus
  customer_id: string
  address_id: string
  business_id: string | null
  currency_code: string
  created_at: Date
  updated_at: Date
  started_at: Date | null
  first_billed_at: Date | null
  next_billed_at: Date | null
  paused_at: Date | null
  canceled_at: Date | null
  discount: Discount | null
  collection_mode: string
  billing_details: BillingDetails | null
  payment_terms: PaymentTerms
  current_billing_period: Period | null
  billing_cycle: Cycling
  scheduled_change: ScheduledChange | null
  management_urls: ManagementURLs
  items: SubscriptionItem[]
  custom_data?: SubscriptionMetadata
}

type ProrationBillingMode =
  // Prorated amount is calculated now. Customer is billed the prorated amount now.
  | 'prorated_immediately'
  // Prorated amount is calculated now. Customer is billed the prorated amount on their next renewal.
  | 'prorated_next_billing_period'
  // Prorated amount is not calculated. Customer is billed the full amount now.
  | 'full_immediately'
  // Prorated amount is not calculated. Customer is billed for the full amount on their next renewal.
  | 'full_next_billing_period'
  // Prorated amount is not calculated. Customer is not billed for the prorated amount or the full amount.
  | 'do_not_bill'

type CreateSubscriptionRequestBody = Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
type UpdateSubscriptionRequestBody = Partial<
  Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
> & {
  proration_billing_mode: ProrationBillingMode
}

type SingleSubscriptionResponse = {
  data: Subscription
  meta: {
    request_id: string
  }
}
type SubscriptionResponse = {
  data: Subscription[]
  meta: {
    request_id: string
  }
}

type ListSubscriptionsQueryParams = {
  after?: string
  customer_id?: string
  order_by?: string
  per_page?: number
  price_id?: string
  status?: SubscriptionStatus
}

type GetSubscriptionQueryParams = {
  include?: 'next_transaction' | 'recurring_transaction_details'
}

export class SubscriptionEndpoint {
  private client: AxiosInstance

  constructor(paddleClient: PaddleClient) {
    this.client = paddleClient.client
  }

  async listSubscriptions(
    queryParams?: ListSubscriptionsQueryParams,
  ): Promise<SubscriptionResponse> {
    const response = await this.client.get<SubscriptionResponse>('/subscriptions', {
      params: queryParams,
    })
    return response.data
  }

  async createSubscription(
    subscription: CreateSubscriptionRequestBody,
  ): Promise<SingleSubscriptionResponse> {
    const response = await this.client.post<SingleSubscriptionResponse>(
      '/subscriptions',
      subscription,
    )
    return response.data
  }

  async getSubscription(
    subscriptionId: string,
    queryParams?: GetSubscriptionQueryParams,
  ): Promise<SingleSubscriptionResponse> {
    const response = await this.client.get<SingleSubscriptionResponse>(
      `/subscriptions/${subscriptionId}`,
      { params: queryParams },
    )
    return response.data
  }

  async updateSubscription(
    subscriptionId: string,
    updates: UpdateSubscriptionRequestBody,
  ): Promise<SingleSubscriptionResponse> {
    const response = await this.client.patch<SingleSubscriptionResponse>(
      `/subscriptions/${subscriptionId}`,
      updates,
    )
    return response.data
  }
}
