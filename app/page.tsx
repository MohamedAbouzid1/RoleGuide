import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-3xl font-bold">LebenslaufPro</h1>
      <p className="mb-6 text-gray-700">Erstellen, bewerten und exportieren Sie Ihren Lebenslauf.</p>
      <div className="flex gap-3">
        <Link href="/builder/new" className="rounded bg-black px-4 py-2 text-white">Neuen Entwurf starten</Link>
        <Link href="/dashboard/dashboard" className="rounded border px-4 py-2">Zum Dashboard</Link>
      </div>
    </main>
  );
}

