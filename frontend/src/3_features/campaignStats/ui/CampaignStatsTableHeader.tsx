export function CampaignStatsTableHeader() {
  return (
    <thead className="bg-gray-50 text-sm">
      <tr>
        <th className="px-5 py-3 text-left font-medium text-gray-600">
          캠페인 명
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600">상태</th>
        <th className="px-5 py-3 text-left font-medium text-gray-600">노출</th>
        <th className="px-5 py-3 text-left font-medium text-gray-600">클릭</th>
        <th className="px-5 py-3 text-left font-medium text-gray-600">CTR</th>
        <th className="px-5 py-3 text-left font-medium text-gray-600">
          하루 예산 소진율
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600">
          전체 예산 소진율
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600">전략</th>
      </tr>
    </thead>
  );
}
