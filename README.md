# Next.js Cloudflare Starter

基于 **Next.js 15** 的现代化全栈应用模板，专为部署到 **Cloudflare Workers** 优化，实现全球边缘计算的高性能体验。

> 🎯 这是一个**项目模板**，你可以用它快速初始化新的 Next.js + Cloudflare 项目！

## 📥 使用此模板创建新项目

### 方式一：使用 degit（推荐）

最快速的方式，不包含 Git 历史记录：

```bash
# 使用 npx
npx degit alanJae/nextjs-cloudflare-start my-new-project

# 或者使用 pnpm
pnpm dlx degit alanJae/nextjs-cloudflare-start my-new-project

# 进入项目并安装依赖
cd my-new-project
pnpm install

# 初始化新项目（可选，更新项目名称等）
pnpm init-project
```

### 方式二：使用 GitHub 模板按钮

1. 访问 [GitHub 仓库](https://github.com/alanJae/nextjs-cloudflare-start)
2. 点击绿色的 **"Use this template"** 按钮
3. 选择 **"Create a new repository"**
4. 克隆你的新仓库并开始开发

### 方式三：使用 GitHub CLI

```bash
gh repo create my-new-project --template alanJae/nextjs-cloudflare-start --clone
cd my-new-project
pnpm install
```

---

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
| `pnpm check-seo` | 验证 SEO 元数据长度 |
| `pnpm indexnow` | 提交所有页面到 Bing IndexNow API |

## 🔍 SEO 优化

### 自动生成 Sitemap 和 Robots.txt

项目在**构建时自动生成** `sitemap.xml` 和 `robots.txt`，无需安装额外的包。

- **Sitemap**: `/sitemap.xml` - 包含所有语言版本的页面
- **Robots.txt**: `/robots.txt` - 指向 sitemap 并配置爬虫规则

访问示例：
- https://your-domain.com/sitemap.xml
- https://your-domain.com/robots.txt

### 配置 Base URL

在环境变量中设置你的网站 URL：

```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

如未设置，默认使用 `https://example.com`。

### SEO 元数据验证

构建前会自动验证翻译文件中的 SEO 元数据长度：
- **Title**: 50-60 字符
- **Description**: 100-200 字符

配置文件：`scripts/validate-seo.mjs`

### 搜索引擎索引提交

使用 **Bing IndexNow** 协议快速通知搜索引擎你的内容更新：

```bash
# 提交所有页面
pnpm indexnow

# 提交单个 URL
pnpm indexnow --url=/zh
```

**配置说明：**

1. 首次运行会自动生成 API 密钥并保存到 `public/indexnow-key.txt`
2. 确保密钥文件可通过 `https://yourdomain.com/indexnow-key.txt` 访问
3. （可选）使用环境变量设置自定义密钥：
   ```bash
   INDEXNOW_KEY=your-custom-key-here
   ```

**支持的搜索引擎：**
- Bing
- Yandex
- 其他支持 IndexNow 协议的搜索引擎

> 💡 建议在每次内容更新或部署后运行此命令，以加速搜索引擎索引。

### Analytics & Ads 配置

支持 Google Analytics, Google AdSense 和 Microsoft Clarity。仅在**生产环境**且配置了对应 ID 时生效。

```bash
# .env.local 或 Cloudflare 环境变量
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

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
