export function SpendingLogTableHeader() {
  return (
    <thead className="bg-gray-50 text-sm">
      <tr>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          시간
        </th>
        <th className="min-w-48 px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          포스트 / 블로그
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          CPC
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          방문자 유형
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          상세 내역
        </th>
      </tr>
    </thead>
  );
}
