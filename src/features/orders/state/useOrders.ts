import { useCallback, useEffect } from 'react';
import { useAsyncState, type AsyncStatus } from '@/shared/hooks/useAsyncState';
import { fetchStudentOrders, updateStudentOrderStatus } from '../api/orders.api';
import type { OrderExchangeStatus, StudentOrder } from '../api/orders.types';

export function useOrders() {
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<StudentOrder[]>(
    [],
    'loading',
  );

  const loadOrders = useCallback(async () => {
    setLoading();
    try {
      const orders = await fetchStudentOrders();
      if (orders.length === 0) {
        setEmpty();
      } else {
        setSuccess(orders);
      }
    } catch (err: unknown) {
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const changeOrderStatus = useCallback(
    async (order: StudentOrder, nextStatus: OrderExchangeStatus) => {
      try {
        const updated = await updateStudentOrderStatus(order, nextStatus);
        const list = (state.data ?? []).map((o) => (o.id === updated.id ? updated : o));
        setSuccess(list);
      } catch (err: unknown) {
        setError(err);
      }
    },
    [setError, setSuccess, state.data],
  );

  const simulateStatus = useCallback(
    (status: AsyncStatus) => {
      if (status === 'loading') {
        setLoading();
      } else if (status === 'empty') {
        setEmpty();
      } else if (status === 'error') {
        setError(new Error('Simulated orders fetch error'));
      } else {
        void loadOrders();
      }
    },
    [loadOrders, setEmpty, setError, setLoading],
  );

  return {
    status: state.status,
    orders: state.data ?? [],
    error: state.error,
    changeOrderStatus,
    reload: loadOrders,
    simulateStatus,
  };
}
