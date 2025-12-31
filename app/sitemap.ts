import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '../i18n';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';

    // 基础路径
    const paths = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
    ];

    // 为每个语言生成路径
    locales.forEach((locale) => {
        // 跳过默认语言，因为已经在跟路径处理了（或者根据策略决定是否保留）
        // 这里我们假设默认语言对应根路径，其他语言对应 /locale 路径
        // 如果你的路由策略不同，请调整这里
        if (locale === defaultLocale) return;

        paths.push({
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        });
    });

    return paths;
}
