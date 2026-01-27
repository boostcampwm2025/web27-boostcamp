import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const message = searchParams.get('message') || '결제에 실패했습니다';

    // 0.5초 후 이동 (너무 빠른 전환 방지)
    const timer = setTimeout(() => {
      navigate(
        `/advertiser/dashboard/budget?payment=error&message=${encodeURIComponent(message)}`
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  // 간단한 실패 화면
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">결제 실패</h2>
        <p className="text-gray-600">잠시 후 이동합니다...</p>
      </div>
    </div>
  );
}
