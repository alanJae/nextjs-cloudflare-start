import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@/components/analytics";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// 强制动态渲染（SSR），禁用静态生成
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo' });

    return {
        title: t('title'),
        description: t('description'),
        robots: {
            index: true,
            follow: true,
        },
        icons: {
            icon: [
                { url: '/favicon/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
                { url: '/favicon/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
                { url: '/favicon/favicon.ico', sizes: 'any' },
            ],
            apple: [
                { url: '/favicon/apple-touch-icon-180x180.svg', sizes: '180x180', type: 'image/svg+xml' },
            ],
        },
    };
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: Props) {
    const { locale } = await params;

    // 获取当前语言的翻译消息
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
            >
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Analytics />
                        <Header />
                        <main className="flex-1">
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
