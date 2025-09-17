'use client'

import { useState, useEffect, useRef } from 'react'
import ChatInput from './ChatInput'

interface HomeScreenProps {
  onSubmit: (text: string) => void
  status: string
  selectedModel: string
  onModelChange: (model: string) => void
  isTransitioning: boolean
  onTransitionStart: () => void
  initialValue?: string
  onModelSelectorOpenChange?: (isOpen: boolean) => void
}

export default function HomeScreen({ 
  onSubmit, 
  status, 
  selectedModel, 
  onModelChange,
  isTransitioning,
  onTransitionStart,
  initialValue,
  onModelSelectorOpenChange
}: HomeScreenProps) {
  const [placeholderText, setPlaceholderText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [typingAnimationStopped, setTypingAnimationStopped] = useState(false)

  // 打字动画效果 
  useEffect(() => {
    const text = 'Please enter your question or idea...'
    let currentIndex = 0
    let phase = 'typing' // typing -> stop

    const typeInterval = setInterval(() => {
      if (phase === 'typing' && !typingAnimationStopped) {
        // 打字阶段
        if (currentIndex <= text.length) {
          setPlaceholderText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          // 打字完成，立即停止光标
          phase = 'stop'
          setShowCursor(false)
        }
      }
    }, 150)

    return () => clearInterval(typeInterval)
  }, [typingAnimationStopped])

  // 当用户点击输入框时停止动画
  const handleInputFocus = () => {
    if (!typingAnimationStopped) {
      setTypingAnimationStopped(true)
      setPlaceholderText('Please enter your question or idea...')
      setShowCursor(false)
    }
  }

  const handleSubmit = (text: string) => {
    // 开始过渡动画
    onTransitionStart()
    
    // 延迟发送消息，让动画有时间播放
    setTimeout(() => {
      onSubmit(text)
    }, 900) // 1120ms过渡时间
  }

  return (
    <div className={`h-full flex flex-col justify-center transition-all duration-[900ms] ease-in-out ${
      isTransitioning ? 'opacity-0 transform -translate-y-8' : 'opacity-100 transform translate-y-0'
    }`}>
      {/* 标题和描述 */}
      <div className="text-center mb-8">
        <h1 
          ref={useRef<HTMLHeadingElement>(null)}
          className="text-4xl font-bold text-white mb-6"
          style={{
            textShadow: '0 0 20px rgba(147, 51, 234, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)',
          }}
        >
          AI Chatbot
        </h1>
        <div 
          className="text-sm text-gray-300 max-w-2xl mx-auto px-6"
          style={{
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
          }}
        >
          Chat with intelligent AI assistant to get answers, creative inspiration, or have deep conversations. 
          Supports multi-turn conversations, making AI your intelligent partner.
        </div>
      </div>
      
      {/* 输入区域 - 直接放在文案下面 */}
      <div className={`pb-32 transition-all duration-[900ms] ease-in-out ${
        isTransitioning ? 'transform translate-y-32' : 'transform translate-y-0'
      }`}>
        <ChatInput
          key={`home-${initialValue}`}
          onSubmit={handleSubmit}
          status={status}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          placeholder={`${placeholderText}${showCursor ? '|' : ''}`}
          className="relative"
          onFocus={handleInputFocus}
          initialValue={initialValue}
          onModelSelectorOpenChange={onModelSelectorOpenChange}
        />
      </div>
    </div>
  )
}
