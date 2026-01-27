import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@shared/ui/Button';
import { TextField } from '@shared/ui/TextField';
import { useToast } from '@shared/lib/toast/useToast';
import { formatWithComma } from '@shared/lib/format/formatCurrency';
import { Icon } from '@shared/ui/Icon';

const PRESET_AMOUNTS = [10000, 30000, 50000, 100000];
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

export function ChargeAmountSelector() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [isCharging, setIsCharging] = useState(false);
  const { showToast } = useToast();

  const handleCharge = async () => {
    const amount = selectedAmount || Number(customAmount);

    if (!amount || amount < 1000) {
      showToast('1,000원 이상 입력해주세요', 'error');
      return;
    }

    try {
      setIsCharging(true);

      // 토스페이먼츠 SDK 로드
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

      // 주문 ID 생성
      const orderId = `ORDER_${uuidv4()}`;

      // 결제창 호출
      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName: `광고 크레딧 ${amount.toLocaleString()}원 충전`,
        customerName: '광고주',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      // 결제창이 열리면 사용자가 결제 완료할 때까지 대기
      // successUrl로 리다이렉트됨
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '결제에 실패했습니다';
      showToast(message, 'error');
      setIsCharging(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        충전 금액 선택
      </h3>

      {/* 금액 선택 버튼 */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {PRESET_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant={selectedAmount === amount ? 'blue' : 'white'}
            size="sm"
            onClick={() => {
              setSelectedAmount(amount);
              setCustomAmount('');
              setDisplayAmount('');
            }}
          >
            <span className="mr-1">+</span>
            {formatWithComma(amount)}원
          </Button>
        ))}
      </div>

      {/* 직접 입력 */}
      <TextField
        label="직접 입력 (1,000원 단위)"
        type="text"
        value={displayAmount}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/,/g, '');
          if (/^\d*$/.test(rawValue)) {
            setCustomAmount(rawValue);
            setDisplayAmount(rawValue ? formatWithComma(Number(rawValue)) : '');
            setSelectedAmount(null);
          }
        }}
        placeholder="금액 입력"
      />

      {/* 충전 버튼 */}
      <div className="mt-4 flex justify-end">
        <Button
          variant="blue"
          onClick={handleCharge}
          disabled={isCharging || (!selectedAmount && !customAmount)}
        >
          <div className="flex items-center gap-2">
            <Icon.Toss className="w-4 h-4" />
            <span>{isCharging ? '충전 중...' : '토스페이먼츠로 충전'}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
