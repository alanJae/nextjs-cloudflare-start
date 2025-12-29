import { getRequestConfig } from 'next-intl/server';

// 支持的语言列表
export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

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
