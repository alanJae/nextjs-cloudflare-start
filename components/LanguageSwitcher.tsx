'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLocale: string) => {
        // 移除当前语言前缀（如果有）
        const currentPath = pathname.replace(`/${locale}`, '') || '/';

        // 如果是默认语言（英文），不添加前缀
        const newPath = newLocale === 'en' ? currentPath : `/${newLocale}${currentPath}`;

        router.push(newPath);
    };

    return (
        <div className="flex gap-2 items-center bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
            {locales.map((lang) => (
                <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${locale === lang
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
          `}
                    aria-label={`Switch to ${lang === 'en' ? 'English' : '中文'}`}
                >
                    {lang === 'en' ? 'EN' : '中文'}
                </button>
            ))}
        </div>
    );
}
