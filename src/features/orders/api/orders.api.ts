import { fetchCollectionWithSeed, upsertCollectionDocument } from '@/shared/firebase';
import { studentOrderListSchema, studentOrderSchema } from './orders.schema';
import type { OrderExchangeStatus, StudentOrder } from './orders.types';

export const SEED_STUDENT_ORDERS: readonly StudentOrder[] = [
  {
    id: 'ord-1042',
    itemTitle: 'Stagg Pour-Over Electric Kettle (ONYX · 0.9L)',
    totalAmount: 85,
    sellerName: 'Zoe (Final Year Chem)',
    meetupSpot: 'Westgate Student Village Courtyard',
    status: 'scheduled-pickup',
    pickupCode: 'UC-8492',
    orderedAt: '2026-11-08T08:00:00.000Z',
  },
  {
    id: 'ord-1038',
    itemTitle: 'Carryall Day Pack (OLIVE · 24L)',
    totalAmount: 96,
    sellerName: 'Liam (Final Year Bio)',
    meetupSpot: 'Oakwood Village Reception',
    status: 'completed',
    pickupCode: 'UC-3109',
    orderedAt: '2026-11-02T15:10:00.000Z',
  },
];

export async function fetchStudentOrders(): Promise<StudentOrder[]> {
  return fetchCollectionWithSeed(
    'orders',
    studentOrderSchema,
    studentOrderListSchema,
    SEED_STUDENT_ORDERS,
  );
}

export async function createStudentOrder(order: StudentOrder): Promise<StudentOrder> {
  return upsertCollectionDocument(
    'orders',
    order,
    studentOrderSchema,
    studentOrderListSchema,
    SEED_STUDENT_ORDERS,
  );
}

export async function updateStudentOrderStatus(
  order: StudentOrder,
  status: OrderExchangeStatus,
): Promise<StudentOrder> {
  return upsertCollectionDocument(
    'orders',
    { ...order, status },
    studentOrderSchema,
    studentOrderListSchema,
    SEED_STUDENT_ORDERS,
  );
}
