import { Icon } from '@shared/ui/Icon';
import { MAIN_LOG_ROWS } from '../../model/content';

export function AuctionLogSection() {
  return (
    <section id="developer" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-gray-900 sm:text-4xl">
              실시간 경매 로그
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              어떤 문맥에서 어떤 광고가 선택됐는지 즉시 확인하세요. 투명한 입찰
              과정을 공개합니다.
            </p>
          </div>

      
        </div>

        <div
          id="logs"
          className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-medium">시간</th>
                  <th className="px-6 py-4 font-medium">캠페인</th>
                  <th className="px-6 py-4 font-medium">포스트 URL</th>
                  <th className="px-6 py-4 font-medium">나의 입찰</th>
                  <th className="px-6 py-4 font-medium">낙찰가</th>
                  <th className="px-6 py-4 font-medium">결정 결과 / INSIGHT</th>
                  <th className="px-6 py-4 font-medium text-right">결과</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MAIN_LOG_ROWS.map((row, index) => (
                  <tr
                    key={index}
                    className="cursor-default"
                  >
                    <td className="px-6 py-4 text-gray-900">{row.time}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-[180px] truncate font-medium text-gray-900">
                        {row.campaign}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="max-w-[240px] truncate block text-blue-600">
                        {row.postUrl}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {row.myBid}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {row.winningPrice}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {row.insight}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          row.result === '낙찰'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                            : 'bg-gray-100 text-gray-500 ring-gray-500/10'
                        }`}
                      >
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            row.result === '낙찰'
                              ? 'bg-emerald-600'
                              : 'bg-gray-500'
                          }`}
                        ></span>
                        {row.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
