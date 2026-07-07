import type { Metadata } from 'next';
import './globals.css';
import Cursor from '@/components/Cursor';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/site';

const DESCRIPTION =
  'Portfolio of Sanya Munam — UX Lead & Project Manager, Doha.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sanya Munam — UX Lead & Project Manager, Doha',
    template: '%s · Sanya Munam',
  },
  description: DESCRIPTION,
  // Keep this site out of search engines entirely.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  // Open Graph / Twitter are for link-share previews (WhatsApp, LinkedIn, X)
  // when Sanya sends the link herself — they do not cause search indexing.
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Sanya Munam',
    title: 'Sanya Munam — UX Lead & Project Manager, Doha',
    description: DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Sanya Munam — UX Lead, Doha',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanya Munam — UX Lead & Project Manager, Doha',
    description: DESCRIPTION,
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apply the saved theme before paint — no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()",
          }}
        />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=ranade@400,500&f[]=switzer@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" aria-hidden />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
