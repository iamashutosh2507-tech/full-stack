interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const message =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message?: string }).message)
      : 'Something went wrong.'

  return (
    <div data-testid="error-display">
      <p>{message}</p>
      {onRetry && (
        <button data-testid="retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
