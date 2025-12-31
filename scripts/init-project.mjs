#!/usr/bin/env node

/**
 * 项目初始化脚本
 * 用于在使用模板创建新项目后，快速配置项目名称和清理示例代码
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function updatePackageJson(projectName) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  packageJson.name = projectName;
  packageJson.version = '0.1.0';
  
  // 移除模板相关的私有标记（如果用户想发布的话）
  // packageJson.private = false;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ 已更新 package.json');
}

async function updateWranglerConfig(projectName) {
  const wranglerPath = path.join(rootDir, 'wrangler.jsonc');
  
  if (fs.existsSync(wranglerPath)) {
    let content = fs.readFileSync(wranglerPath, 'utf-8');
    // 更新 name 字段
    content = content.replace(
      /"name":\s*"[^"]*"/,
      `"name": "${projectName}"`
    );
    fs.writeFileSync(wranglerPath, content);
    console.log('✅ 已更新 wrangler.jsonc');
  }
}

async function cleanGitHistory() {
  const gitDir = path.join(rootDir, '.git');
  
  if (fs.existsSync(gitDir)) {
    // 如果用户通过 degit 创建，可能没有 .git 目录
    // 如果有，询问是否重新初始化
    const answer = await question('是否重新初始化 Git 仓库？(y/N): ');
    
    if (answer.toLowerCase() === 'y') {
      fs.rmSync(gitDir, { recursive: true, force: true });
      const { execSync } = await import('child_process');
      execSync('git init', { cwd: rootDir, stdio: 'inherit' });
      console.log('✅ 已重新初始化 Git 仓库');
    }
  } else {
    // 自动初始化 Git
    const { execSync } = await import('child_process');
    try {
      execSync('git init', { cwd: rootDir, stdio: 'inherit' });
      console.log('✅ 已初始化 Git 仓库');
    } catch {
      console.log('⚠️  无法初始化 Git 仓库，请手动执行 git init');
    }
  }
}

async function main() {
  console.log('\n🚀 Next.js Cloudflare Starter - 项目初始化\n');
  console.log('━'.repeat(50));
  
  // 获取项目名称
  const defaultName = path.basename(rootDir);
  const projectName = await question(`项目名称 (${defaultName}): `) || defaultName;
  
  // 验证项目名称
  const validName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
  
  if (validName !== projectName) {
    console.log(`📝 项目名称已规范化为: ${validName}`);
  }
  
  console.log('\n正在配置项目...\n');
  
  // 更新配置文件
  await updatePackageJson(validName);
  await updateWranglerConfig(validName);
  await cleanGitHistory();
  
  console.log('\n━'.repeat(50));
  console.log('\n🎉 项目初始化完成！\n');
  console.log('接下来你可以：');
  console.log('  1. pnpm dev        - 启动开发服务器');
  console.log('  2. pnpm cf-preview - 本地预览 Cloudflare 环境');
  console.log('  3. pnpm cf-deploy  - 部署到 Cloudflare Workers\n');
  
  rl.close();
}

main().catch((err) => {
  console.error('❌ 初始化失败:', err);
  rl.close();
  process.exit(1);
});
