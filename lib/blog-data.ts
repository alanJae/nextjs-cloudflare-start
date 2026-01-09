export interface BlogPost {
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    content: string;
}

export const blogPosts: BlogPost[] = [
    {
        title: "Getting Started with Next.js and Cloudflare Workers",
        slug: "getting-started-nextjs-cloudflare",
        date: "2024-03-20",
        excerpt: "Learn how to deploy your Next.js application to Cloudflare Workers for global scalability.",
        content: `
      <h2>Introduction</h2>
      <p>Next.js and Cloudflare Workers match made in heaven. By combining the developer experience of Next.js with the performance of Cloudflare's edge network, you can build incredibly fast applications.</p>
      
      <h3>Why Cloudflare Workers?</h3>
      <p>Cloudflare Workers allows you to run your code at the edge, closer to your users. This means lower latency and faster response times.</p>
      
      <h3>Setting Up</h3>
      <p>To get started, you'll need to install the OpenNext adapter...</p>
    `
    },
    {
        title: "Optimizing Web Performance",
        slug: "optimizing-web-performance",
        date: "2024-03-22",
        excerpt: "Tips and tricks to make your web application fly.",
        content: `
      <h2>Performance Matters</h2>
      <p>In today's web, performance is a key differentiator. A fast website leads to better user engagement and higher conversion rates.</p>
      
      <h3>Images</h3>
      <p>Always optimize your images. Use next/image for automatic optimization.</p>
    `
    },
    {
        title: "Understanding Server Components",
        slug: "understanding-server-components",
        date: "2024-03-25",
        excerpt: "Deep dive into React Server Components in Next.js.",
        content: `
      <h2>React Server Components</h2>
      <p>RSC represents a paradigm shift in how we build React applications. By moving logic to the server, we can reduce the client-side bundle size.</p>
    `
    }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug);
}
