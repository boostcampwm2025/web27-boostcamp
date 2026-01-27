import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_CONFIG } from '@shared/lib/api';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        navigate(
          '/advertiser/dashboard/budget?payment=error&message=잘못된 결제 정보입니다'
        );
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

        // 성공: 예산 관리 페이지로 이동 + 모달용 파라미터 전달
        navigate(
          `/advertiser/dashboard/budget?payment=success&amount=${amount}`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '결제 승인에 실패했습니다';
        navigate(
          `/advertiser/dashboard/budget?payment=error&message=${encodeURIComponent(message)}`
        );
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  // 로딩 화면 - 예산 페이지 느낌으로
  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 스켈레톤 화면 - 예산 페이지와 유사 */}
        <div className="space-y-4">
          {/* 크레딧 잔액 카드 스켈레톤 */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* 충전 섹션 스켈레톤 */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* 히스토리 테이블 스켈레톤 */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* 중앙 로딩 오버레이 */}
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              결제 확인 중
            </h2>
            <p className="text-gray-600">잠시만 기다려주세요...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
