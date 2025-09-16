# AI Chatbot - 基于 Vercel AI SDK 的智能聊天机器人

一个现代化的 AI 聊天机器人，使用 Next.js 14、Vercel AI SDK 和 Tailwind CSS 构建，具有优雅的暗黑主题和流畅的动画效果。

## ✨ 特性

- 🤖 **智能对话**: 基于 OpenAI GPT 模型的智能对话
- 🎨 **现代 UI**: 暗黑主题设计，SVG 背景，流畅动画
- ⚡ **实时流式**: 支持实时流式响应，提升用户体验
- 📱 **响应式**: 完全响应式设计，支持各种设备
- 🎭 **动画效果**: 打字机动画、页面过渡、光晕效果
- 🔧 **可配置**: 支持多种 AI 模型和参数配置
- 🛡️ **错误处理**: 完善的错误处理和重试机制

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/tomcomtang/vercel-ai-sdk-chatbot.git
cd vercel-ai-sdk-chatbot
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，添加你的 OpenAI API 密钥：

```env
# OpenAI API Key (必需)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom model (可选)
OPENAI_MODEL=gpt-3.5-turbo
```

### 4. 获取 OpenAI API 密钥

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 登录你的账户
3. 创建新的 API 密钥
4. 将密钥复制到 `.env.local` 文件中

### 5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **AI SDK**: Vercel AI SDK v5
- **AI 模型**: OpenAI GPT-3.5-turbo/GPT-4
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **语言**: TypeScript
- **部署**: Vercel

## 📁 项目结构

```
vercel-ai-sdk-chatbot/
├── app/
│   ├── api/chat/route.ts    # AI聊天API路由
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
├── components/
│   ├── Navigation.tsx       # 导航栏组件
│   └── SVGBackground.tsx    # SVG背景组件
├── env.example              # 环境变量示例
├── package.json             # 项目配置
└── README.md                # 项目说明
```

## ⚙️ 配置选项

### 环境变量

| 变量名                | 必需 | 默认值                      | 说明            |
| --------------------- | ---- | --------------------------- | --------------- |
| `OPENAI_API_KEY`      | ✅   | -                           | OpenAI API 密钥 |
| `OPENAI_MODEL`        | ❌   | `gpt-3.5-turbo`             | AI 模型名称     |
| `OPENAI_BASE_URL`     | ❌   | `https://api.openai.com/v1` | API 基础 URL    |
| `OPENAI_ORGANIZATION` | ❌   | -                           | 组织 ID         |

### 支持的模型

- `gpt-3.5-turbo` (推荐，性价比高)
- `gpt-4` (更智能，成本较高)
- `gpt-4-turbo-preview` (最新功能)

## 🎨 自定义

### 修改 AI 行为

编辑 `app/api/chat/route.ts` 中的 `system` 提示词：

```typescript
system: `你是一个智能AI助手，专门为用户提供帮助。请遵循以下原则：
1. 回答要准确、有用、简洁
2. 保持友好和专业的语调
3. 如果不确定答案，请诚实说明
4. 支持中文和英文交流
5. 提供实用的建议和解决方案`;
```

### 调整 AI 参数

```typescript
const result = await streamText({
  model: openai(modelName),
  messages,
  system: systemPrompt,
  maxTokens: 1000, // 最大输出token数
  temperature: 0.7, // 创造性 (0-1)
  // ... 其他参数
});
```

### 自定义样式

项目使用 Tailwind CSS，你可以：

1. 修改 `app/globals.css` 中的全局样式
2. 调整 `components/SVGBackground.tsx` 中的背景
3. 更新 `app/page.tsx` 中的组件样式

## 🚀 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量 `OPENAI_API_KEY`
4. 部署完成

### 其他平台

项目支持部署到任何支持 Next.js 的平台：

- Netlify
- Railway
- Render
- 自托管服务器

## 🔧 开发

### 添加新功能

1. **工具调用**: 在 `streamText` 中添加 `tools` 参数
2. **多模型支持**: 扩展环境变量和模型选择
3. **用户认证**: 集成 NextAuth.js
4. **数据持久化**: 添加数据库支持

### 调试

启用详细日志：

```typescript
onError: (error) => {
  console.error('AI API Error:', error)
},
onFinish: (result) => {
  console.log('AI Response finished:', {
    model: modelName,
    usage: result.usage,
    finishReason: result.finishReason
  })
}
```

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请：

1. 查看 [Issues](https://github.com/tomcomtang/vercel-ai-sdk-chatbot/issues)
2. 创建新的 Issue
3. 联系维护者

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
