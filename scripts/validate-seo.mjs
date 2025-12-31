import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置要求
const CONFIG = {
    title: {
        min: 50,
        max: 60,
        label: 'SEO Title'
    },
    description: {
        min: 140,
        max: 150,
        label: 'SEO Description'
    }
};

// 翻译文件路径
const MESSAGES_DIR = path.join(__dirname, '../messages');

function validateSEOLength() {
    const files = fs.readdirSync(MESSAGES_DIR);
    let hasError = false;

    console.log('🔍 Starting SEO length validation...\n');

    files.forEach(file => {
        if (!file.endsWith('.json')) return;

        const filePath = path.join(MESSAGES_DIR, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const locale = file.replace('.json', '');

        // 检查是否存在 seo 字段
        if (!content.seo) {
            console.warn(`⚠️  [${locale}] Missing 'seo' section in ${file}`);
            return;
        }

        const { title, description } = content.seo;

        // 校验 Title
        if (title) {
            const titleLen = title.length;
            if (titleLen < CONFIG.title.min || titleLen > CONFIG.title.max) {
                console.error(`❌ [${locale}] Title length invalid: ${titleLen} chars (Expected ${CONFIG.title.min}-${CONFIG.title.max})`);
                console.error(`   Content: "${title}"`);
                hasError = true;
            } else {
                console.log(`✅ [${locale}] Title length OK: ${titleLen} chars`);
            }
        } else {
            console.error(`❌ [${locale}] Missing 'seo.title'`);
            hasError = true;
        }

        // 校验 Description
        if (description) {
            const descLen = description.length;
            if (descLen < CONFIG.description.min || descLen > CONFIG.description.max) {
                console.error(`❌ [${locale}] Description length invalid: ${descLen} chars (Expected ${CONFIG.description.min}-${CONFIG.description.max})`);
                console.error(`   Content: "${description}"`);
                hasError = true;
            } else {
                console.log(`✅ [${locale}] Description length OK: ${descLen} chars`);
            }
        } else {
            console.error(`❌ [${locale}] Missing 'seo.description'`);
            hasError = true;
        }
    });

    console.log('\n----------------------------------------');

    if (hasError) {
        console.error('⛔️ SEO validation failed! Please fix the errors above.');
        process.exit(1);
    } else {
        console.log('🎉 SEO validation passed!');
        process.exit(0);
    }
}

validateSEOLength();
