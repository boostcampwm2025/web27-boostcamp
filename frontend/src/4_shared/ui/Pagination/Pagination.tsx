interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  offset: number;
  hasMore: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  offset,
  hasMore,
  onPrevPage,
  onNextPage,
}: PaginationProps) {
  const startItem = offset + 1;
  const endItem = Math.min(offset + itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
      <div className="text-sm text-gray-600">
        전체 {totalItems}개 중 {startItem}-{endItem}개
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevPage}
          disabled={offset === 0}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <span className="text-sm text-gray-600">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={onNextPage}
          disabled={!hasMore}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );
}
