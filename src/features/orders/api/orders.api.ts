import { fetchUserCollection, upsertUserDocument } from '@/shared/firebase';
import { studentOrderSchema } from './orders.schema';
import type { OrderExchangeStatus, StudentOrder } from './orders.types';

export async function fetchStudentOrders(buyerId: string): Promise<StudentOrder[]> {
  return fetchUserCollection('orders', studentOrderSchema, {
    filterField: 'buyerId',
    filterOp: '==',
    userId: buyerId,
    orderByField: 'orderedAt',
  });
}

export interface ReservePickupInput {
  readonly buyerId: string;
  readonly sellerId?: string;
  readonly itemTitle: string;
  readonly totalAmount: number;
  readonly sellerName: string;
  readonly meetupSpot: string;
}

export async function createStudentOrder(order: StudentOrder): Promise<StudentOrder> {
  return upsertUserDocument('orders', order.id, order, studentOrderSchema);
}

export async function reservePickupOrder(input: ReservePickupInput): Promise<StudentOrder> {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return createStudentOrder({
    id: `ord-${Date.now().toString().slice(-6)}-${suffix}`,
    buyerId: input.buyerId,
    ...(input.sellerId ? { sellerId: input.sellerId } : {}),
    itemTitle: input.itemTitle,
    totalAmount: input.totalAmount,
    sellerName: input.sellerName,
    meetupSpot: input.meetupSpot,
    status: 'scheduled-pickup',
    pickupCode: `UC-${Math.floor(1000 + Math.random() * 9000)}`,
    orderedAt: new Date().toISOString(),
  });
}

export async function updateStudentOrderStatus(
  order: StudentOrder,
  status: OrderExchangeStatus,
): Promise<StudentOrder> {
  return upsertUserDocument('orders', order.id, { ...order, status }, studentOrderSchema);
}
