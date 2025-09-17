'use client'

import { ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export interface ModelOption {
  id: string
  name: string
  provider: string
  description: string
}

const modelOptions: ModelOption[] = [
  // DeepSeek Models (优先显示)
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    description: 'Strong reasoning and coding abilities'
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'DeepSeek',
    description: 'Enhanced reasoning capabilities'
  },
  
  // Anthropic Models
  {
    id: 'claude-3-5-sonnet-latest',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Most capable model for complex tasks'
  },
  
  // Google Models
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Latest generation with enhanced capabilities'
  },
  
  // OpenAI Models
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Fast and cost-effective'
  },
  
  // xAI Models
  {
    id: 'grok-3',
    name: 'Grok-3',
    provider: 'xAI',
    description: 'Advanced reasoning and real-time knowledge'
  }
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  disabled?: boolean
}

export default function ModelSelector({ selectedModel, onModelChange, disabled = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selectedOption = modelOptions.find(option => option.id === selectedModel) || modelOptions[0]
  
  const handleModelSelect = (modelId: string) => {
    console.log('ModelSelector: Selected model:', modelId)
    onModelChange(modelId)
    setIsOpen(false)
  }

  // 点击空白处关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center space-x-2 px-3 py-2 text-white text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-300"
      >
        <span className="font-medium">{selectedOption.name}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-black border border-gray-500 rounded-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Select AI Model</div>
            {modelOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleModelSelect(option.id)}
                className={`w-full text-left px-3 py-2 transition-colors duration-200 ${
                  selectedModel === option.id
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{option.name}</span>
                    <span className="text-xs text-gray-500">{option.provider}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{option.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}