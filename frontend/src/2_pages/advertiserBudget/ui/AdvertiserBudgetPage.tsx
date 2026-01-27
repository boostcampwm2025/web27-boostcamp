import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CreditBalanceCard,
  ChargeAmountSelector,
} from '@features/creditBalance';
import { CreditHistoryTable } from '@features/creditHistory';

export function AdvertiserBudgetPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const payment = searchParams.get('payment');
  const amount = searchParams.get('amount');
  const errorMessage = searchParams.get('message');

  // URL 파라미터로부터 모달 컨텐츠 계산
  const modalContent = useMemo(() => {
    if (payment === 'success' && amount) {
      return {
        type: 'success' as const,
        message: `${Number(amount).toLocaleString()}원 충전이 완료되었습니다!`,
      };
    }
    if (payment === 'error') {
      return {
        type: 'error' as const,
        message: errorMessage
          ? decodeURIComponent(errorMessage)
          : '결제에 실패했습니다',
      };
    }
    return null;
  }, [payment, amount, errorMessage]);

  // 모달 표시 여부 - payment 파라미터로 결정 (useState 불필요)
  const shouldShowModal = payment !== null;

  // 2.5초 후 URL 파라미터 제거 (모달 자동 닫기)
  useEffect(() => {
    if (!shouldShowModal) return;

    const timer = setTimeout(() => {
      setSearchParams({});
    }, 2500);

    return () => clearTimeout(timer);
  }, [shouldShowModal, setSearchParams]);

  const closeModal = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 px-8 py-8 bg-gray-50">
      {/* 크레딧 잔액 */}
      <CreditBalanceCard />

      {/* 충전 금액 선택 */}
      <ChargeAmountSelector />

      {/* 크레딧 사용 내역 */}
      <CreditHistoryTable />

      {/* 결제 결과 모달 */}
      {shouldShowModal && modalContent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent.type === 'success' ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  충전 완료!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {modalContent.message}
                </p>
              </>
            ) : (
              <>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  충전 실패
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {modalContent.message}
                </p>
              </>
            )}
            <button
              onClick={closeModal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
