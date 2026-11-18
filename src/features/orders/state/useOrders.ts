import { useCallback, useEffect, useState } from 'react';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import { useAuth } from '@/shared/hooks/useAuth';
import { fetchStudentOrders, updateStudentOrderStatus } from '../api/orders.api';
import type { OrderExchangeStatus, StudentOrder } from '../api/orders.types';

export function useOrders() {
  const { user, isLoading: authLoading } = useAuth();
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<StudentOrder[]>(
    [],
    'loading',
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user) {
      setEmpty();
      return;
    }
    setLoading();
    try {
      const orders = await fetchStudentOrders(user.uid);
      if (orders.length === 0) {
        setEmpty();
      } else {
        setSuccess(orders);
      }
    } catch (err: unknown) {
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess, user]);

  useEffect(() => {
    if (!authLoading) {
      void loadOrders();
    }
  }, [authLoading, loadOrders]);

  const changeOrderStatus = useCallback(
    async (order: StudentOrder, nextStatus: OrderExchangeStatus) => {
      setActionError(null);
      try {
        const updated = await updateStudentOrderStatus(order, nextStatus);
        const list = (state.data ?? []).map((o) => (o.id === updated.id ? updated : o));
        setSuccess(list);
      } catch (err: unknown) {
        logDiagnosticError(err, 'useOrders:changeOrderStatus');
        setActionError(getUserErrorMessage(err));
      }
    },
    [setSuccess, state.data],
  );

  return {
    user,
    authLoading,
    status: state.status,
    orders: state.data ?? [],
    error: state.error,
    actionError,
    setActionError,
    changeOrderStatus,
    reload: loadOrders,
  };
}
