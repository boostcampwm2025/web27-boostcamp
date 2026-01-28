import {
  CreditBalanceCard,
  ChargeAmountSelector,
} from '@features/creditBalance';
import { CreditHistoryTable } from '@features/creditHistory';

export function AdvertiserBudgetPage() {
  return (
    <div className="min-h-screen flex flex-col gap-4 px-8 py-8 bg-gray-50">
      {/* 크레딧 잔액 */}
      <CreditBalanceCard />

      {/* 충전 금액 선택 */}
      <ChargeAmountSelector />

      {/* 크레딧 사용 내역 */}
      <CreditHistoryTable />
    </div>
  );
}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  충전 완료!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {modalContent.message}
                </p>
              </>
            ) : modalContent.type === 'error' ? (
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
            ) : (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  결제 확인 중
                </h2>
                <p className="text-sm text-gray-600">{modalContent.message}</p>
              </>
            )}
            {modalContent.type !== 'loading' && (
              <button
                onClick={closeModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                확인
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
