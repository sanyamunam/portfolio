import type { Metadata } from 'next';
import './globals.css';
import Cursor from '@/components/Cursor';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/site';

const DESCRIPTION =
  'Sanya Munam is a UX Lead in Doha with 7+ years of experience — UX strategy, design direction and design leadership for the Qatar Basketball Federation, Qatar Olympic Committee, AlMujadilah and more.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sanya Munam — UX Lead, Doha',
    template: '%s · Sanya Munam',
  },
  description: DESCRIPTION,
  keywords: [
    'Sanya Munam',
    'UX Lead',
    'UX strategy',
    'design direction',
    'UX designer Doha',
    'UX designer Qatar',
    'product design Qatar',
  ],
  authors: [{ name: 'Sanya Munam', url: SITE_URL }],
  creator: 'Sanya Munam',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Sanya Munam — UX Lead',
    title: 'Sanya Munam — UX Lead, Doha',
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
    title: 'Sanya Munam — UX Lead, Doha',
    description: DESCRIPTION,
    images: ['/og.jpg'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sanya Munam',
  jobTitle: 'UX Lead',
  url: SITE_URL,
  worksFor: { '@type': 'Organization', name: 'Applab', url: 'https://applab.qa' },
  address: { '@type': 'PostalAddress', addressLocality: 'Doha', addressCountry: 'QA' },
  alumniOf: 'Computer Science Engineering',
  knowsAbout: [
    'UX Strategy',
    'Design Direction',
    'User Research',
    'Persona Mapping',
    'Design Operations',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=ranade@400,500&f[]=switzer@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
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
