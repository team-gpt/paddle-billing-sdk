import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'
import { BaseQueryParams, BaseResponse, CountryCode, CurrencyCode, Interval, Period } from './base'

export interface TransactionMetadata {
  [key: string]: boolean | number | string
}

type TransactionStatus =
  | 'draft'
  | 'ready'
  | 'billed'
  | 'paid'
  | 'completed'
  | 'canceled'
  | 'past_due'
type CollectionMode = 'automatic' | 'manual'

type CheckoutUrl = {
  url: string | null
}

type TransactionItem = {
  price_id: string
  quantity: number
}

type Address = {
  postal_code?: string
  country_code: CountryCode
}

type BillingDetails = {
  enable_checkout: boolean
  purchase_order_number?: string
  additional_information?: string
  payment_terms?: {
    net_days: number // Example: 30 for Net 30 payment terms
  }
}

// From the Transactions Overview page
type Transaction = {
  id: string
  status: TransactionStatus
  created_at: string // RFC 3339 datetime string
  customer_id: string | null
  address_id: string | null
  business_id: string | null
  currency_code: CurrencyCode
  discount_id: string | null
  custom_data: object | null
  items: TransactionItem[]
  billing_details: BillingDetails | null
  collection_mode: CollectionMode
  enable_checkout: boolean
  purchase_order_number: string
  additional_information: string
  payment_terms: Interval
  billing_period: Period | null
  checkout: CheckoutUrl | null
  // Included
  address?: object
  adjustment?: object
  adjustments_totals?: object
  business?: object
  customer?: object
  discount?: object
}

type ListTransactionsQueryParams = BaseQueryParams & {
  status?: TransactionStatus[]
  customer_id?: string[] | null
  address_id?: string[] | null
  business_id?: string[] | null
  currency_code?: CurrencyCode[] | null
  discount_id?: string[] | null
}

type CreateTransactionInclude =
  | 'address'
  | 'adjustment'
  | 'adjustments_totals'
  | 'business'
  | 'customer'
  | 'discount'

type TransactionIncludeQueryParams = {
  include: CreateTransactionInclude | CreateTransactionInclude[]
}
type CreateTransactionRequestBody = {
  items: TransactionItem[]
  price_id: string
  quantity: number
  status?: TransactionStatus
  customer_id?: string | null
  address_id?: string | null
  business_id?: string | null
  custom_data?: object | null
  currency_code?: CurrencyCode
  collection_mode?: CollectionMode
  discount_id?: string | null
  billing_details?: BillingDetails | null
  checkout?: CheckoutUrl | null
}

type UpdateTransactionRequestBody = {
  status?: 'billed' | 'canceled'
  customer_id?: string | null
  address_id?: string | null
  business_id?: string | null
  custom_data?: TransactionMetadata | null
  currency_code?: CurrencyCode
  collection_mode?: CollectionMode
  discount_id?: string | null
  billing_details?: BillingDetails | null
  enable_checkout?: boolean
  purchase_order_number?: string
  additional_information?: string
  payment_terms?: object
  billing_period?: Period | null
  items?: TransactionItem[]
  price_id?: string
  quantity?: number
  checkout?: CheckoutUrl | null
}

type PreviewTransactionRequestBody = {
  items: TransactionItem[]
  price_id?: string
  quantity: number
  include_in_totals?: boolean
  customer_id?: string | null
  address_id?: string | null
  business_id?: string | null
  currency_code?: CurrencyCode
  discount_id?: string | null
  customer_ip_address?: string | null
  address?: Address | null
  postal_code?: string | null
  country_code?: CountryCode
  ignore_trials?: boolean
}

type PreviewTransactionResponseData = {
  customer_id: string | null
  address_id: string | null
  business_id: string | null
  currency_code: CurrencyCode
  discount_id: string | null
  customer_ip_address: string | null
  address: Address | null
}

type GetInvoicePDFResponseData = {
  url: string
}

export class TransactionEndpoint {
  private client: AxiosInstance

  constructor(paddleClient: PaddleClient) {
    this.client = paddleClient.client
  }

  async listTransactions(
    queryParams?: ListTransactionsQueryParams,
  ): Promise<BaseResponse<Transaction[]>> {
    const response = await this.client.get<BaseResponse<Transaction[]>>('/transactions', {
      params: queryParams,
    })
    return response.data
  }

  async createTransaction(
    transaction: CreateTransactionRequestBody,
    queryParams?: TransactionIncludeQueryParams,
  ): Promise<BaseResponse<Transaction>> {
    const response = await this.client.post<BaseResponse<Transaction>>(
      '/transactions',
      transaction,
      { params: queryParams },
    )
    return response.data
  }

  async getTransaction(
    transactionId: string,
    queryParams?: TransactionIncludeQueryParams,
  ): Promise<BaseResponse<Transaction>> {
    const response = await this.client.get<BaseResponse<Transaction>>(
      `/transactions/${transactionId}`,
      { params: queryParams },
    )
    return response.data
  }

  async updateTransaction(
    transactionId: string,
    updates: UpdateTransactionRequestBody,
  ): Promise<BaseResponse<Transaction>> {
    const response = await this.client.patch<BaseResponse<Transaction>>(
      `/transactions/${transactionId}`,
      updates,
    )
    return response.data
  }

  async previewTransaction(
    previewBody: PreviewTransactionRequestBody,
  ): Promise<BaseResponse<PreviewTransactionResponseData>> {
    const response = await this.client.post<BaseResponse<PreviewTransactionResponseData>>(
      '/transactions/preview',
      previewBody,
    )
    return response.data
  }

  async getInvoicePDF(transactionId: string): Promise<BaseResponse<GetInvoicePDFResponseData>> {
    const response = await this.client.get<BaseResponse<GetInvoicePDFResponseData>>(
      `/transactions/${transactionId}/invoice`,
    )
    return response.data
  }
}
