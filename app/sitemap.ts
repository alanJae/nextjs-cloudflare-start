import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '../i18n';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';
    const now = new Date();

    const localizedPages = ['', '/contact'];

    if (siteConfig.features.blog) {
        localizedPages.push('/blog');
    }
    const paths: MetadataRoute.Sitemap = [];

    for (const pathname of localizedPages) {
        for (const locale of locales) {
            const localizedPath =
                locale === defaultLocale ? pathname || '/' : `/${locale}${pathname || ''}`;

            paths.push({
                url: `${baseUrl}${localizedPath}`,
                lastModified: now,
                changeFrequency: pathname === '' ? 'daily' : 'weekly',
                priority: pathname === '' ? (locale === defaultLocale ? 1 : 0.8) : 0.7,
            });
        }
    }

    return paths;
}
