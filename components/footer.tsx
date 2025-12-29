import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Footer() {
    const t = await getTranslations('footer');
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border/40 py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    {t('copyright', { year })}
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <Link href="#" className="hover:underline">{t('links.privacy')}</Link>
                    <Link href="#" className="hover:underline">{t('links.terms')}</Link>
                </div>
            </div>
        </footer>
    );
}
