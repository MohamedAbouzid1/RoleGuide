import './globals.css';
import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SessionProvider } from './providers';
import { LanguageProvider } from '@/lib/language-context';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'RoleGuide - Free German CV Builder for International Job Seekers',
  description: 'Create ATS-optimized German CVs that land interviews. Built specifically for international professionals seeking jobs in Germany. 100% free forever.',
  keywords: 'CV builder, German CV, Lebenslauf, ATS optimization, German job market, resume builder, AI CV',
  icons: {
    icon: [
      { url: '/favicon-for-app/favicon.ico', sizes: 'any' },
      { url: '/favicon-for-app/icon0.svg', type: 'image/svg+xml' },
      { url: '/favicon-for-app/icon1.png', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon-for-app/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon-for-app/icon0.svg', color: '#000000' }
    ]
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'RoleGuide - Free German CV Builder for International Job Seekers',
    description: 'Create ATS-optimized German CVs that land interviews. Built specifically for international professionals seeking jobs in Germany. 100% free forever.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`min-h-screen bg-white text-gray-900 ${jakarta.className}`}>
        <SessionProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

