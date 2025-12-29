import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function Header() {
    const t = await getTranslations('header');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-6 flex items-center space-x-2" href="/">
                        <span className="hidden font-bold sm:inline-block">
                            {t('title')}
                        </span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* 这里可以放搜索框 */}
                    </div>
                    <nav className="flex items-center gap-2">
                        <ModeToggle />
                        <LanguageSwitcher />
                    </nav>
                </div>
            </div>
        </header>
    );
}
