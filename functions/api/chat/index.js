import { deepseek } from '@ai-sdk/deepseek'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { xai } from '@ai-sdk/xai'
import { streamText, convertToModelMessages } from 'ai'

// Provider configuration
const PROVIDERS = {
  anthropic: { provider: anthropic, envKey: 'ANTHROPIC_API_KEY', prefixes: ['claude-'] },
  google: { provider: google, envKey: 'GOOGLE_GENERATIVE_AI_API_KEY', prefixes: ['gemini-', 'gemma-'] },
  deepseek: { provider: deepseek, envKey: 'DEEPSEEK_API_KEY', prefixes: ['deepseek-'] },
  openai: { provider: openai, envKey: 'OPENAI_API_KEY', prefixes: ['gpt-', 'o1', 'o3'] },
  xai: { provider: xai, envKey: 'XAI_API_KEY', prefixes: ['grok-'] }
}

// Helper to find provider based on model name
const findProvider = (model) => {
  for (const [name, config] of Object.entries(PROVIDERS)) {
    if (config.prefixes.some(prefix => model.startsWith(prefix))) {
      return { name, ...config };
    }
  }
  return null;
}

// Helper to create consistent error responses
const createErrorResponse = (error, message, provider, model, suggestion) => {
  return new Response(JSON.stringify({ 
    error, 
    message, 
    provider, 
    model, 
    suggestion 
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Validate request method and content type
const validateRequest = (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return new Response('Unsupported Content-Type', { status: 415 });
  }

  return null;
}

// Validate messages array
const validateMessages = (messages) => {
  if (!messages || !Array.isArray(messages)) {
    return new Response('Invalid request body: messages array is required', { status: 400 });
  }
  if (messages.length === 0) {
    return new Response('Messages array cannot be empty', { status: 400 });
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== 'object' || !msg.role || typeof msg.role !== 'string' || !['user', 'assistant', 'system'].includes(msg.role)) {
      return new Response(`Message at index ${i} must be a valid object with a role`, { status: 400 });
    }
    const hasContent = msg.content || msg.text || (msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0);
    if (!hasContent) {
      return new Response(`Message at index ${i} must have content`, { status: 400 });
    }
  }

  return null;
}

// Convert messages to UI format
const convertToUIMessages = (messages) => {
  return messages.map((msg) => ({
    id: msg.id || Math.random().toString(36).substr(2, 9),
    role: msg.role,
    parts: msg.parts || [{ type: 'text', text: msg.content || msg.text || '' }]
  }));
}

// Generate AI response using streamText
const generateAIResponse = async (providerConfig, selectedModel, uiMessages) => {
  const result = await streamText({
    model: providerConfig.provider(selectedModel),
    system: 'You are an intelligent AI assistant dedicated to helping users. Please follow these principles:\n1. Provide accurate, useful, and concise answers\n2. Maintain a friendly and professional tone\n3. Be honest when uncertain about answers\n4. Support both Chinese and English communication\n5. Provide practical advice and solutions',
    messages: convertToModelMessages(uiMessages),
    maxOutputTokens: 1000,
    temperature: 0.7,
    onError: (error) => {
      console.error('AI API Error:', error);
    },
    onFinish: (result) => {
      console.log('AI Response finished:', {
        provider: providerConfig.name,
        model: selectedModel,
        usage: result.usage,
        finishReason: result.finishReason
      });
    }
  });

  return result.toUIMessageStreamResponse();
}

// Handle API errors
const handleAPIError = (error, selectedModel) => {
  console.error('API Error:', error);
  
  // Handle API key errors
  if (error?.error?.error?.code === 'invalid_api_key' || 
      error?.message?.includes('invalid_api_key') ||
      error?.message?.includes('authentication') ||
      error?.message?.includes('unauthorized') ||
      error?.message?.includes('API key')) {
    
    return createErrorResponse(
      'INVALID_API_KEY',
      'API key is invalid or expired. Please check your API key configuration.',
      'Unknown',
      selectedModel,
      'Please verify your API key is correct and not expired'
    );
  }
  
  // Handle quota/balance errors
  if (error?.error?.error?.code === 'insufficient_quota' || 
      error?.message?.includes('quota') || 
      error?.error?.message === 'Insufficient Balance' ||
      error?.message?.includes('Insufficient Balance')) {
    
    const mockResponse = new ReadableStream({
      start(controller) {
        const mockText = "Sorry, your AI API account has insufficient balance. Please recharge your account to continue using the service.";
        const words = mockText.split('');
        let index = 0;
        
        const interval = setInterval(() => {
          if (index < words.length) {
            controller.enqueue(new TextEncoder().encode(`data: {"type":"text-delta","id":"0","delta":"${words[index]}"}\n\n`));
            index++;
          } else {
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
            clearInterval(interval);
          }
        }, 50);
      }
    });
    
    return new Response(mockResponse, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
  
  // Handle rate limit errors
  if (error?.error?.error?.code === 'rate_limit_exceeded' || 
      error?.message?.includes('rate_limit') ||
      error?.message?.includes('too many requests')) {
    
    return createErrorResponse(
      'RATE_LIMIT_EXCEEDED',
      'API rate limit exceeded. Please try again later.',
      'Unknown',
      selectedModel,
      'Please wait a moment before making another request'
    );
  }
  
  return new Response('Internal Server Error', { status: 500 });
}

export async function onRequest({ request, env }) {
  try {
    // 删除 accept-encoding 头以避免压缩问题
    request.headers.delete('accept-encoding');
    
    // 验证请求
    const validationError = validateRequest(request);
    if (validationError) return validationError;

    // 解析和验证请求体
    const body = await request.json();
    const { messages } = body;
    const selectedModel = request.headers.get('X-Model') || 'deepseek-chat';

    const messagesError = validateMessages(messages);
    if (messagesError) return messagesError;

    console.log('Received messages:', messages);
    console.log('Selected model:', selectedModel);

    // 转换消息为 UI 格式
    const uiMessages = convertToUIMessages(messages);
    console.log('Converted UI messages:', uiMessages);

    // 查找对应的 provider
    const providerConfig = findProvider(selectedModel);
    if (!providerConfig) {
      return createErrorResponse(
        'UNSUPPORTED_MODEL',
        `${selectedModel} model is not supported, please try using other models or contact the website developer for feedback`,
        'Unknown',
        selectedModel,
        'Please select a supported model'
      );
    }

    // 验证 API 密钥
    const apiKey = env[providerConfig.envKey];
    if (!apiKey) {
      return createErrorResponse(
        'API_KEY_NOT_CONFIGURED',
        `${providerConfig.name} model is not supported, please try using other models or contact the website developer for feedback`,
        providerConfig.name,
        selectedModel,
        `Please set ${providerConfig.envKey} in environment variables`
      );
    }

    console.log('Using provider:', providerConfig.name);
    console.log('Using model:', selectedModel);

    // 生成 AI 响应
    return await generateAIResponse(providerConfig, selectedModel, uiMessages);

  } catch (error) {
    return handleAPIError(error, selectedModel);
  }
}