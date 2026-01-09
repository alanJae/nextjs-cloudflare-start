import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/blog-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {};
    }

    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container max-w-3xl py-6 lg:py-10 px-4 mx-auto">
            <Link
                href={`/${locale === 'en' ? '' : locale + '/'}blog`}
                className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:text-primary mb-8"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
            </Link>
            <article>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    {post.title}
                </h1>
                <div className="text-muted-foreground mb-8">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </div>
    );
}
