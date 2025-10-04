import './globals.css';
import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SessionProvider } from './providers';
import { LanguageProvider } from '@/lib/language-context';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'LebenslaufPro',
  description: 'CV Builder and Evaluator for the German market',
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

