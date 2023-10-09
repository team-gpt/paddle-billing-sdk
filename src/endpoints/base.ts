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

export type MaybeArray<T> = T | T[]

/**
 * ISO 3166-1 alpha-2 country code
 */
export type CountryCode = string
export type CurrencyCode = 'USD' | 'EUR' | 'GBP'

export type Period = {
  starts_at: string // RFC 3339 datetime string
  ends_at: string // RFC 3339 datetime string
}
export type Interval = {
  interval: string
  frequency: number
}

export type Proration = {
  rate: string
  billing_period: Period
}

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

export const stringifyQuery = (param: string | string[]): string => {
  return Array.isArray(param) ? param.join(',') : param
}
