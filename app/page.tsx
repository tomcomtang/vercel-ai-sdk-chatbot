'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Chat() {
  const [input, setInput] = useState('')
  const [placeholderText, setPlaceholderText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [hideHomeScreen, setHideHomeScreen] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  // 打字动画效果
  useEffect(() => {
    const text = '请输入您的问题或想法...'
    let currentIndex = 0
    let cursorVisible = true
    let phase = 'typing' // typing -> stop

    const typeInterval = setInterval(() => {
      if (phase === 'typing') {
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
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      // 开始过渡动画
      setIsTransitioning(true)
      
      // 延迟发送消息，让动画有时间播放
      setTimeout(() => {
        sendMessage({ text: input })
        setInput('')
        setShowChat(true)
        setIsTransitioning(false)
        // 再延迟一点时间隐藏首屏，确保动画完成
        setTimeout(() => {
          setHideHomeScreen(true)
        }, 100)
      }, 900) // 1120ms过渡时间
    }
  }

  return (
    <div className="w-full max-w-4xl h-full mx-auto px-6 py-4">
      {/* 首屏标题和描述 */}
      {messages.length === 0 && !hideHomeScreen ? (
        <div className={`h-full flex flex-col justify-center transition-all duration-[900ms] ease-in-out ${
          isTransitioning ? 'opacity-0 transform -translate-y-8' : 'opacity-100 transform translate-y-0'
        }`}>
          <div className="text-center mb-8">
            <h1 
              ref={titleRef}
              className="text-4xl font-bold text-white mb-8"
              style={{
                textShadow: '0 0 25px rgba(147,51,234,0.8), 0 0 50px rgba(147,51,234,0.6), 0 0 75px rgba(59,130,246,0.5), 0 0 100px rgba(59,130,246,0.3)',
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
            >
              AI Chatbot
            </h1>
            <p 
              className="text-sm text-gray-300 mb-6 max-w-2xl mx-auto"
            >
              与智能AI助手对话，获取答案、创意灵感或进行深度交流。支持多轮对话，让AI成为你的智能伙伴。
            </p>
          </div>
          
          {/* 输入区域 - 直接放在文案下面 */}
          <div className={`pb-32 transition-all duration-[900ms] ease-in-out ${
            isTransitioning ? 'transform translate-y-32' : 'transform translate-y-0'
          }`}>
            <form onSubmit={handleSubmit} className="relative mx-auto" style={{ maxWidth: '720px' }}>
              <textarea
                className="w-full p-4 pr-20 border border-gray-600 rounded-2xl focus:outline-none focus:border-gray-600 bg-gray-800 text-white placeholder-gray-400 placeholder:text-sm resize-none shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] focus:shadow-[0_0_100px_rgba(255,255,255,0.6)] transition-all duration-300"
                style={{
                  boxShadow: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 25px rgba(255,255,255,0.3)'
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none'
                }}
                rows={4}
                value={input}
                placeholder={`${placeholderText}${showCursor ? '|' : ''}`}
                onChange={(e) => setInput(e.target.value)}
                disabled={status === 'streaming'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <button
                type="submit"
                disabled={status === 'streaming' || !input.trim()}
                className="absolute bottom-4 right-4 w-10 h-10 bg-transparent hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200"
              >
                {status === 'streaming' ? '...' : '↑'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className={`h-full flex flex-col transition-all duration-800 ease-in-out ${
          showChat ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <div className="space-y-4 mb-4 flex-1 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-center space-x-3 mx-auto"
                style={{ maxWidth: '720px' }}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-lg bg-gray-800 border border-gray-700 flex-shrink-0 ${
                    message.role === 'user'
                      ? 'text-white'
                      : 'text-white'
                  }`}
                >
                  {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap text-white">
                    {message.parts
                      .filter((part: any) => part.type === 'text')
                      .map((part: any) => part.text)
                      .join('')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 输入区域 */}
          <div className={`pb-32 transition-all duration-800 ease-in-out ${
            showChat ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <form onSubmit={handleSubmit} className="relative mx-auto" style={{ maxWidth: '720px' }}>
              <textarea
                className="w-full p-4 pr-20 border border-gray-600 rounded-2xl focus:outline-none focus:border-gray-600 bg-gray-800 text-white placeholder-gray-400 placeholder:text-sm resize-none shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] focus:shadow-[0_0_100px_rgba(255,255,255,0.6)] transition-all duration-300"
                style={{
                  boxShadow: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 25px rgba(255,255,255,0.3)'
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none'
                }}
                rows={4}
                value={input}
                placeholder="输入你的问题或想法..."
                onChange={(e) => setInput(e.target.value)}
                disabled={status === 'streaming'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <button
                type="submit"
                disabled={status === 'streaming' || !input.trim()}
                className="absolute bottom-4 right-4 w-10 h-10 bg-transparent hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200"
              >
                {status === 'streaming' ? '...' : '↑'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
