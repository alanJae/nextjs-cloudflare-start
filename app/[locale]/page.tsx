import Image from "next/image";
import { getTranslations } from 'next-intl/server';


// 强制动态渲染，确保每次请求都是服务器端渲染
export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ locale: string }>;
};

// 服务器端异步函数，获取实时数据
async function getServerData() {
    const timestamp = new Date().toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return {
        timestamp,
    };
}

export default async function Home({ params }: Props) {
    const { locale } = await params;

    // 在服务器端获取数据
    const serverData = await getServerData();

    // 获取翻译函数（服务器端）
    const t = await getTranslations('home');

    return (
        <div className="font-sans grid grid-rows-[1fr] items-center justify-items-center min-h-[calc(100vh-140px)] p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] items-center sm:items-start w-full max-w-5xl">
                <div className="flex items-center justify-between w-full">
                    <Image
                        className="dark:invert"
                        src="/next.svg"
                        alt="Next.js logo"
                        width={180}
                        height={38}
                        priority
                    />
                </div>

                {/* 服务器渲染信息展示 */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800 w-full">
                    <h2 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
                        {t('ssr.title')}
                    </h2>
                    <div className="space-y-2 text-sm font-mono">
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">{t('ssr.renderTime')}</span>
                            <span className="text-blue-600 dark:text-blue-400">{serverData.timestamp}</span>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">{t('ssr.environment')}</span>
                            <span className="text-purple-600 dark:text-purple-400">{t('ssr.environmentValue')}</span>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">{t('ssr.renderType')}</span>
                            <span className="text-green-600 dark:text-green-400">{t('ssr.renderTypeValue')}</span>
                        </p>
                    </div>
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        {t('ssr.tip')}
                    </p>
                </div>

                <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
                    <li className="mb-2 tracking-[-.01em]">
                        {t('getStarted')}{" "}
                        <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
                            app/[locale]/page.tsx
                        </code>
                        .
                    </li>
                    <li className="tracking-[-.01em]">
                        {t('saveChanges')}
                    </li>
                </ol>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <a
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            className="dark:invert"
                            src="/vercel.svg"
                            alt="Vercel logomark"
                            width={20}
                            height={20}
                        />
                        {t('deployNow')}
                    </a>
                    <a
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('readDocs')}
                    </a>
                </div>
            </main>
        </div>
    );
}
