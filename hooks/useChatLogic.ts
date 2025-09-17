import { useChat } from '@ai-sdk/react'
import { useState } from 'react'

export function useChatLogic() {
  const [selectedModel, setSelectedModel] = useState('deepseek-chat')
  const [errorMessage, setErrorMessage] = useState<string>('')

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
            return
          } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            setErrorMessage('API quota exceeded or rate limit reached. Please try again later.')
            return
          } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            setErrorMessage('Network connection error. Please check your internet connection.')
            return
          }
        }
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
    console.log('Sending message with model:', selectedModel)
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
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      setMessages(messages.slice(0, -1))
    }
  }

  return {
    // 状态
    messages,
    status,
    error,
    selectedModel,
    setSelectedModel,
    errorMessage,
    
    // 方法
    handleSendMessage,
    handleRegenerate,
    clearError,
    clearLastUserMessage,
  }
}
