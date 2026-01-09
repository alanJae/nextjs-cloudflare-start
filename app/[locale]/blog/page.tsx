import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { blogPosts } from '@/lib/blog-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'header.nav' });
    return {
        title: t('blog'),
    };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Helper to format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container max-w-4xl py-6 lg:py-10 px-4 mx-auto">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-y-4">
                    <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
                        Blog
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        A blog about Next.js, Cloudflare Workers, and Web Development.
                    </p>
                </div>
            </div>
            <hr className="my-8" />
            <div className="grid gap-10 sm:grid-cols-2">
                {blogPosts.map((post) => (
                    <article key={post.slug} className="group relative flex flex-col space-y-2">
                        <h2 className="text-2xl font-extrabold">{post.title}</h2>
                        <p className="text-muted-foreground">{post.excerpt}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(post.date)}</p>
                        <Link href={`/${locale === 'en' ? '' : locale + '/'}blog/${post.slug}`} className="absolute inset-0">
                            <span className="sr-only">View Article</span>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}
