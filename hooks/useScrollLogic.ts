import { useState, useEffect, useRef } from 'react'

export function useScrollLogic(messagesLength: number, status: string) {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (messagesLength === 0) return
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // 如果距离底部超过100px，显示按钮
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      setShowScrollToBottom(distanceFromBottom > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [messagesLength])

  // 当消息数量变化时自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messagesLength])

  // 当AI开始回答时自动滚动到底部，并在回答过程中持续滚动
  useEffect(() => {
    if (status === 'streaming' && messagesEndRef.current) {
      // 立即滚动到底部
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      
      // 设置定时器，在AI回答过程中持续滚动到底部
      const scrollInterval = setInterval(() => {
        if (messagesEndRef.current && status === 'streaming') {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500) // 每500ms滚动一次
      
      return () => clearInterval(scrollInterval)
    }
  }, [status])

  // 快速回到底部
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
