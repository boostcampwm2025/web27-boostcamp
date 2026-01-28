import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@shared/lib/toast/useToast';

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const message = searchParams.get('message') || '결제에 실패했습니다';
    showToast(message, 'error');
    navigate('/advertiser/dashboard/budget');
  }, [searchParams, navigate, showToast]);

  return null;
}
