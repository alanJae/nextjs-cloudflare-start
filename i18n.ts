import { getRequestConfig } from 'next-intl/server';

// 支持的语言及其配置
export const localeConfig = {
    en: { label: 'English', shortLabel: 'EN' },
    zh: { label: '中文', shortLabel: 'CN' },
} as const;

// 导出语言列表，保持和其他文件引用兼容
export const locales = Object.keys(localeConfig) as (keyof typeof localeConfig)[];
// export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en' as const;

export type Locale = keyof typeof localeConfig;

export default getRequestConfig(async ({ requestLocale }) => {
    // 获取请求的 locale
    let locale = await requestLocale;

    // 确保使用有效的 locale，否则使用默认语言
    if (!locale || !locales.includes(locale as Locale)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
