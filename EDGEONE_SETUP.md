# EdgeOne Pages Action 设置指南

## 概述

本项目已配置为支持 EdgeOne Pages Action，使用 `onRequest` 入口函数来处理 AI 聊天 API 请求。该实现使用 `@ai-sdk/*` 包来调用各种 AI 服务，保持了与原始 Next.js API route 相同的功能和错误处理。

## 文件结构

```
functions/
└── api/
    └── chat/
        └── index.js          # EdgeOne Pages Action 入口
```

## 环境变量配置

在 EdgeOne Pages 控制台中设置以下环境变量：

### 必需的环境变量

- `DEEPSEEK_API_KEY` - DeepSeek API 密钥

### 可选的环境变量

- `ANTHROPIC_API_KEY` - Anthropic Claude API 密钥
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini API 密钥
- `OPENAI_API_KEY` - OpenAI API 密钥
- `XAI_API_KEY` - xAI Grok API 密钥

## 支持的模型

### DeepSeek 模型

- `deepseek-chat` - 强大的推理和编程能力
- `deepseek-reasoner` - 增强的推理能力

### Anthropic 模型

- `claude-3-5-sonnet-latest` - 最强大的复杂任务模型

### Google 模型

- `gemini-2.0-flash` - 最新一代增强能力模型

### OpenAI 模型

- `gpt-4o-mini` - 快速且经济高效

### xAI 模型

- `grok-3` - 高级推理和实时知识

## API 端点

- **URL**: `/functions/api/chat`
- **方法**: POST
- **Content-Type**: application/json

### 请求格式

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ]
}
```

### 请求头

- `X-Model`: 指定要使用的 AI 模型（可选，默认为 `deepseek-chat`）

## AI SDK 集成

本项目使用 Vercel AI SDK 的以下包：

- `@ai-sdk/deepseek` - DeepSeek 模型支持
- `@ai-sdk/anthropic` - Anthropic Claude 模型支持
- `@ai-sdk/google` - Google Gemini 模型支持
- `@ai-sdk/openai` - OpenAI GPT 模型支持
- `@ai-sdk/xai` - xAI Grok 模型支持
- `ai` - 核心 AI SDK 功能

EdgeOne Pages Action 使用标准的 ES6 模块导入来加载这些包。

## 部署步骤

1. 将代码上传到 EdgeOne Pages
2. 在控制台中配置环境变量
3. 部署项目
4. 访问前端页面开始使用

## 错误处理

API 会返回结构化的错误信息：

```json
{
  "error": "API_KEY_NOT_CONFIGURED",
  "message": "DeepSeek model is not supported, please try using other models or contact the website developer for feedback",
  "provider": "DeepSeek",
  "model": "deepseek-chat",
  "suggestion": "Please set DEEPSEEK_API_KEY in environment variables"
}
```

## 流式响应

API 支持流式响应，前端会实时显示 AI 的回复内容。

## 注意事项

1. 确保所有必要的环境变量都已正确设置
2. API 密钥需要有足够的配额
3. 某些模型可能需要特定的 API 访问权限
4. 建议在生产环境中设置适当的错误监控和日志记录
