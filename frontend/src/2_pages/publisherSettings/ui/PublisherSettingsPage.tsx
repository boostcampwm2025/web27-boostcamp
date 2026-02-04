import { useState } from 'react';
import {
  SdkCodeSnippet,
  SdkInfoBox,
  SdkInstallGuideList,
  SdkModeToggle,
} from '@features/sdkInstallation';
import type { SdkMode } from '@features/sdkInstallation';
import { useBlogKey } from '@/3_features/sdkInstallation/lib/useBlogKey';
import { useDocumentTitle } from '@shared/lib/hooks';

export function PublisherSettingsPage() {
  useDocumentTitle('광고 설정');
  const [mode, setMode] = useState<SdkMode>('auto');
  const { data, isPending, isError, error } = useBlogKey();

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">광고 설정</h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.blogKey) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">광고 설정</h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow p-8">
          <p className="text-sm font-medium text-gray-900 mb-2">
            블로그 키를 불러오지 못했습니다.
          </p>
          <p className="text-xs text-gray-500">
            {error instanceof Error
              ? error.message
              : '잠시 후 다시 시도해주세요.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">광고 설정</h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">SDK 설치 가이드</h2>
          <p className="text-sm text-gray-500 mt-1">
            블로그에 광고를 표시하기 위해 SDK를 설치해주세요.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 p-6">
          <SdkModeToggle mode={mode} onModeChange={setMode} />
          <SdkCodeSnippet blogKey={data.blogKey} mode={mode} />
          <SdkInfoBox mode={mode} />
          <SdkInstallGuideList mode={mode} />
        </div>
      </div>
    </div>
  );
}
