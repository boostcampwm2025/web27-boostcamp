import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SdkSuccessHeader,
  SdkCodeSnippet,
  SdkInfoBox,
  SdkInstallGuideList,
  SdkInstallFooter,
  SdkModeToggle,
} from '@features/sdkInstallation';
import type { SdkMode } from '@features/sdkInstallation';
import { useBlogKey } from '@/3_features/sdkInstallation/lib/useBlogKey';
import { OnboardingSdkGuidePageSkeleton } from './OnboardingSdkGuidePageSkeleton';

export function OnboardingSdkGuidePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SdkMode>('auto');
  const { data, isPending, isError, error } = useBlogKey();

  if (isPending) {
    return <OnboardingSdkGuidePageSkeleton />;
  }

  if (isError || !data?.blogKey) {
    return (
      <div className="flex flex-col items-center gap-4 px-8 py-6 bg-gray-50">
        <p className="text-sm font-medium text-gray-900">
          블로그 키를 불러오지 못했습니다.
        </p>
        <p className="text-xs text-gray-500">
          {error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.'}
        </p>
        <button
          className="flex flex-row bg-blue-500 items-center py-3 px-8 gap-1.5 text-white rounded-lg"
          onClick={() => navigate('/publisher/onboarding/blog-admission')}
        >
          <span className="text-base font-medium cursor-pointer">
            블로그 등록하러 가기
          </span>
        </button>
      </div>
    );
  }

  const handleNavigateToDashboard = () => {
    navigate('/publisher/dashboard/main');
  };

  return (
    <div className="flex flex-col items-center gap-8 px-8 py-6 bg-gray-50">
      <SdkSuccessHeader mode={mode} />
      <SdkModeToggle mode={mode} onModeChange={setMode} />
      <SdkCodeSnippet blogKey={data.blogKey} mode={mode} />
      <SdkInfoBox mode={mode} />
      <SdkInstallGuideList mode={mode} />
      <SdkInstallFooter onNavigateToDashboard={handleNavigateToDashboard} />
    </div>
  );
}
