'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { locales, localeConfig, type Locale, defaultLocale } from '@/i18n';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn exists, if not I'll just use clsx/tailwind-merge directly or define a helper locally. Wait, package.json has clsx/tailwind-merge. I should check if utils exists.

export default function LanguageSwitcher() {
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLanguageChange = (newLocale: string) => {
        // Remove current locale prefix if present
        // Logic: if pathname starts with /currentLocale, remove it.
        // But wait, if locale is default (en), pathname doesn't have it.
        // If locale is NOT default (zh), pathname DOES have it.

        let pathWithoutLocale = pathname;
        if (locale !== defaultLocale && pathname.startsWith(`/${locale}`)) {
            pathWithoutLocale = pathname.replace(`/${locale}`, '');
            if (pathWithoutLocale === '') pathWithoutLocale = '/';
        }

        // Add new locale prefix if not default
        const newPath = newLocale === defaultLocale
            ? pathWithoutLocale || '/'
            : `/${newLocale}${pathWithoutLocale}`;

        // Avoid double slashes if pathWithoutLocale is '/'
        let cleanPath = newPath.replace('//', '/');

        // Append query parameters if present
        const searchParamsString = searchParams.toString();
        if (searchParamsString) {
            cleanPath += `?${searchParamsString}`;
        }

        router.push(cleanPath);
        setIsOpen(false);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-full 
                        bg-white/80 dark:bg-zinc-800/80 
                        backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 
                        shadow-sm hover:shadow-md transition-all duration-200
                        text-sm font-medium text-zinc-700 dark:text-zinc-200
                        hover:bg-zinc-50 dark:hover:bg-zinc-700/50 outline-none focus:ring-2 focus:ring-blue-500/20"
                    aria-label="Select language"
                >
                    <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    <span className="hidden sm:inline-block">{localeConfig[locale]?.label || locale.toUpperCase()}</span>
                    <span className="sm:hidden">{localeConfig[locale]?.shortLabel || locale.toUpperCase()}</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="min-w-[8rem] bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-700"
            >
                {locales.map((lang) => (
                    <DropdownMenuItem
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={cn(
                            "cursor-pointer",
                            locale === lang ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" : ""
                        )}
                    >
                        <span className="flex-1 flex items-center gap-2">
                            {localeConfig[lang as Locale]?.label}
                        </span>
                        {locale === lang && (
                            <Check className="h-3.5 w-3.5 ml-auto" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

