'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-4 text-2xl font-bold">Anmelden</h1>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          setLoading(true);
          try {
            await login(email, password);
            router.push('/dashboard');
          } catch (err: any) {
            setError(err.message || 'Login failed');
          } finally {
            setLoading(false);
          }
        }}
      >
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input 
          className="w-full rounded border p-2" 
          placeholder="E-Mail" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          className="w-full rounded border p-2" 
          placeholder="Passwort" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Anmelden...' : 'Anmelden'}
        </button>
      </form>
    </main>
  );
}

