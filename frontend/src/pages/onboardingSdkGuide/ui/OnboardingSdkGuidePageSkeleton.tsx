export function OnboardingSdkGuidePageSkeleton() {
  return (
    <div className="flex flex-col items-center gap-8 px-8 py-6 bg-gray-50">
      {/* SdkSuccessHeader 영역 */}
      <div className="flex flex-col items-center gap-2 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="w-48 h-8 bg-gray-200 rounded" />
        <div className="w-64 h-4 bg-gray-200 rounded" />
      </div>

      {/* SdkCodeSnippet 영역 */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col gap-1 p-4 rounded-xl min-w-150 bg-gray-300 animate-pulse">
          <div className="flex flex-row justify-between mb-1">
            <div className="w-32 h-3 bg-gray-200 rounded" />
            <div className="w-20 h-6 bg-gray-200 rounded" />
          </div>
          <div className="w-full h-16 bg-gray-200 rounded" />
        </div>
        <div className="w-48 h-3 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* SdkInfoBox 영역 */}
      <div className="flex flex-col min-w-150 p-4 gap-4 bg-gray-200 rounded-xl animate-pulse">
        <div className="w-32 h-5 bg-gray-300 rounded" />
        <div className="grid grid-cols-2 gap-2 px-7">
          <div className="w-full h-4 bg-gray-300 rounded" />
          <div className="w-full h-4 bg-gray-300 rounded" />
          <div className="w-full h-4 bg-gray-300 rounded" />
          <div className="w-full h-4 bg-gray-300 rounded" />
        </div>
      </div>

      {/* SdkInstallGuideList 영역 */}
      <div className="flex flex-col min-w-150 gap-4">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-row justify-between bg-gray-200 rounded-xl p-4 animate-pulse"
            >
              <div className="flex flex-col gap-2 flex-1">
                <div className="w-24 h-4 bg-gray-300 rounded" />
                <div className="w-48 h-5 bg-gray-300 rounded" />
                <div className="w-64 h-3 bg-gray-300 rounded" />
              </div>
              <div className="w-26 h-20 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* SdkInstallFooter 영역 */}
      <div className="flex flex-col min-w-150 items-center gap-2 animate-pulse">
        <div className="w-40 h-12 bg-gray-200 rounded-lg" />
        <div className="w-64 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
