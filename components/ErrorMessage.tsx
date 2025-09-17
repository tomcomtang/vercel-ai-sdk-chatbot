'use client'

interface ErrorMessageProps {
  errorMessage: string
  onRetry: () => void
}

export default function ErrorMessage({ errorMessage, onRetry }: ErrorMessageProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <p className="text-red-400 text-sm">{errorMessage}</p>
          <button
            onClick={onRetry}
            className="ml-auto text-red-400 hover:text-red-300 text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}
