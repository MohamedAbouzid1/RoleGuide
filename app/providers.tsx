'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';

interface ProvidersProps {
  children: ReactNode;
}

export function SessionProvider({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
