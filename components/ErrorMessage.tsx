'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  errorMessage: string
  onRetry: () => void
}

export default function ErrorMessage({ errorMessage, onRetry }: ErrorMessageProps) {
  const MAX_LENGTH = 80 // Maximum display characters
  const truncatedMessage = errorMessage.length > MAX_LENGTH 
    ? errorMessage.substring(0, MAX_LENGTH) + '...'
    : errorMessage

  return (
    <div className="mx-auto" style={{ maxWidth: '720px' }}>
      <div className="p-2 pl-0">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p 
            className="text-red-400 text-sm flex-1 truncate"
            title={errorMessage} // Show complete error message on hover
          >
            {truncatedMessage}
          </p>
          <button
            onClick={onRetry}
            className="ml-2 text-red-400 hover:text-red-300 text-sm underline flex-shrink-0"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}
