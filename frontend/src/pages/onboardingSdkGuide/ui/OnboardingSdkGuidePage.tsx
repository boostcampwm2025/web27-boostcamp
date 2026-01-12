import { SdkSuccessHeader, SdkCodeSnippet } from '@features/sdkInstallation';

export function OnboardingSdkGuidePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <SdkSuccessHeader />
      <SdkCodeSnippet />
    </div>
  );
}
