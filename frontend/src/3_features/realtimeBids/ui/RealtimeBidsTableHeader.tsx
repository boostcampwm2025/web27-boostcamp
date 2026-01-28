export function RealtimeBidsTableHeader() {
  return (
    <thead className="bg-gray-50 text-sm">
      <tr>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          일시
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          캠페인
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          포스트 URL
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          나의 입찰
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          낙찰가
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          결정 결과 / INSIGHT
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          결과
        </th>
      </tr>
    </thead>
  );
}
