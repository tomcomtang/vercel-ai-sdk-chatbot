# AI Chatbot with Vercel AI SDK

一个基于 Next.js 的 AI 聊天机器人项目，使用 Vercel AI SDK 和 AI SDK UI 构建。

## 功能特性

- 🤖 使用 Vercel AI SDK 调用 OpenAI GPT 模型
- 💬 现代化的聊天界面，支持实时对话
- 🎨 使用 Tailwind CSS 构建美观的 UI
- 📱 响应式设计，支持移动端和桌面端
- ⚡ 基于 Next.js 14 App Router 架构
- 🔄 支持流式响应，实时显示 AI 回复

## 项目结构

```
├── app/
│   ├── api/chat/route.ts          # API 路由，处理 AI 对话
│   ├── page.tsx                   # 基础聊天页面
│   ├── chat/page.tsx              # 标准聊天页面
│   ├── advanced-chat/page.tsx     # 高级聊天页面
│   ├── layout.tsx                 # 根布局
│   └── globals.css                # 全局样式
├── package.json                   # 项目依赖
├── tailwind.config.js            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
└── next.config.js                # Next.js 配置
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 文件为 `.env.local`：

```bash
cp env.example .env.local
```

在 `.env.local` 中配置你的 OpenAI API 密钥：

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 页面说明

- `/` - 基础聊天页面
- `/chat` - 标准聊天页面，包含更好的 UI 设计
- `/advanced-chat` - 高级聊天页面，包含更多功能和美观的界面

## 技术栈

- **Next.js 14** - React 框架
- **Vercel AI SDK** - AI 集成
- **OpenAI** - AI 模型提供商
- **Tailwind CSS** - CSS 框架
- **TypeScript** - 类型安全
- **Lucide React** - 图标库

## API 接口

### POST /api/chat

处理聊天消息的 API 端点。

**请求体：**

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

**响应：**
流式响应，返回 AI 的回复。

## 开发

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

### 代码检查

```bash
npm run lint
```

## 部署

这个项目可以轻松部署到 Vercel：

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

## 许可证

MIT License
