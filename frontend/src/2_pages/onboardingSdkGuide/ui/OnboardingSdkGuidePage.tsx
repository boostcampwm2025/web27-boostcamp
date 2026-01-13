import { SdkSuccessHeader, SdkCodeSnippet } from '@features/sdkInstallation';

// TODO: API 응답 or 로그인 시 받아온 실제 blogKey로 교체 필요!
const MOCK_BLOG_KEY = 'blog-123';

export function OnboardingSdkGuidePage() {
  return (
    <div className="flex flex-col items-center gap-4 px-8 py-8 bg-gray-50">
      <SdkSuccessHeader />
      <SdkCodeSnippet blogKey={MOCK_BLOG_KEY} />
    </div>
  );
}
