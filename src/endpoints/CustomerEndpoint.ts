import { AxiosInstance } from 'axios'

import { PaddleClient } from '../paddleClient'
import { BaseQueryParams, BaseResponse } from './base'

export interface CustomerMetadata {
  [key: string]: boolean | number | string
}

type CustomerStatus = 'active' | 'archived'

export type Customer = {
  id: string
  name: string | null
  email: string
  marketing_consent: boolean
  status: CustomerStatus
  custom_data: CustomerMetadata | null
  locale: string
  created_at: string
  updated_at: string
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

type CustomerCreditBalancesResponse = BaseResponse<CustomerCreditBalance[]>

type CustomerResponse = BaseResponse<Customer>
type CustomersResponse = BaseResponse<Customer[]>

type ListCustomersQueryParams = BaseQueryParams & {
  id?: string
  search?: string
  status?: CustomerStatus
}

export class CustomerEndpoint {
  private client: AxiosInstance

  constructor(paddleClient: PaddleClient) {
    this.client = paddleClient.client
  }

  async listCustomers(queryParams?: ListCustomersQueryParams): Promise<CustomersResponse> {
    const response = await this.client.get<CustomersResponse>('/customers', {
      params: queryParams,
    })
    return response.data
  }

  async createCustomer(customer: CreateCustomerRequestBody): Promise<CustomerResponse> {
    const response = await this.client.post<CustomerResponse>('/customers', customer)
    return response.data
  }

  async getCustomer(customerId: string): Promise<CustomerResponse> {
    const response = await this.client.get<CustomerResponse>(`/customers/${customerId}`)
    return response.data
  }

  async updateCustomer(
    customerId: string,
    updates: UpdateCustomerRequestBody,
  ): Promise<CustomerResponse> {
    const response = await this.client.patch<CustomerResponse>(`/customers/${customerId}`, updates)
    return response.data
  }

  async getCreditBalances(customerId: string): Promise<CustomerCreditBalancesResponse> {
    const response = await this.client.get<CustomerCreditBalancesResponse>(
      `/customers/${customerId}/credit-balances`,
    )
    return response.data
  }
}
