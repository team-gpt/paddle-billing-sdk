import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'
import {
  AdjustedTotals,
  BaseQueryParams,
  BaseResponse,
  CountryCode,
  CurrencyCode,
  Interval,
  MaybeArray,
  Period,
  prepareQuery,
  Proration,
  TaxRate,
  Totals,
} from './base'
import { Price } from './PricesEndpoint'

export interface TransactionMetadata {
  [key: string]: boolean | number | string
}

type CollectionMode = 'automatic' | 'manual'
type TransactionStatus =
  | 'draft'
  | 'ready'
  | 'billed'
  | 'paid'
  | 'completed'
  | 'canceled'
  | 'past_due'

type CheckoutUrl = {
  url: string | null
}

type TransactionItem = {
  price_id: string
  quantity: number
  price?: Price
  include_in_totals?: boolean
  proration?: Proration | null
}
type TransactionItemExpanded = {
  quantity: number
  price: Price
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
  created_at: string
  updated_at?: string
  billed_at?: string
  customer_id: string | null
  address_id: string | null
  business_id: string | null
  currency_code: CurrencyCode
  discount_id: string | null
  custom_data?: TransactionMetadata
  invoice_id?: string
  invoice_number?: string
  items: TransactionItemExpanded[]
  billing_details: BillingDetails | null
  collection_mode: CollectionMode
  enable_checkout: boolean
  purchase_order_number: string
  additional_information: string
  payment_terms: Interval
  billing_period: Period | null
  checkout: CheckoutUrl | null
  details?: {
    tax_rates_used: TaxRate[]
    totals: Totals
    adjusted_totals: AdjustedTotals
    payout_totals: Totals
    adjusted_payout_totals: AdjustedTotals
  }
  line_items?: [] // TODO: add line items
  payments?: [] // TODO: add payments
  // Included
  address?: object
  adjustment?: object
  adjustments_totals?: object
  business?: object
  customer?: object
  discount?: object
}

type TransactionInclude =
  | 'address'
  | 'adjustment'
  | 'adjustments_totals'
  | 'business'
  | 'customer'
  | 'discount'

type ListTransactionsQueryParams = BaseQueryParams & {
  billed_at?: string
  collection_mode?: CollectionMode
  created_at?: string
  customer_id?: MaybeArray<string>
  id?: MaybeArray<string>
  include?: MaybeArray<TransactionInclude>
  invoice_number?: MaybeArray<string>
  status?: MaybeArray<TransactionStatus>
  subscription_id?: MaybeArray<string>
  updated_at?: string
}

type TransactionIncludeQueryParams = {
  include: MaybeArray<TransactionInclude>
}
type CreateTransactionRequestBody = {
  items: Pick<TransactionItem, 'price_id' | 'quantity'>[]
  price_id: string
  quantity: number
  status?: TransactionStatus
  customer_id?: string
  address_id?: string
  business_id?: string
  custom_data?: TransactionMetadata
  currency_code?: CurrencyCode
  collection_mode?: CollectionMode
  discount_id?: string
  billing_details?: BillingDetails
  checkout?: CheckoutUrl
}

type UpdateTransactionRequestBody = {
  status?: 'billed' | 'canceled'
  customer_id?: string
  address_id?: string
  business_id?: string
  custom_data?: TransactionMetadata
  currency_code?: CurrencyCode
  collection_mode?: CollectionMode
  discount_id?: string
  billing_details?: BillingDetails
  enable_checkout?: boolean
  purchase_order_number?: string
  additional_information?: string
  payment_terms?: object
  billing_period?: Period
  items?: TransactionItem[]
  price_id?: string
  quantity?: number
  checkout?: CheckoutUrl
}

type PreviewTransactionRequestBody = {
  items: TransactionItem[]
  price_id?: string
  quantity: number
  include_in_totals?: boolean
  customer_id?: string
  address_id?: string
  business_id?: string
  currency_code?: CurrencyCode
  discount_id?: string
  customer_ip_address?: string
  address?: Address
  postal_code?: string
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

type InvoiceResponseData = {
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
      params: prepareQuery(queryParams),
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
      { params: prepareQuery(queryParams) },
    )
    return response.data
  }

  async getTransaction(
    transactionId: string,
    queryParams?: TransactionIncludeQueryParams,
  ): Promise<BaseResponse<Transaction>> {
    const response = await this.client.get<BaseResponse<Transaction>>(
      `/transactions/${transactionId}`,
      { params: prepareQuery(queryParams) },
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

  async getInvoicePDF(transactionId: string): Promise<BaseResponse<InvoiceResponseData>> {
    const response = await this.client.get<BaseResponse<InvoiceResponseData>>(
      `/transactions/${transactionId}/invoice`,
    )
    return response.data
  }
}
