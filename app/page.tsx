'use client'

import { useState, useEffect } from 'react'
import { useChatLogic } from '@/hooks/useChatLogic'
import { useScrollLogic } from '@/hooks/useScrollLogic'
import HomeScreen from '@/components/HomeScreen'
import MessageList from '@/components/MessageList'
import ChatInput from '@/components/ChatInput'
import ErrorMessage from '@/components/ErrorMessage'
import ScrollToBottomButton from '@/components/ScrollToBottomButton'

export default function Chat() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [hideHomeScreen, setHideHomeScreen] = useState(false)
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)

  // 使用自定义 hooks
  const {
    messages,
    status,
    error,
    selectedModel,
    setSelectedModel,
    errorMessage,
    lastUserMessage,
    handleSendMessage,
    handleRegenerate,
    clearError,
    clearLastUserMessage,
  } = useChatLogic()

  const { showScrollToBottom, scrollToBottom, messagesEndRef } = useScrollLogic(messages.length, status)

  // 调试：监听 lastUserMessage 变化
  useEffect(() => {
    console.log('page.tsx: lastUserMessage changed to:', lastUserMessage)
  }, [lastUserMessage])

  // 处理消息发送
  const handleMessageSubmit = (text: string) => {
    handleSendMessage(text)
    setShowChat(true)
    setIsTransitioning(false)
    // 再延迟一点时间隐藏首屏，确保动画完成
    setTimeout(() => {
      setHideHomeScreen(true)
    }, 100)
  }

  // 处理过渡开始
  const handleTransitionStart = () => {
    setIsTransitioning(true)
  }

  // 处理重试
  const handleRetry = () => {
    console.log('handleRetry called, lastUserMessage before:', lastUserMessage)
    clearError()
    const shouldGoToHome = clearLastUserMessage()
    console.log('handleRetry: lastUserMessage after:', lastUserMessage)
    
    // 只有当删除后没有消息了，才回到初始屏幕
    if (shouldGoToHome) {
      setHideHomeScreen(false)
      setIsTransitioning(false)
      setShowChat(false)
    }
  }

  return (
    <div className="w-full max-w-4xl h-full mx-auto px-6 py-4">
      {/* 初始屏幕标题和描述 */}
      {messages.length === 0 && !hideHomeScreen ? (
        <HomeScreen
          onSubmit={handleMessageSubmit}
          status={status}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          isTransitioning={isTransitioning}
          onTransitionStart={handleTransitionStart}
          initialValue={lastUserMessage}
          onModelSelectorOpenChange={setIsModelSelectorOpen}
        />
      ) : (
        <div className={`min-h-full transition-all duration-800 ease-in-out ${
          showChat ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          {/* 消息区域 - 让整个页面可以滚动 */}
          <div className="px-6 py-4 pb-48">
            <div className="w-full max-w-4xl mx-auto">
              {/* 消息列表 */}
              <MessageList
                messages={messages}
                status={status}
                onRegenerate={handleRegenerate}
              />
            </div>
          </div>
          
        </div>
      )}

      {/* 错误提示 - 固定在输入框上方 */}
      {errorMessage && messages.length > 0 && !isModelSelectorOpen && (
        <div className="fixed left-0 right-0 z-10 px-6" style={{ bottom: '155px' }}>
          <div className="w-full max-w-4xl mx-auto">
            <ErrorMessage
              errorMessage={errorMessage}
              onRetry={handleRetry}
            />
          </div>
        </div>
      )}

      {/* 固定输入框用于聊天状态 */}
      {messages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 px-6 py-4" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 100%)'
        }}>
          <div className="w-full mx-auto">
            <ChatInput
              key={`chat-${lastUserMessage}`}
              onSubmit={handleSendMessage}
              status={status}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              initialValue={lastUserMessage}
              onModelSelectorOpenChange={setIsModelSelectorOpen}
            />
          </div>
        </div>
      )}

      {/* 滚动到底部按钮 */}
      <ScrollToBottomButton
        show={showScrollToBottom}
        onClick={scrollToBottom}
      />

      {/* 消息结束引用，用于自动滚动 */}
      <div ref={messagesEndRef} />
    </div>
  )
}