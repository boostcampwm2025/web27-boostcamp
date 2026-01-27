import { useState } from 'react';
import { Button } from '@shared/ui/Button';
import { TextField } from '@shared/ui/TextField';
import { useToast } from '@shared/lib/toast/useToast';
import { API_CONFIG } from '@shared/lib/api';
import { useAdvertiserBalance } from '@shared/lib/hooks/useAdvertiserBalance';
import { formatWithComma } from '@shared/lib/format/formatCurrency';

const PRESET_AMOUNTS = [10000, 30000, 50000, 100000];

export function ChargeAmountSelector() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [isCharging, setIsCharging] = useState(false);
  const { showToast } = useToast();
  const { refetch } = useAdvertiserBalance();

  const handleCharge = async () => {
    const amount = selectedAmount || Number(customAmount);

    if (!amount || amount < 1000) {
      showToast('1,000원 이상 입력해주세요', 'error');
      return;
    }

    try {
      setIsCharging(true);

      const response = await fetch(
        `${API_CONFIG.baseURL}/api/users/me/credit/charge`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        const message = data.message || '충전에 실패했습니다';
        throw new Error(message);
      }

      showToast(`${amount.toLocaleString()}원이 충전되었습니다`, 'success');

      // 잔액 리프레시
      await refetch();

      // 입력 초기화
      setSelectedAmount(null);
      setCustomAmount('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '충전에 실패했습니다';
      showToast(message, 'error');
    } finally {
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
          <span className="text-center">
            {isCharging ? '충전 중...' : '충전하기'}
          </span>
        </Button>
      </div>
    </div>
  );
}
