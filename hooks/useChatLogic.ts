import { useChat } from '@ai-sdk/react'
import { useState } from 'react'

export function useChatLogic() {
  const [selectedModel, setSelectedModel] = useState('deepseek-chat')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [lastUserMessage, setLastUserMessage] = useState<string>('')

  // 包装 setSelectedModel 添加调试日志
  const handleModelChange = (model: string) => {
    console.log('=== MODEL CHANGE DEBUG ===')
    console.log('Model changed from', selectedModel, 'to', model)
    console.log('Current status:', status)
    console.log('Current messages length:', messages.length)
    console.log('Current error:', error)
    console.log('Current errorMessage:', errorMessage)
    console.log('========================')
    setSelectedModel(model)
  }

  const { messages, sendMessage, status, error, regenerate, setMessages, clearError: clearChatError } = useChat({
    onError: (error) => {
      console.error('Chat error:', error)
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      
      // 尝试解析错误信息
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message)
          console.log('Parsed error data:', errorData)
          
          // 处理所有类型的错误
          if (errorData.error || errorData.message) {
            console.log('Setting error message:', errorData.message)
            setErrorMessage(errorData.message || 'An error occurred')
            return
          }
        } catch (e) {
          // 如果不是JSON格式，检查是否包含API相关错误信息
          console.log('Non-JSON error:', error.message)
          
          // 检查常见的API错误关键词
          const errorMessage = error.message.toLowerCase()
          if (errorMessage.includes('api key') || errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
            setErrorMessage('API key is invalid or expired. Please check your API key configuration.')
          } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            setErrorMessage('API quota exceeded or rate limit reached. Please try again later.')
          } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            setErrorMessage('Network connection error. Please check your internet connection.')
          } else {
            setErrorMessage(error.message)
          }
        }
      } else {
        setErrorMessage('An unexpected error occurred')
      }
      
      // 默认错误信息
      setErrorMessage('Connection error, please check your network or try again later')
    },
    onFinish: (message) => {
      console.log('Message finished:', message)
    }
  })

  // 发送消息
  const handleSendMessage = (text: string) => {
    console.log('=== SEND MESSAGE DEBUG ===')
    console.log('Sending message with model:', selectedModel)
    console.log('Message text:', text)
    console.log('Current status:', status)
    console.log('========================')
    sendMessage({ text }, {
      headers: {
        'X-Model': selectedModel,
      }
    })
  }

  // 重新生成回答
  const handleRegenerate = (messageId?: string) => {
    if (status === 'ready') {
      console.log('Regenerating with model:', selectedModel)
      regenerate({ 
        messageId,
        headers: {
          'X-Model': selectedModel,
        }
      })
    }
  }

  // 清除错误
  const clearError = () => {
    setErrorMessage('')
    clearChatError()
  }

  // 清除最后一条用户消息（用于重试）
  const clearLastUserMessage = () => {
    console.log('clearLastUserMessage called, current messages:', messages.length)
    console.log('Messages:', messages.map(m => ({ role: m.role, content: (m.parts?.[0] as any)?.text || 'no text' })))
    
    // 从后往前找到最后一条用户消息
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        console.log(`Found user message at index ${i}, removing it`)
        
        // 保存用户消息内容
        const userMessageText = (messages[i].parts?.[0] as any)?.text || ''
        console.log('clearLastUserMessage: saving user message:', userMessageText)
        setLastUserMessage(userMessageText)
        
        const newMessages = messages.slice(0, i)
        setMessages(newMessages)
        
        // 如果删除后没有消息了，返回 true 表示需要回到首屏
        return newMessages.length === 0
      }
    }
    
    // 如果没有找到用户消息，返回 false
    return false
  }

  return {
    // 状态
    messages,
    status,
    error,
    selectedModel,
    setSelectedModel: handleModelChange,
    errorMessage,
    lastUserMessage,
    
    // 方法
    handleSendMessage,
    handleRegenerate,
    clearError,
    clearLastUserMessage,
  }
}
