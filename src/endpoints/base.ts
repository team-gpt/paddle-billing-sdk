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
