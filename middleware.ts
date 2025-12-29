import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
    // 支持的所有语言
    locales,

    // 默认语言
    defaultLocale,

    // 默认语言不显示前缀（/ 而不是 /en）
    localePrefix: 'as-needed',

    // 禁用自动语言检测，主页始终显示默认语言
    localeDetection: false,
});

export const config = {
    // 匹配所有路径，除了 API、静态文件等
    matcher: [
        // 匹配所有路径
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
