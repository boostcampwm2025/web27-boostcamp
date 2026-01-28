import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_CONFIG } from '@shared/lib/api';
import { useToast } from '@shared/lib/toast/useToast';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasConfirmed = useRef(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        showToast('잘못된 결제 정보입니다', 'error');
        navigate('/advertiser/dashboard/budget');
        return;
      }

      try {
        const response = await fetch(
          `${API_CONFIG.baseURL}/api/payments/confirm`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount: Number(amount),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || data.status === 'error') {
          throw new Error(data.message || '결제 승인에 실패했습니다');
        }

        showToast(`${Number(amount).toLocaleString()}원 충전 완료!`, 'success');
        navigate('/advertiser/dashboard/budget');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '결제 승인에 실패했습니다';
        showToast(message, 'error');
        navigate('/advertiser/dashboard/budget');
      }
    };

    confirmPayment();
  }, [searchParams, navigate, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">결제를 확인하는 중입니다...</p>
      </div>
    </div>
  );
}
