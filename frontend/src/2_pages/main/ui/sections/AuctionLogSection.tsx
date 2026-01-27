import { Icon } from '@shared/ui/Icon';
import { MAIN_LOG_ROWS } from '../../model/content';

export function AuctionLogSection() {
  return (
    <section id="developer" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-gray-900 sm:text-4xl">
              실시간 경매 로그
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              어떤 문맥에서 어떤 광고가 선택됐는지 즉시 확인하세요. 문제는
              빨리 찾고, 개선은 더 빠르게.
            </p>
          </div>

          <a
            href="#logs"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
          >
            LIVE 보기
            <Icon.ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div
          id="logs"
          className="mt-10 overflow-hidden rounded-2xl border border-white/20 bg-gray-900 shadow-[0px_24px_70px_rgba(17,24,39,0.25)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs font-medium text-white/60">
              realtime-auction.log
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left font-mono text-[12px] leading-5 text-white/90">
              <thead className="bg-white/5 text-white/70">
                <tr>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Page</th>
                  <th className="px-6 py-3 font-medium">Keyword</th>
                  <th className="px-6 py-3 font-medium">Bid</th>
                  <th className="px-6 py-3 font-medium text-right">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                {MAIN_LOG_ROWS.map((row) => (
                  <tr
                    key={`${row.time}-${row.page}`}
                    className="border-t border-white/10"
                  >
                    <td className="px-6 py-3 text-white/70">{row.time}</td>
                    <td className="px-6 py-3">{row.page}</td>
                    <td className="px-6 py-3 text-blue-200">{row.keyword}</td>
                    <td className="px-6 py-3 text-emerald-200">{row.bid}</td>
                    <td className="px-6 py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-200">
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

