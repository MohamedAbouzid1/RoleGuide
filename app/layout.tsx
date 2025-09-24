import './globals.css';
import React from 'react';

export const metadata = {
  title: 'LebenslaufPro',
  description: 'CV Builder and Evaluator for the German market',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}

