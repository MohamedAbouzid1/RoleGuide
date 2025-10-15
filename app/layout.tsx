import './globals.css';
import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SessionProvider } from './providers';
import { LanguageProvider } from '@/lib/language-context';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'RoleGuide - ATS-Optimized CV Builder for the German Job Market',
  description: 'Create professional, ATS-optimized CVs tailored to German hiring standards. AI-powered CV builder that helps you get past applicant tracking systems and land more interviews.',
  keywords: 'CV builder, German CV, Lebenslauf, ATS optimization, German job market, resume builder, AI CV',
  openGraph: {
    title: 'RoleGuide - ATS-Optimized CV Builder for the German Job Market',
    description: 'Create professional, ATS-optimized CVs tailored to German hiring standards.',
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

