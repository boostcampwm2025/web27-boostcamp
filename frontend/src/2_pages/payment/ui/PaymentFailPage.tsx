import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const message = searchParams.get('message') || '결제가 취소되었습니다';

    navigate(
      `/advertiser/dashboard/budget?payment=error&message=${encodeURIComponent(message)}`,
      { replace: true }
    );
  }, [searchParams, navigate]);

  return null;
}
