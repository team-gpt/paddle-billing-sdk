import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'
import { Price } from './PricingEndpoint'

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

type ListProductsQueryParams = {
  after?: string
  id?: string
  include?: 'prices'
  order_by?: string
  per_page?: number
  status?: ProductStatus
  tax_category?: TaxCategory
}

type Features = {
  reports: boolean
  crm: boolean
  data_retention: boolean
}

type ProductCustomData = {
  features: Features
}

type Product = {
  id: string
  name: string
  tax_category: string
  description: string
  image_url: string
  custom_data: ProductCustomData | null
  status: string
  created_at: string
  prices?: Price[]
}

type CreateProductRequestBody = Omit<Product, 'id' | 'status' | 'created_at'>
type UpdateProductRequestBody = Partial<Omit<Product, 'id' | 'created_at'>>

interface ProductResponse {
  data: Product[]
  meta: {
    request_id: string
  }
}

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
