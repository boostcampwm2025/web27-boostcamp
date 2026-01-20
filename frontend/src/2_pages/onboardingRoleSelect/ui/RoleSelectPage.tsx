import { useCallback, useState } from 'react';
import { UserTypeSelector } from '@/3_features/onboard/ui/UserTypeSelector';
import type { AccountType } from '@features/onboard/model/types';
import { Icon } from '@shared/ui/Icon';
import { Modal } from '@shared/ui/Modal';

export function RoleSelectPage() {
  const [accountType, setAccountType] = useState<AccountType>('advertiser');


  const handleSubmit = useCallback(()=>{},[])
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(1200px_600px_at_15%_-10%,#dbeafe_0%,transparent_60%),radial-gradient(900px_500px_at_100%_0%,#dcfce7_0%,transparent_55%),#f6f7fb] px-4 py-10 text-slate-900">
      <div className="pointer-events-none absolute -top-24 left-8 h-52 w-52 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-6 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />

      <Modal height="h-[500px]">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">

            </div>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">
              환영합니다! <br/>어떤 계정으로 시작할까요?
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              선택한 유형에 맞춰 대시보드와 가이드가 자동으로 세팅돼요.
            </p>
          </div>

          <div className="px-8 pt-6">
            <UserTypeSelector
              value={accountType}
              onChange={setAccountType}
            />
          </div>

          <div className="mt-auto flex items-center justify-between px-8 pb-8 pt-6">
            <p className="text-xs text-slate-400">
              추후에 수정이 불가능해요.
            </p>
            <button
              type="submit"
              className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              시작하기
              <Icon.ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
