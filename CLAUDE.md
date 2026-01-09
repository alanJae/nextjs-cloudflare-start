# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 **Next.js 15** 的全栈应用模板，专为部署到 **Cloudflare Workers** 优化。使用 **OpenNext** 适配器将 Next.js 应用转换为 Cloudflare Workers 兼容格式。

## 常用命令

### 开发和构建
```bash
pnpm dev           # 启动开发服务器（启用 Turbopack）
pnpm build         # 构建生产版本（包含 SEO 验证）
pnpm start         # 运行生产服务器（本地测试）
pnpm lint          # 运行 ESLint 代码检查
pnpm check-seo     # 单独运行 SEO 元数据长度验证
```

### Cloudflare 部署
```bash
pnpm cf-build      # 构建 Cloudflare Workers 版本（包含 SEO 验证）
pnpm cf-preview    # 本地预览 Workers 部署
pnpm cf-deploy     # 部署到 Cloudflare Workers
npx wrangler login # 首次部署前需要登录 Cloudflare
```

### shadcn/ui 组件
```bash
npx shadcn@latest add button   # 添加 UI 组件
npx shadcn@latest add dialog
npx shadcn@latest add form
```

### SEO 和搜索引擎索引
```bash
pnpm indexnow              # 提交所有页面到 Bing IndexNow API
pnpm indexnow --url=/zh    # 提交单个 URL
```

## 核心架构

### 国际化 (i18n) 架构

**关键配置文件：**
- `i18n.ts` - 定义支持的语言列表 (`['en', 'zh']`) 和默认语言 (`'en'`)
- `middleware.ts` - 使用 `next-intl/middleware` 处理语言路由
- `messages/en.json` 和 `messages/zh.json` - 翻译文件

**路由规则：**
- 英文（默认）: `/` （不带语言前缀）
- 中文: `/zh` （带 `/zh` 前缀）
- 配置 `localePrefix: 'as-needed'` 和 `localeDetection: false`，确保默认语言不显示前缀且不自动检测浏览器语言

**使用翻译：**
```tsx
// 服务器组件
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('namespace');

// 客户端组件
'use client';
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');
```

### 渲染模式

**强制 SSR（服务器端渲染）：**
- `app/[locale]/layout.tsx` 中设置了 `export const dynamic = 'force-dynamic'` 和 `export const revalidate = 0`
- 每次请求都会动态生成页面，不使用静态生成或 ISR
- 这是为了确保在 Cloudflare Workers 环境中正常工作

### Providers 嵌套结构

在 `app/[locale]/layout.tsx` 中，Providers 按以下顺序嵌套：
```tsx
<NextIntlClientProvider messages={messages}>
  <ThemeProvider>
    <Analytics />
    <Header />
    <main>{children}</main>
    <Footer />
  </ThemeProvider>
</NextIntlClientProvider>
```

- `NextIntlClientProvider` - 提供翻译上下文
- `ThemeProvider` (from next-themes) - 提供主题切换功能（明亮/暗黑模式）
- `Analytics` - 集成 Google Analytics、AdSense 和 Microsoft Clarity

### SEO 自动化

**构建时自动生成：**
- `app/sitemap.ts` - 动态生成 sitemap.xml，包含所有语言版本的页面
- `app/robots.ts` - 动态生成 robots.txt
- 使用环境变量 `NEXT_PUBLIC_APP_URL` 设置 base URL（默认 `https://example.com`）

**SEO 元数据验证：**
- 构建前自动运行 `scripts/validate-seo.mjs`
- 验证 `messages/*.json` 中的 `seo.title` (50-60 字符) 和 `seo.description` (140-150 字符)
- 如果验证失败，构建会中止

**搜索引擎索引提交：**
- 使用 `scripts/submit-indexnow.mjs` 提交 URL 到 Bing IndexNow API
- 首次运行会自动生成 API 密钥并保存到 `public/indexnow-key.txt`
- 密钥文件需要可通过 `https://yourdomain.com/indexnow-key.txt` 访问
- 支持环境变量 `INDEXNOW_KEY` 设置自定义密钥
- IndexNow 协议同时支持 Bing、Yandex 等多个搜索引擎

### Cloudflare Workers 适配

**关键配置：**
- `wrangler.jsonc` - Cloudflare Workers 配置，启用 `nodejs_compat` 标志
- `next.config.ts` - 集成 `next-intl` 插件
- 构建输出到 `.worker-next/` 目录
- 使用 `@opennextjs/cloudflare` 进行构建适配

**环境变量：**
- 在 `wrangler.jsonc` 的 `vars` 字段添加公开变量
- 使用 `npx wrangler secret put` 添加敏感信息（Secrets）

## 添加新翻译的流程

1. 在 `messages/en.json` 和 `messages/zh.json` 中添加翻译内容
2. **重要：JSON 字符串中的引号必须转义**（使用 `\"` 而不是 `"` 或 `""`）
3. 运行 `pnpm check-seo` 验证 SEO 元数据长度
4. 在组件中使用 `getTranslations` (服务器组件) 或 `useTranslations` (客户端组件)

## Analytics 配置

在环境变量中设置（仅在生产环境且配置了 ID 时生效）：
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

## 重要约束

- 单文件不超过 500 行，超过时拆解成多个文件
- JSON 文件中的引号必须转义为 `\"`
- 不使用 ISR 或静态生成，全部使用 SSR
- middleware 不匹配 `/api`、`/_next`、`/_vercel` 和静态文件路径
