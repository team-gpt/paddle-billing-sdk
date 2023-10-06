import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'

export interface CustomerMetadata {
  [key: string]: boolean | number | string
}

export type Customer = {
  id: string
  name: string | null
  email: string
  marketing_consent: boolean
  status: 'active' | 'archived'
  custom_data: CustomerMetadata | null
  locale: string
  created_at: Date
  updated_at: Date
}

type CreateCustomerRequestBody = Pick<Customer, 'email'> &
  Partial<Pick<Customer, 'name' | 'custom_data' | 'locale'>>

type UpdateCustomerRequestBody = Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>

type CreditBalance = {
  available: string
  reserved: string
  used: string
}

type CustomerCreditBalance = {
  customer_id: string
  currency_code: string
  balance: CreditBalance
}

type CustomerCreditBalancesResponse = {
  data: CustomerCreditBalance[]
  meta: {
    request_id: string
  }
}

type SingleCustomerResponse = {
  data: Customer
  meta: {
    request_id: string
  }
}

type CustomerResponse = {
  data: Customer[]
  meta: {
    request_id: string
  }
}

type ListCustomersQueryParams = {
  after?: string
  id?: string
  order_by?: string
  per_page?: number
  search?: string
  status?: 'active' | 'archived'
}

export class CustomerEndpoint {
  private client: AxiosInstance

  constructor(paddleClient: PaddleClient) {
    this.client = paddleClient.client
  }

  async listCustomers(queryParams?: ListCustomersQueryParams): Promise<CustomerResponse> {
    const response = await this.client.get<CustomerResponse>('/customers', {
      params: queryParams,
    })
    return response.data
  }

  async createCustomer(customer: CreateCustomerRequestBody): Promise<SingleCustomerResponse> {
    const response = await this.client.post<SingleCustomerResponse>('/customers', customer)
    return response.data
  }

  async getCustomer(customerId: string): Promise<SingleCustomerResponse> {
    const response = await this.client.get<SingleCustomerResponse>(`/customers/${customerId}`)
    return response.data
  }

  async updateCustomer(
    customerId: string,
    updates: UpdateCustomerRequestBody,
  ): Promise<SingleCustomerResponse> {
    const response = await this.client.patch<SingleCustomerResponse>(
      `/customers/${customerId}`,
      updates,
    )
    return response.data
  }

  async getCreditBalances(customerId: string): Promise<CustomerCreditBalancesResponse> {
    const response = await this.client.get<CustomerCreditBalancesResponse>(
      `/customers/${customerId}/credit-balances`,
    )
    return response.data
  }
}
