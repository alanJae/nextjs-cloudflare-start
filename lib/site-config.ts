export const siteConfig = {
    features: {
        blog: process.env.NEXT_PUBLIC_ENABLE_BLOG === 'true',
    },
} as const;

