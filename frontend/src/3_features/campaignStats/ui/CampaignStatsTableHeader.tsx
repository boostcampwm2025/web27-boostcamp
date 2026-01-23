export function CampaignStatsTableHeader() {
  return (
    <thead className="bg-gray-50 text-sm">
      <tr>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          캠페인 명
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          상태
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          노출
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          클릭
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          CTR
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          하루 예산 소진율
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          전체 예산 소진율
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          전략
        </th>
      </tr>
    </thead>
  );
}
