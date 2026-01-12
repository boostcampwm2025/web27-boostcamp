import { useNavigate } from 'react-router-dom';
import {
  SdkSuccessHeader,
  SdkCodeSnippet,
  SdkInfoBox,
  SdkInstallGuideList,
  SdkInstallFooter,
} from '@features/sdkInstallation';

// TODO: API 응답 or 로그인 시 받아온 실제 blogKey로 교체 필요!
const MOCK_BLOG_KEY = 'blog-123';

export function OnboardingSdkGuidePage() {
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    navigate('/publisher/dashboard');
  };

  return (
    <div className="flex flex-col items-center gap-6 px-8 py-6 bg-gray-50">
      <SdkSuccessHeader />
      <SdkCodeSnippet blogKey={MOCK_BLOG_KEY} />
      <SdkInfoBox />
      <SdkInstallGuideList />
      <SdkInstallFooter onNavigateToDashboard={handleNavigateToDashboard} />
    </div>
  );
}
