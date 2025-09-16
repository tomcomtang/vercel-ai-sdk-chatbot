'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, User, RotateCcw, Copy, ArrowDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Chat() {
  const [input, setInput] = useState('')
  const [placeholderText, setPlaceholderText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [hideHomeScreen, setHideHomeScreen] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [typingAnimationStopped, setTypingAnimationStopped] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onError: (error) => {
      console.error('Chat error:', error)
    },
    onFinish: (message) => {
      console.log('Message finished:', message)
    }
  })

  // 拷贝消息内容到剪贴板
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      // 2秒后清除拷贝状态
      setTimeout(() => {
        setCopiedMessageId(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // 重新生成AI回答
  const regenerateResponse = (messageId?: string) => {
    if (status === 'ready') {
      regenerate({ messageId })
    }
  }

  // 调试：打印消息格式和状态
  useEffect(() => {
    if (messages.length > 0) {
      console.log('Frontend messages update:', {
        status,
        messagesCount: messages.length,
        lastMessage: messages[messages.length - 1]
      })
      messages.forEach((msg, index) => {
        console.log(`Message ${index}:`, {
          id: msg.id,
          role: msg.role,
          parts: msg.parts,
          partsContent: msg.parts?.map(p => p.type === 'text' ? p.text : p)
        })
      })
    }
  }, [messages, status])

  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, status])

  // 滚动检测 - 显示/隐藏回到底部按钮
  useEffect(() => {
    const handleScroll = () => {
      if (messages.length === 0) return
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // 如果距离底部超过100px，显示按钮
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      setShowScrollToBottom(distanceFromBottom > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [messages.length])

  // 快速回到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
              Chat with an intelligent AI assistant to get answers, creative inspiration, or engage in deep conversations. Supports multi-turn dialogue, making AI your smart companion.
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
                  handleInputFocus()
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none'
                }}
                rows={4}
                value={input}
                placeholder={`${placeholderText}${showCursor ? '|' : ''}`}
                onChange={(e) => setInput(e.target.value)}
                       disabled={status !== 'ready'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <button
                type="submit"
                       disabled={status !== 'ready' || !input.trim()}
                className="absolute bottom-4 right-4 w-10 h-10 bg-transparent hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200"
              >
                       {status !== 'ready' ? '...' : '↑'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className={`min-h-full transition-all duration-800 ease-in-out ${
          showChat ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          {/* 消息区域 - 让整个页面可以滚动 */}
          <div className="px-6 py-4 pb-44">
            <div className="w-full max-w-4xl mx-auto">
              <div className="space-y-4 mb-4">
              {/* 错误提示 */}
              {error && (
                <div className="mx-auto max-w-2xl">
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-red-400 text-sm">Connection error, please check your network or try again later</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="ml-auto text-red-400 hover:text-red-300 text-sm underline"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 消息列表 */}
              {messages.map((message, index) => (
                <div key={message.id}>
                  <div
                    className="flex items-start space-x-3 mx-auto"
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
                      {message.role === 'assistant' ? (
                        <div className="text-sm text-white">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // 简洁的样式
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 ml-4">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 ml-4">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                  <code className="bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                ) : (
                                  <code className="block bg-gray-800 p-3 rounded text-xs font-mono overflow-x-auto my-2">{children}</code>
                                );
                              },
                              pre: ({ children }) => <pre className="bg-gray-800 p-3 rounded overflow-x-auto my-2">{children}</pre>,
                              blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-600 pl-3 italic my-2">{children}</blockquote>,
                              table: ({ children }) => <table className="border-collapse border border-gray-600 my-2">{children}</table>,
                              th: ({ children }) => <th className="border border-gray-600 px-2 py-1 bg-gray-700 text-left">{children}</th>,
                              td: ({ children }) => <td className="border border-gray-600 px-2 py-1">{children}</td>,
                              a: ({ children, href }) => <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                            }}
                          >
                            {message.parts
                              ?.filter((part: any) => part.type === 'text')
                              ?.map((part: any) => part.text)
                              ?.join('') || ''}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap text-white">
                          {message.parts
                            ?.filter((part: any) => part.type === 'text')
                            ?.map((part: any) => part.text)
                            ?.join('') || ''}
                        </p>
                      )}
                      
                      {/* AI消息的操作按钮 */}
                      {message.role === 'assistant' && (
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => copyToClipboard(
                              message.parts
                                ?.filter((part: any) => part.type === 'text')
                                ?.map((part: any) => part.text)
                                ?.join('') || '',
                              message.id
                            )}
                            className={`p-1.5 rounded-lg border transition-all duration-200 ${
                              copiedMessageId === message.id
                                ? 'bg-green-800 border-green-600'
                                : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                            }`}
                            title={copiedMessageId === message.id ? "Copied!" : "Copy message"}
                          >
                            <Copy 
                              size={10} 
                              className={`transition-colors duration-200 ${
                                copiedMessageId === message.id
                                  ? 'text-green-400'
                                  : 'text-gray-400 hover:text-white'
                              }`} 
                            />
                          </button>
                          <button
                            onClick={() => regenerateResponse(message.id)}
                            disabled={status !== 'ready'}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Regenerate response"
                          >
                            <RotateCcw size={10} className="text-gray-400 hover:text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* AI加载状态 - 显示在最后一条用户消息下方 */}
                  {message.role === 'user' && 
                   index === messages.length - 1 && 
                   status !== 'ready' && (
                    <div className="flex items-center space-x-3 mx-auto mt-2" style={{ maxWidth: '720px' }}>
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-800 border border-gray-700 flex-shrink-0">
                        <Bot size={12} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          <span className="text-gray-400 text-sm ml-2">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              </div>
              {/* 滚动锚点 */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* 聊天状态的固定输入框 */}
      {messages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 px-6 py-4" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 100%)'
        }}>
          <div className="w-full mx-auto">
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
                placeholder="Enter your question or idea..."
                onChange={(e) => setInput(e.target.value)}
                disabled={status !== 'ready'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <button
                type="submit"
                disabled={status !== 'ready' || !input.trim()}
                className="absolute bottom-4 right-4 w-10 h-10 bg-transparent hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200"
              >
                {status !== 'ready' ? '...' : '↑'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 快速回到底部按钮 */}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-30 w-7 h-7 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center justify-center text-white transition-colors duration-200"
          title="Scroll to bottom"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  )
}

