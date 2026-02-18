import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
    // 支持的所有语言
    locales,

    // 默认语言
    defaultLocale,

    // 默认语言不显示前缀（/ 而不是 /en）
    localePrefix: 'as-needed',

    // 禁用自动语言检测，主页始终显示默认语言
    localeDetection: false,
});



export default function middleware(request: NextRequest) {
    const response = intlMiddleware(request);

    // 添加当前 URL 到 header，供服务端组件使用
    response.headers.set('x-url', request.url);

    return response;
}

export const config = {
    // 匹配所有路径，除了 API、静态文件等
    matcher: [
        // 匹配所有路径
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
