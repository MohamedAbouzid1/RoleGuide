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

