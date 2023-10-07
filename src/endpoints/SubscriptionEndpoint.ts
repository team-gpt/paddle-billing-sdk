import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'
import { Price } from './PricesEndpoint'
import { BaseQueryParams, BaseResponse } from './base'

export interface SubscriptionMetadata {
  [key: string]: boolean | number | string
}

type Discount = {
  id: string
  starts_at: string
  ends_at: string
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
  starts_at: string
  ends_at: string
}

type Cycling = {
  interval: string
  frequency: number
}

type ScheduledChange = {
  action: 'cancel' | 'pause' | 'resume'
  effective_at: string
  resume_at: string | null
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
  created_at: string
  updated_at: string
  previously_billed_at: string | null
  next_billed_at: string | null
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
  created_at: string
  updated_at: string
  started_at: string | null
  first_billed_at: string | null
  next_billed_at: string | null
  paused_at: string | null
  canceled_at: string | null
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

type SubscriptionResponse = BaseResponse<Subscription>
type SubscriptionsResponse = BaseResponse<Subscription[]>

type ListSubscriptionsQueryParams = BaseQueryParams & {
  customer_id?: string
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
  ): Promise<SubscriptionsResponse> {
    const response = await this.client.get<SubscriptionsResponse>('/subscriptions', {
      params: queryParams,
    })
    return response.data
  }

  async createSubscription(
    subscription: CreateSubscriptionRequestBody,
  ): Promise<SubscriptionResponse> {
    const response = await this.client.post<SubscriptionResponse>('/subscriptions', subscription)
    return response.data
  }

  async getSubscription(
    subscriptionId: string,
    queryParams?: GetSubscriptionQueryParams,
  ): Promise<SubscriptionResponse> {
    const response = await this.client.get<SubscriptionResponse>(
      `/subscriptions/${subscriptionId}`,
      { params: queryParams },
    )
    return response.data
  }

  async updateSubscription(
    subscriptionId: string,
    updates: UpdateSubscriptionRequestBody,
  ): Promise<SubscriptionResponse> {
    const response = await this.client.patch<SubscriptionResponse>(
      `/subscriptions/${subscriptionId}`,
      updates,
    )
    return response.data
  }
}
