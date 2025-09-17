'use client'

import { ArrowDown } from 'lucide-react'

interface ScrollToBottomButtonProps {
  show: boolean
  onClick: () => void
}

export default function ScrollToBottomButton({ show, onClick }: ScrollToBottomButtonProps) {
  if (!show) return null

  return (
    <button
      onClick={onClick}
      className="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-30 w-7 h-7 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center justify-center text-white transition-colors duration-200"
      title="Scroll to bottom"
    >
      <ArrowDown size={16} />
    </button>
  )
}
