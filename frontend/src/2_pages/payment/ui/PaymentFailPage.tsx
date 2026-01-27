import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate('/advertiser/dashboard/budget'), 2000);
  }, [navigate]);

  const message = searchParams.get('message') || '결제에 실패했습니다';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">충전 실패</h2>
        <p className="text-lg text-gray-600 mb-6">{message}</p>
        <p className="text-sm text-gray-500">
          잠시 후 예산 관리 페이지로 이동합니다...
        </p>
      </div>
    </div>
  );
}
