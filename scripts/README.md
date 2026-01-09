# Scripts 目录

本目录包含项目的自动化脚本。

## 📜 可用脚本

### 1. `validate-seo.mjs` - SEO 元数据验证

验证翻译文件中的 SEO 元数据长度是否符合最佳实践。

**使用方法：**
```bash
pnpm check-seo
```

**验证规则：**
- `seo.title`: 50-60 字符
- `seo.description`: 140-150 字符

**特点：**
- 构建前自动运行
- 验证失败会中止构建
- 帮助确保 SEO 元数据符合搜索引擎最佳实践

---

### 2. `submit-indexnow.mjs` - Bing IndexNow 提交

将站点 URL 提交到 Bing IndexNow API，加速搜索引擎索引。

**使用方法：**
```bash
# 提交所有页面
pnpm indexnow

# 提交单个 URL
pnpm indexnow --url=/zh
pnpm indexnow --url=https://yourdomain.com/zh
```

**环境变量：**
- `NEXT_PUBLIC_APP_URL` - 网站 URL（必填）
- `INDEXNOW_KEY` - IndexNow API 密钥（可选，会自动生成）

**工作流程：**

1. **首次运行**
   - 自动生成 32 位十六进制密钥
   - 保存到 `public/indexnow-key.txt`
   - 提示确保密钥文件可通过 URL 访问

2. **后续运行**
   - 读取已保存的密钥
   - 收集所有需要索引的 URL
   - 批量提交到 IndexNow API

3. **使用环境变量**（可选）
   ```bash
   # .env.local
   INDEXNOW_KEY=your-custom-key-here
   ```
   - 如果设置了环境变量，优先使用环境变量中的密钥
   - 同时会在 `public/` 目录创建密钥文件供 Bing 验证

**支持的搜索引擎：**
- Bing
- Yandex
- 其他支持 IndexNow 协议的搜索引擎

**最佳实践：**
- 在每次内容更新或部署后运行
- 确保 `public/indexnow-key.txt` 已提交到版本控制或部署到生产环境
- 密钥文件必须可通过 `https://yourdomain.com/indexnow-key.txt` 访问

**注意事项：**
- IndexNow API 返回 200 或 202 表示成功
- 密钥文件是公开的，不包含敏感信息
- 建议将密钥文件提交到 Git，确保部署后可访问

---

### 3. `init-project.mjs` - 项目初始化

用于在使用模板创建新项目后，快速配置项目名称和清理示例代码。

**使用方法：**
```bash
pnpm init-project
```

**功能：**
- 更新 `package.json` 中的项目名称
- 更新 `wrangler.jsonc` 中的 Workers 名称
- 可选择重新初始化 Git 仓库

**使用场景：**
- 通过 `degit` 或 GitHub 模板创建新项目后
- 需要批量修改项目配置时

---

## 🔧 开发新脚本

### 脚本规范

1. **文件命名**：使用 `.mjs` 扩展名（ES Modules）
2. **Shebang**：添加 `#!/usr/bin/env node`
3. **可执行权限**：`chmod +x scripts/your-script.mjs`
4. **注释文档**：在文件头部添加详细的使用说明

### 示例模板

```javascript
#!/usr/bin/env node

/**
 * 脚本名称
 *
 * 用途：简要描述
 *
 * 使用方法：
 *   pnpm script-name
 *
 * 环境变量：
 *   VAR_NAME - 变量说明
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  console.log('🚀 脚本开始执行...\n');
  // 你的逻辑
}

main().catch((err) => {
  console.error('❌ 执行失败:', err);
  process.exit(1);
});
```

### 添加到 package.json

```json
{
  "scripts": {
    "your-script": "node scripts/your-script.mjs"
  }
}
```

---

## 📚 相关资源

- [IndexNow 协议文档](https://www.bing.com/indexnow)
- [Node.js ES Modules](https://nodejs.org/api/esm.html)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
