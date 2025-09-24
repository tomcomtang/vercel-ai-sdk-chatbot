import { useChat } from '@ai-sdk/react'
import { useState } from 'react'

export function useChatLogic() {
  const [selectedModel, setSelectedModel] = useState('deepseek-chat')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [lastUserMessage, setLastUserMessage] = useState<string>('')

  // Wrap setSelectedModel with debug logging
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
      
      // Try to parse error information
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message)
          console.log('Parsed error data:', errorData)
          
          // Handle all types of errors
          if (errorData.error || errorData.message) {
            console.log('Setting error message:', errorData.message)
            setErrorMessage(errorData.message || 'An error occurred')
            return
          }
        } catch (e) {
          // If not JSON format, check if it contains API-related error information
          console.log('Non-JSON error:', error.message)
          
          // Check for common API error keywords
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
      
      // Default error message
      setErrorMessage('Connection error, please check your network or try again later')
    },
    onFinish: (message) => {
      console.log('Message finished:', message)
    }
  })

  // Send message
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

  // Regenerate response
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

  // Clear error
  const clearError = () => {
    setErrorMessage('')
    clearChatError()
  }

  // Clear last user message (for retry)
  const clearLastUserMessage = () => {
    console.log('clearLastUserMessage called, current messages:', messages.length)
    console.log('Messages:', messages.map(m => ({ role: m.role, content: (m.parts?.[0] as any)?.text || 'no text' })))
    
    // Find the last user message from back to front
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        console.log(`Found user message at index ${i}, removing it`)
        
        // Save user message content
        const userMessageText = (messages[i].parts?.[0] as any)?.text || ''
        console.log('clearLastUserMessage: saving user message:', userMessageText)
        setLastUserMessage(userMessageText)
        
        const newMessages = messages.slice(0, i)
        setMessages(newMessages)
        
        // If no messages left after deletion, return true to indicate need to return to home screen
        return newMessages.length === 0
      }
    }
    
    // If no user message found, return false
    return false
  }

  return {
    // State
    messages,
    status,
    error,
    selectedModel,
    setSelectedModel: handleModelChange,
    errorMessage,
    lastUserMessage,
    
    // Methods
    handleSendMessage,
    handleRegenerate,
    clearError,
    clearLastUserMessage,
  }
}
