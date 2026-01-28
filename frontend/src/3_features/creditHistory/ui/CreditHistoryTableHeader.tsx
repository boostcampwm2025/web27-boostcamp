export function CreditHistoryTableHeader() {
  return (
    <thead className="bg-gray-50 text-sm">
      <tr>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          날짜
        </th>
        <th className="px-5 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
          구분
        </th>
        <th className="px-5 py-3 text-right font-medium text-gray-600 whitespace-nowrap">
          금액
        </th>
        <th className="px-5 py-3 text-right font-medium text-gray-600 whitespace-nowrap">
          잔액
        </th>
      </tr>
    </thead>
  );
}
