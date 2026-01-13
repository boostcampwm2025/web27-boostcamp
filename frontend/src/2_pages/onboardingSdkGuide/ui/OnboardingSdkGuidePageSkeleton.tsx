export function OnboardingSdkGuidePageSkeleton() {
  return (
    <div className="flex flex-col items-center min-h-screen gap-4 px-8 py-8 bg-gray-50">
      <div className="flex flex-col items-center gap-2 animate-pulse">
        <div className="w-48 h-8 bg-gray-200 rounded" />
        <div className="w-64 h-4 bg-gray-200 rounded" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col gap-1 p-4 rounded-xl min-w-150 bg-gray-200 animate-pulse">
          <div className="w-full h-20" />
        </div>
        <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
