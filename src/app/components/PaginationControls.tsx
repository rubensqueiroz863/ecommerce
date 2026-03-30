type PaginationControlsProps = {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  page: number;
  hasMore: boolean;
}

export default function PaginationControls({ handleNextPage, handlePrevPage, page, hasMore }: PaginationControlsProps) {
  return (
    <div className="flex min-w-full bg-[var(--bg-secondary)] justify-between">
      <button
        onClick={handlePrevPage}
        disabled={page === 0}
        className="px-4 cs py-2 bg-[var(--bg-secondary)] rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2">Page {page + 1}</span>
      <button
        onClick={handleNextPage}
        disabled={!hasMore}
        className="px-4 cs py-2 bg-[var(--bg-secondary)] rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}