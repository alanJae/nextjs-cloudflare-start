import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { defaultLocale, locales } from '@/i18n';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

function buildLocalizedPath(locale: string, pathname: string) {
    return locale === defaultLocale ? pathname : `/${locale}${pathname}`;
}

function buildCanonicalUrl(locale: string, pathname: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';
    return `${baseUrl}${buildLocalizedPath(locale, pathname)}`;
}

function buildLanguageAlternates(pathname: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';

    return Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}${buildLocalizedPath(locale, pathname)}`])
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.contact' });
    const canonicalUrl = buildCanonicalUrl(locale, '/contact');

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: canonicalUrl,
            languages: buildLanguageAlternates('/contact'),
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: canonicalUrl,
            siteName: 'Test Edge Start',
            locale,
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: t('title'),
            description: t('description'),
        },
    };
}

export default function ContactLayout({ children }: Props) {
    return children;
}
