'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  errorMessage: string
  onRetry: () => void
}

export default function ErrorMessage({ errorMessage, onRetry }: ErrorMessageProps) {
  return (
    <div className="mx-auto" style={{ maxWidth: '720px' }}>
      <div className="p-2 pl-0">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
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
