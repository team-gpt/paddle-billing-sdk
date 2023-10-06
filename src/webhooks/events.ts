import { Customer } from '../endpoints/CustomerEndpoint'
import { Subscription } from '../endpoints/SubscriptionEndpoint'

type Webhook<EvtType, Data> = {
  data: Data
  event_id: string
  event_type: EvtType
  occurred_at: Date
  notification_id: string
}

export type CustomerWebhookEvent = Webhook<'customer.created' | 'customer.updated', Customer>
export type SubscriptionWebhookEvent = Webhook<
  | 'subscription.activated'
  | 'subscription.canceled'
  | 'subscription.created'
  | 'subscription.imported'
  | 'subscription.past_due'
  | 'subscription.paused'
  | 'subscription.resumed'
  | 'subscription.trialing'
  | 'subscription.updated',
  Subscription
>
export type WebhookEvent = CustomerWebhookEvent | SubscriptionWebhookEvent
