import type { Metadata, Viewport } from 'next';
import { Alexandria, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { NABTA_I18N } from '@/lib/i18n';
import './globals.css';

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-alexandria',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: NABTA_I18N.ar['meta.title'],
  description: NABTA_I18N.ar['meta.description'],
  icons: {
    icon: '/assets/brand/logo-mark-green.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2F4024',
};

const LANG_INIT_SCRIPT = `(function(){try{var l=localStorage.getItem('nabta-lang');if(l==='en'||l==='ar'){document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${alexandria.variable} ${ibmPlexSansArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/assets/img/bg-workshop-1600.webp" />
        <script dangerouslySetInnerHTML={{ __html: LANG_INIT_SCRIPT }} />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
