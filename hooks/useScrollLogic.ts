import { useState, useEffect, useRef } from 'react'

export function useScrollLogic(messagesLength: number, status: string) {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (messagesLength === 0) return
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // If distance from bottom exceeds 100px, show button
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      setShowScrollToBottom(distanceFromBottom > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [messagesLength])

  // Auto scroll to bottom when message count changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messagesLength])

  // Auto scroll to bottom when AI starts answering and continue scrolling during response
  useEffect(() => {
    if (status === 'streaming' && messagesEndRef.current) {
      // Immediately scroll to bottom
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      
      // Set timer to continuously scroll to bottom during AI response
      const scrollInterval = setInterval(() => {
        if (messagesEndRef.current && status === 'streaming') {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500) // Scroll every 500ms
      
      return () => clearInterval(scrollInterval)
    }
  }, [status])

  // Quick return to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return {
    showScrollToBottom,
    scrollToBottom,
    messagesEndRef,
  }
}
