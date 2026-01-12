export function OnboardingSdkGuidePageSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-6 bg-gray-50">
      <div className="flex flex-col items-center gap-6 min-w-150">
        {/* SdkSuccessHeader 영역 */}
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="w-48 h-8 bg-gray-200 rounded" />
          <div className="w-64 h-4 bg-gray-200 rounded" />
        </div>

        {/* SdkCodeSnippet 영역 */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex flex-col gap-1 p-4 rounded-xl w-full bg-gray-200 animate-pulse">
            <div className="w-full h-20" />
          </div>
          <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* SdkInfoBox 영역 */}
        <div className="flex flex-col p-4 gap-4 w-full bg-gray-200 rounded-xl animate-pulse">
          <div className="w-32 h-5" />
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full h-4" />
            <div className="w-full h-4" />
            <div className="w-full h-4" />
            <div className="w-full h-4" />
          </div>
        </div>

        {/* SdkInstallGuideList 영역 */}
        <div className="flex flex-col gap-2 w-full">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-row justify-between bg-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-24 h-4" />
                  <div className="w-48 h-5" />
                  <div className="w-64 h-3" />
                </div>
                <div className="w-26 h-20" />
              </div>
            ))}
          </div>
        </div>

        {/* SdkInstallFooter 영역 */}
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <div className="w-40 h-12 bg-gray-200 rounded-lg" />
          <div className="w-56 h-3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
