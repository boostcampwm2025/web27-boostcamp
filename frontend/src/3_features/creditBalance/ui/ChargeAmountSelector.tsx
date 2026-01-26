import { useState } from 'react';
import { Button } from '@shared/ui/Button';
import { TextField } from '@shared/ui/TextField';
import { useToast } from '@shared/lib/toast/useToast';

const PRESET_AMOUNTS = [10000, 30000, 50000, 100000];

export function ChargeAmountSelector() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const { showToast } = useToast();

  const handleCharge = async () => {
    const amount = selectedAmount || Number(customAmount);

    if (!amount || amount < 1000) {
      showToast({ message: '1,000원 이상 입력해주세요', type: 'error' });
      return;
    }

    // TODO: API 호출
    showToast({ message: `${amount.toLocaleString()}원이 충전되었습니다`, type: 'success' });
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">충전 금액 선택</h3>

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
            }}
          >
            {(amount / 10000).toLocaleString()}만원
          </Button>
        ))}
      </div>

      {/* 직접 입력 */}
      <TextField
        label="직접 입력 (1,000원 단위)"
        type="number"
        value={customAmount}
        onChange={(e) => {
          setCustomAmount(e.target.value);
          setSelectedAmount(null);
        }}
        placeholder="금액 입력"
        min="1000"
        step="1000"
      />

      {/* 충전 버튼 */}
      <Button
        variant="blue"
        onClick={handleCharge}
        disabled={!selectedAmount && !customAmount}
      >
        <span className="w-full text-center">충전하기</span>
      </Button>
    </div>
  );
}
