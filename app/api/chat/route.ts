import { deepseek } from '@ai-sdk/deepseek'
import { streamText, convertToModelMessages, UIMessage } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 检查请求方法
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // 检查Content-Type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response('Content-Type must be application/json', { status: 400 });
    }

    // 解析请求体
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('JSON parse error:', error);
      return new Response('Invalid JSON', { status: 400 });
    }

    // 验证请求体结构
    if (!body || typeof body !== 'object') {
      return new Response('Request body must be an object', { status: 400 });
    }

    const { messages } = body;

    // 验证messages参数
    if (!messages) {
      return new Response('Missing messages parameter', { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return new Response('Messages must be an array', { status: 400 });
    }

    if (messages.length === 0) {
      return new Response('Messages array cannot be empty', { status: 400 });
    }

    // 验证每个消息的格式
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      
      if (!msg || typeof msg !== 'object') {
        return new Response(`Message at index ${i} must be an object`, { status: 400 });
      }

      if (!msg.role || typeof msg.role !== 'string') {
        return new Response(`Message at index ${i} must have a valid role`, { status: 400 });
      }

      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return new Response(`Message at index ${i} has invalid role: ${msg.role}`, { status: 400 });
      }

      // 检查消息内容
      const hasContent = msg.content || msg.text || (msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0);
      if (!hasContent) {
        return new Response(`Message at index ${i} must have content`, { status: 400 });
      }
    }

    console.log('Received messages:', messages);

    // 检查DeepSeek API密钥
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DeepSeek API key not configured');
      return new Response('AI service not configured', { status: 500 });
    }

    console.log(messages.map((msg: any) => msg.id));

    // 手动转换消息格式，确保符合 UIMessage 格式
    const uiMessages: UIMessage[] = messages.map((msg: any) => ({
      id: msg.id || Math.random().toString(36).substr(2, 9),
      role: msg.role,
      parts: msg.parts || [{ type: 'text', text: msg.content || msg.text || '' }]
    }));

    console.log('Converted UI messages:', uiMessages);

    // 获取模型配置
    const modelName = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    console.log('Using model:', modelName);

    const result = streamText({
      model: deepseek(modelName),
      system: 'You are an intelligent AI assistant dedicated to helping users. Please follow these principles:\n1. Provide accurate, useful, and concise answers\n2. Maintain a friendly and professional tone\n3. Be honest when uncertain about answers\n4. Support both Chinese and English communication\n5. Provide practical advice and solutions',
      messages: convertToModelMessages(uiMessages),
      maxOutputTokens: 1000,
      temperature: 0.7,
      onError: (error) => {
        console.error('DeepSeek API Error:', error);
      },
      onFinish: (result) => {
        console.log('DeepSeek Response finished:', {
          model: modelName,
          usage: result.usage,
          finishReason: result.finishReason
        });
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('API Error:', error);
    
    // 如果是配额不足或余额不足错误，返回友好的错误信息
    if (error?.error?.error?.code === 'insufficient_quota' || 
        error?.message?.includes('quota') || 
        error?.error?.message === 'Insufficient Balance' ||
        error?.message?.includes('Insufficient Balance')) {
      console.log('Balance/Quota exceeded, returning mock response');
      
      // 创建模拟的流式响应
      const mockResponse = new ReadableStream({
        start(controller) {
          const mockText = "Sorry, your DeepSeek API account has insufficient balance. Please recharge your account to continue using the service. Visit https://platform.deepseek.com/ to manage your account balance and payment settings.";
          
          // 模拟流式输出
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
          }, 50); // 每50ms输出一个字符
        }
      });
      
      return new Response(mockResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }
    
    // 其他错误返回通用错误信息
    return new Response('Internal Server Error', { status: 500 });
  }
}
