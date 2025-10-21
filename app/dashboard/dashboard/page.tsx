'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { draftsApi } from '@/lib/api-client';
import { useLanguage } from '@/lib/language-context';

interface Draft {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  overallScore?: number;
  atsScore?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await draftsApi.getAll();
      setDrafts(data);
    } catch (err: any) {
      console.error('Error fetching drafts:', err);
      setError(err.message || 'Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) {
      return;
    }

    try {
      setDeleting(id);
      await draftsApi.delete(id);
      setDrafts(drafts.filter(d => d.id !== id));
    } catch (err: any) {
      console.error('Error deleting draft:', err);
      alert('Failed to delete draft: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('savedDrafts')}</h1>
          <p className="text-gray-600 mt-1">Manage and edit your CV drafts</p>
        </div>
        <Link
          href="/dashboard"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchDrafts}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Drafts Grid */}
      {drafts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No drafts yet</h3>
          <p className="text-gray-600 mb-6">Create your first CV to get started</p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Create New CV
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Draft Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {draft.title || 'Untitled CV'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Updated: {formatDate(draft.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Scores */}
              {(draft.overallScore !== null && draft.overallScore !== undefined) ||
               (draft.atsScore !== null && draft.atsScore !== undefined) ? (
                <div className="flex gap-2 mb-4">
                  {draft.overallScore !== null && draft.overallScore !== undefined && (
                    <div className="flex-1 bg-blue-50 rounded px-3 py-2">
                      <div className="text-xs text-gray-600">Overall</div>
                      <div className="text-lg font-bold text-blue-600">{draft.overallScore}%</div>
                    </div>
                  )}
                  {draft.atsScore !== null && draft.atsScore !== undefined && (
                    <div className="flex-1 bg-green-50 rounded px-3 py-2">
                      <div className="text-xs text-gray-600">ATS</div>
                      <div className="text-lg font-bold text-green-600">{draft.atsScore}%</div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/builder/${draft.id}`)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(draft.id)}
                  disabled={deleting === draft.id}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 text-sm font-medium disabled:opacity-50"
                >
                  {deleting === draft.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

