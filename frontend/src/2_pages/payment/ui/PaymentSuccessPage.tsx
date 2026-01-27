import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    // URL 파라미터를 그대로 Budget 페이지로 전달
    const params = new URLSearchParams({
      payment: 'processing',
      paymentKey: paymentKey || '',
      orderId: orderId || '',
      amount: amount || '',
    });

    navigate(`/advertiser/dashboard/budget?${params.toString()}`, {
      replace: true,
    });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm">결제 확인 중...</p>
      </div>
    </div>
  );
}
