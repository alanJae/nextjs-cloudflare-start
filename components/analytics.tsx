'use client';

import Script from 'next/script';

export function Analytics() {
    // 仅在生产环境生效
    if (process.env.NODE_ENV !== 'production') {
        return null;
    }

    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
    const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

    return (
        <>
            {/* Google Analytics */}
            {gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
                    </Script>
                </>
            )}

            {/* Google AdSense */}
            {adsenseId && (
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            )}

            {/* Microsoft Clarity */}
            {clarityId && (
                <Script id="microsoft-clarity" strategy="afterInteractive">
                    {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
                </Script>
            )}
        </>
    );
}
