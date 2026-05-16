interface PaginationControlsProps {
  pageNumber: number
  totalPages: number
  isFirst: boolean
  isLast: boolean
  onPrevious: () => void
  onNext: () => void
}

export function PaginationControls({
  pageNumber,
  totalPages,
  isFirst,
  isLast,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {pageNumber + 1} / {Math.max(1, totalPages)}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="h-9 rounded-md border px-3 text-sm"
          onClick={onPrevious}
          disabled={isFirst}
        >
          Precedent
        </button>
        <button
          type="button"
          className="h-9 rounded-md border px-3 text-sm"
          onClick={onNext}
          disabled={isLast}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

