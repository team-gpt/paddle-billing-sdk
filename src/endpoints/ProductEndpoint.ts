import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'
import { Price } from './PricesEndpoint'
import { BaseQueryParams, BaseResponse } from './base'

export interface ProductMetadata {
  [key: string]: boolean | number | string
}

type ProductStatus = 'active' | 'archived'

type TaxCategory =
  | 'digital-goods'
  | 'ebooks'
  | 'implementation-services'
  | 'professional-services'
  | 'saas'
  | 'software-programming-services'
  | 'standard'
  | 'training-services'
  | 'website-hosting'

type ListProductsQueryParams = BaseQueryParams & {
  id?: string
  include?: 'prices'
  status?: ProductStatus
  tax_category?: TaxCategory
}

type Product = {
  id: string
  name: string
  tax_category: string
  description: string
  image_url: string
  custom_data: ProductMetadata | null
  status: ProductStatus
  created_at: string
  // with include=prices
  prices?: Price[]
}

type CreateProductRequestBody = Omit<Product, 'id' | 'status' | 'created_at'>
type UpdateProductRequestBody = Partial<Omit<Product, 'id' | 'created_at'>>

export type ProductResponse = BaseResponse<Product[]>

export class ProductEndpoint {
  private client: AxiosInstance

  constructor(paddleClient: PaddleClient) {
    this.client = paddleClient.client
  }

  async listProducts(queryParams?: ListProductsQueryParams): Promise<ProductResponse> {
    const response = await this.client.get<ProductResponse>('/products', {
      params: queryParams,
    })
    return response.data
  }

  async createProduct(product: CreateProductRequestBody): Promise<ProductResponse> {
    const response = await this.client.post<ProductResponse>('/products', product)
    return response.data
  }

  async getProduct(productId: string): Promise<ProductResponse> {
    const response = await this.client.get<ProductResponse>(`/products/${productId}`)
    return response.data
  }

  async updateProduct(
    productId: string,
    updates: UpdateProductRequestBody,
  ): Promise<ProductResponse> {
    const response = await this.client.patch<ProductResponse>(`/products/${productId}`, updates)
    return response.data
  }
}
