# Test Edge Start

基于 **Next.js 15** 的现代化全栈应用，专为部署到 **Cloudflare Workers** 优化，实现全球边缘计算的高性能体验。

## ✨ 技术栈

- **框架**: [Next.js 15](https://nextjs.org) (App Router + Turbopack)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com) (基于 Radix UI)
- **样式**: [Tailwind CSS](https://tailwindcss.com) v4
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes) (深色模式)
- **国际化**: [next-intl](https://next-intl.dev) (支持英文/中文)
- **语言**: TypeScript
- **包管理器**: pnpm
- **部署平台**: Cloudflare Workers (通过 OpenNext 适配器)
- **验证库**: Zod

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 3. 添加 UI 组件（按需）

```bash
# 添加 shadcn/ui 组件
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

## 🌐 国际化功能

项目支持英文和中文两种语言，采用服务器端渲染（SSR）确保最佳性能和 SEO。

### 路由规则

| 语言 | URL | 说明 |
|------|-----|------|
| 英文（默认） | `/` | 不带语言前缀 |
| 中文 | `/zh` | 带 `/zh` 前缀 |

### 特性

- ✅ **默认英文**：访问 `/` 始终显示英文，不会根据浏览器语言自动切换
- ✅ **手动切换**：页面右上角有语言切换按钮
- ✅ **主题切换**：支持明亮/暗黑模式切换（基于 next-themes）
- ✅ **服务器端渲染**：所有翻译在服务器端完成，SEO 友好
- ✅ **URL 同步**：切换语言时 URL 自动更新

### 添加新的翻译

编辑以下文件添加翻译内容：
- `messages/en.json` - 英文翻译
- `messages/zh.json` - 中文翻译

在组件中使用翻译：

```tsx
// 服务器组件
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('namespace');
  return <h1>{t('title')}</h1>;
}

// 客户端组件
'use client';
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('namespace');
  return <h1>{t('title')}</h1>;
}
```

## 📂 项目结构

```
├── app/
│   ├── [locale]/           # 国际化路由
│   │   ├── layout.tsx      # 语言布局（集成各种 Providers）
│   │   └── page.tsx        # 首页
│   ├── globals.css         # 全局样式
│   └── layout.tsx          # 根布局
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   ├── LanguageSwitcher.tsx # 语言切换组件
│   ├── mode-toggle.tsx     # 主题切换组件
│   └── theme-provider.tsx  # 主题 Provider
├── messages/
│   ├── en.json             # 英文翻译
│   └── zh.json             # 中文翻译
├── lib/
│   └── utils.ts            # 工具函数
├── i18n.ts                 # 国际化配置
├── middleware.ts           # 语言路由中间件
├── next.config.ts          # Next.js 配置
└── wrangler.jsonc          # Cloudflare 配置
```

## 📦 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（启用 Turbopack） |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 运行生产服务器（本地） |
| `pnpm lint` | 运行 ESLint 代码检查 |
| `pnpm cf-build` | 构建 Cloudflare Workers 版本 |
| `pnpm cf-preview` | 本地预览 Workers 部署 |
| `pnpm cf-deploy` | 部署到 Cloudflare Workers |

## 🌍 部署到 Cloudflare

### 首次部署

1. **登录 Cloudflare 账号**
   ```bash
   npx wrangler login
   ```

2. **构建并部署**
   ```bash
   pnpm cf-deploy
   ```

3. **访问你的应用**
   部署成功后，Wrangler 会输出你的应用 URL（通常是 `https://test-edge-start.<your-subdomain>.workers.dev`）

### 本地预览 Workers 环境

在部署前，你可以在本地测试 Cloudflare Workers 环境：

```bash
pnpm cf-preview
```

## 🔧 项目配置

### Cloudflare 配置

- **wrangler.jsonc**: Cloudflare Workers 的核心配置文件
- 已启用 `nodejs_compat` 标志，支持 Node.js API
- 构建产物输出到 `.worker-next/` 目录

### 环境变量

如需使用环境变量，在 `wrangler.jsonc` 中添加：

```jsonc
{
  "vars": {
    "NEXT_PUBLIC_API_URL": "https://api.example.com"
  }
}
```

或者使用 Cloudflare Secrets（推荐用于敏感信息）：

```bash
npx wrangler secret put DATABASE_URL
```

## 📚 了解更多

### Next.js 资源
- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js 15 新特性](https://nextjs.org/blog/next-15)
- [App Router 指南](https://nextjs.org/docs/app)

### 国际化资源
- [next-intl 官方文档](https://next-intl.dev)
- [服务器/客户端组件用法](https://next-intl.dev/docs/environments/server-client-components)

### shadcn/ui 资源
- [shadcn/ui 组件库](https://ui.shadcn.com)
- [Radix UI 文档](https://radix-ui.com)

### Cloudflare 资源
- [OpenNext Cloudflare 适配器](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

## 💡 架构说明

本项目使用 **OpenNext** 适配器将 Next.js 应用转换为 Cloudflare Workers 兼容格式。

### 核心特性

- ✅ 完整的 Node.js API 支持（通过 `nodejs_compat`）
- ✅ 所有 Next.js 15 功能（ISR、PPR、Server Actions 等）
- ✅ 服务器端渲染（SSR），每次请求动态生成页面
- ✅ 支持国际化（i18n），无需客户端 JavaScript 加载翻译

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT
