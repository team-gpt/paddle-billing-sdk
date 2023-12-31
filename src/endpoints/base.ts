export type BaseQueryParams = {
  after?: string
  order_by?: string
  per_page?: number
}

export type BaseResponse<T> = {
  data: T
  meta: {
    request_id: string
    pagination?: Pagination
  }
}

/**
 * ISO 3166-1 alpha-2 country code
 */
export type CountryCode = string

/**
 * ISO 4217 currency code
 */
export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'AUD'
  | 'CAD'
  | 'CHF'
  | 'HKD'
  | 'SGD'
  | 'SEK'
  | 'ARS'
  | 'BRL'
  | 'CNY'
  | 'COP'
  | 'CZK'
  | 'DKK'
  | 'HUF'
  | 'ILS'
  | 'INR'
  | 'KRW'
  | 'MXN'
  | 'NOK'
  | 'NZD'
  | 'PLN'
  | 'RUB'
  | 'THB'
  | 'TRY'
  | 'TWD'
  | 'UAH'
  | 'ZAR'
  | (string & {})

export type Period = {
  starts_at: string // RFC 3339 datetime string
  ends_at: string // RFC 3339 datetime string
}
export type Interval = {
  interval: 'day' | 'week' | 'month' | 'year'
  frequency: number
}
export type CollectionMode = 'automatic' | 'manual'
export type Proration = {
  rate: string
  billing_period: Period
}

export type Totals = {
  subtotal: string
  discount: string
  tax: string
  total: string
  grand_total: string
  fee: string | null
  credit: string
  balance: string
  earnings: string | null
  currency_code: CurrencyCode
}

export type Discount = {
  id: string
  starts_at: string
  ends_at: string
}

export type BillingDetails = {
  enable_checkout: boolean
  purchase_order_number?: string
  additional_information?: string
  payment_terms?: Interval
}

export type TaxRate = {
  tax_rate: string
  totals: Pick<Totals, 'discount' | 'subtotal' | 'tax' | 'total'>
}
export type AdjustedTotals = Pick<
  Totals,
  'subtotal' | 'tax' | 'total' | 'grand_total' | 'fee' | 'earnings' | 'currency_code'
>

export type Pagination = {
  /**
   * Number of entities per page for this response.
   */
  per_page: number
  /**
   * URL for the next page, including query parameters of the original request and the 'after' parameter.
   */
  next: string
  /**
   * Indicates whether there is another page.
   */
  has_more: boolean
  /**
   * Estimated number of entities for this response.
   */
  estimated_total: number
}

export type MaybeArray<T> = T | T[]

export const stringifyQuery = <T extends string | number | boolean>(
  param: MaybeArray<T>,
): string => {
  return Array.isArray(param) ? param.join(',') : param.toString()
}

export const prepareQuery = (params?: {
  [key: string]: MaybeArray<string | number | boolean> | undefined
}): Record<string, string> | undefined => {
  if (!params) return undefined
  return Object.entries(params).reduce((acc: { [key: string]: string }, [key, value]) => {
    switch (typeof value) {
      case 'boolean':
        acc[key] = value ? 'true' : 'false'
        break
      case 'number':
        acc[key] = value.toString()
        break
      case 'object': // Array
        acc[key] = stringifyQuery(value)
        break
      case 'undefined':
        // Skip
        break
      case 'string':
      default:
        acc[key] = value
    }
    return acc
  }, {})
}
