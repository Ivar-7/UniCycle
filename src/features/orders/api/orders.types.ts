export type OrderExchangeStatus = 'scheduled-pickup' | 'completed' | 'cancelled';

export interface StudentOrder {
  readonly id: string;
  readonly itemTitle: string;
  readonly totalAmount: number;
  readonly sellerName: string;
  readonly meetupSpot: string;
  readonly status: OrderExchangeStatus;
  readonly pickupCode: string;
  readonly orderedAt: string;
}
