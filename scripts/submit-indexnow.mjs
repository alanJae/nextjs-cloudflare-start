#!/usr/bin/env node

/**
 * Bing IndexNow 提交脚本
 *
 * 用途：将站点 URL 提交到 Bing IndexNow API，加速索引
 *
 * 使用方法：
 *   pnpm indexnow              - 提交所有页面
 *   pnpm indexnow --url=/zh    - 提交单个 URL
 *
 * 环境变量：
 *   NEXT_PUBLIC_APP_URL - 网站 URL（必填）
 *   INDEXNOW_KEY        - IndexNow API 密钥（可选，会自动生成）
 *
 * 文档：https://www.bing.com/indexnow
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// IndexNow API 端点
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// 配置
const CONFIG = {
  keyLocation: path.join(rootDir, 'public'),
  keyFileName: 'indexnow-key.txt',
};

/**
 * 获取或生成 IndexNow API 密钥
 */
function getOrCreateApiKey() {
  const keyPath = path.join(CONFIG.keyLocation, CONFIG.keyFileName);

  // 优先使用环境变量
  if (process.env.INDEXNOW_KEY) {
    console.log('📌 使用环境变量中的 INDEXNOW_KEY');

    // 确保 public 目录下也有密钥文件（Bing 需要验证）
    if (!fs.existsSync(keyPath)) {
      fs.writeFileSync(keyPath, process.env.INDEXNOW_KEY);
      console.log(`✅ 已创建密钥文件: ${CONFIG.keyFileName}`);
    }

    return process.env.INDEXNOW_KEY;
  }

  // 如果文件已存在，直接读取
  if (fs.existsSync(keyPath)) {
    const key = fs.readFileSync(keyPath, 'utf-8').trim();
    console.log('📌 使用已存在的密钥文件');
    return key;
  }

  // 生成新密钥（32 字符十六进制）
  const newKey = crypto.randomBytes(16).toString('hex');
  fs.writeFileSync(keyPath, newKey);
  console.log(`✅ 已生成新密钥并保存到: ${CONFIG.keyFileName}`);
  console.log(`⚠️  请将此文件提交到版本控制，并确保部署后可通过以下 URL 访问：`);
  console.log(`   ${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/${CONFIG.keyFileName}`);

  return newKey;
}

/**
 * 获取所有需要提交的 URL
 */
function getAllUrls(customUrl = null) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    console.error('❌ 错误：未设置 NEXT_PUBLIC_APP_URL 环境变量');
    console.error('   请在 .env.local 中设置: NEXT_PUBLIC_APP_URL=https://yourdomain.com');
    process.exit(1);
  }

  // 如果指定了单个 URL
  if (customUrl) {
    const fullUrl = customUrl.startsWith('http')
      ? customUrl
      : `${baseUrl}${customUrl.startsWith('/') ? '' : '/'}${customUrl}`;
    return [fullUrl];
  }

  // 生成所有语言版本的 URL
  const locales = ['en', 'zh'];
  const defaultLocale = 'en';

  const urls = [
    baseUrl, // 默认语言的根路径
  ];

  // 添加其他语言的路径
  locales.forEach((locale) => {
    if (locale !== defaultLocale) {
      urls.push(`${baseUrl}/${locale}`);
    }
  });

  return urls;
}

/**
 * 提交 URL 到 IndexNow API
 */
async function submitToIndexNow(urls, apiKey) {
  const host = new URL(process.env.NEXT_PUBLIC_APP_URL).hostname;

  const payload = {
    host: host,
    key: apiKey,
    keyLocation: `${process.env.NEXT_PUBLIC_APP_URL}/${CONFIG.keyFileName}`,
    urlList: urls,
  };

  console.log(`\n📤 正在提交 ${urls.length} 个 URL 到 IndexNow...`);
  console.log(`   主机: ${host}`);
  console.log(`   URL 列表:`);
  urls.forEach(url => console.log(`     - ${url}`));

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // IndexNow API 成功时返回 200 或 202
    if (response.status === 200 || response.status === 202) {
      console.log(`\n✅ 提交成功！(HTTP ${response.status})`);
      console.log('   Bing 和其他搜索引擎将在几分钟内收到更新通知。');
      return true;
    } else {
      const text = await response.text();
      console.error(`\n❌ 提交失败 (HTTP ${response.status})`);
      console.error(`   响应: ${text}`);
      return false;
    }
  } catch (error) {
    console.error('\n❌ 网络错误:', error.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('\n🚀 Bing IndexNow 提交工具\n');
  console.log('━'.repeat(50));

  // 解析命令行参数
  const args = process.argv.slice(2);
  const urlArg = args.find(arg => arg.startsWith('--url='));
  const customUrl = urlArg ? urlArg.split('=')[1] : null;

  // 获取 API 密钥
  const apiKey = getOrCreateApiKey();

  // 获取要提交的 URL
  const urls = getAllUrls(customUrl);

  // 提交到 IndexNow
  const success = await submitToIndexNow(urls, apiKey);

  console.log('\n━'.repeat(50));

  if (success) {
    console.log('\n💡 提示:');
    console.log('   1. 首次使用需确保密钥文件可通过 URL 访问');
    console.log('   2. 可以在每次内容更新后运行此脚本');
    console.log('   3. IndexNow 同时支持 Bing、Yandex 等多个搜索引擎\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ 运行失败:', err);
  process.exit(1);
});
