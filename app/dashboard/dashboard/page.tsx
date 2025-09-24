import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-700">Ihre gespeicherten Entwürfe erscheinen hier.</p>
      <div className="mt-6">
        <Link href="/builder/new" className="rounded bg-black px-4 py-2 text-white">Neuer Entwurf</Link>
      </div>
    </main>
  );
}

