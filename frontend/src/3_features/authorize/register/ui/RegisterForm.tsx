import { TextField } from '@shared/ui/TextField';
import { Icon } from '@/4_shared/ui/Icon';
import { FormDivider } from '@/4_shared/ui/Divider';
import { useCallback } from 'react';
import { handleRegister } from '../../lib/handleOauth';
import { UserTypeSelector } from '@/3_features/authorize/register/ui/UserTypeSelector';
import { useState } from 'react';
import type { AccountType } from '../model/types';
import { TermsModal } from './TermsModal';

export function RegisterForm() {
  const [accountType, setAccountType] = useState<AccountType>('ADVERTISER');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const onClick = useCallback(() => {
    if (!agreedToTerms) {
      alert('약관에 동의해야 가입할 수 있습니다.');
      return;
    }
    handleRegister(accountType);
  }, [accountType, agreedToTerms]);

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  return (
    <>
      <form className="flex flex-col gap-6 mt-15 mx-10">
      <div className="flex flex-col gap-1">
        <p className="text-4xl font-extrabold">회원가입</p>
        <p className="text-base text-[#616E89] font-normal">
          광고주 또는 퍼블리셔로 가입하세요.
        </p>
      </div>
      <UserTypeSelector value={accountType} onChange={setAccountType} />{' '}
      <div className="flex flex-col gap-6">
        {/* <UserTypeSelector value={accountType} onChange={setAccountType} /> */}

        {/* 약관 동의 체크박스 */}
        <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 cursor-pointer"
          />
          <span>
            <button
              type="button"
              onClick={handleTermsClick}
              className="text-blue-500 hover:underline font-medium"
            >
              BoostAD {accountType === 'ADVERTISER' ? '광고주' : '퍼블리셔'} 이용약관
            </button>
            에 동의합니다 (필수)
          </span>
        </label>

        <button
          onClick={() => onClick()}
          type="button"
          disabled={!agreedToTerms}
          className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-base font-semibold ${
            agreedToTerms
              ? 'border-gray-200 bg-white text-[#111318] hover:bg-gray-50 cursor-pointer'
              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Icon.Google />
          <span>Google로 계속하기</span>
        </button>

        {!agreedToTerms && (
          <p className="text-xs text-red-500 -mt-4">
            약관에 동의해야 Google로 가입할 수 있습니다
          </p>
        )}

        <FormDivider />

        <div className="rounded-md text-center py-2 text-sm text-[#7A8699]">
          로컬 회원가입은 준비 중입니다. 현재는 Google로만 가입할 수 있어요.
        </div>

        <TextField
          name="email"
          type="email"
          label="이메일"
          placeholder="exmaple@email.com"
          disabled
        />
        <TextField
          name="password"
          type="password"
          label="비밀번호"
          placeholder="••••••••"
          disabled
        />
        <TextField
          name="passwordConfirm"
          type="password"
          label="비밀번호 확인"
          placeholder="••••••••"
          disabled
        />
      </div>
      <button
        type="submit"
        disabled={true}
        className="h-11 rounded-lg bg-blue-500 text-base font-semibold text-white hover:bg-blue-600 cursor-not-allowed"
      >
        회원가입
      </button>
    </form>

    {/* 약관 모달 */}
    {showTermsModal && (
      <TermsModal
        accountType={accountType}
        onClose={() => setShowTermsModal(false)}
        onAgree={() => setAgreedToTerms(true)}
      />
    )}
    </>
  );
}
