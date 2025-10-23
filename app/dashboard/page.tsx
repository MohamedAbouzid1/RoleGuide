'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { draftsApi } from '@/lib/api-client';
import Sidebar from '@/components/ui/sidebar';
import CVCard from '@/components/ui/cv-card';
import NewCVCard from '@/components/ui/new-cv-card';

interface Draft {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  overallScore?: number;
  atsScore?: number;
  data?: any; // CV data for thumbnail generation
}

export default function DashboardIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t, cvLanguage, setCvLanguage } = useLanguage();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDrafts();
    }
  }, [user]);

  const fetchDrafts = async () => {
    try {
      setDraftsLoading(true);
      setError(null);
      const data = await draftsApi.getAll();
      setDrafts(data);
    } catch (err: any) {
      console.error('Error fetching drafts:', err);
      setError(err.message || 'Failed to load drafts');
    } finally {
      setDraftsLoading(false);
    }
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(drafts.filter(d => d.id !== id));
  };

  const handleCreateNewCV = (id: string) => {
    // Refresh drafts list to include the new CV
    fetchDrafts();
  };

  const handleDuplicateCV = (id: string) => {
    // Refresh drafts list to include the duplicated CV
    fetchDrafts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('loginRequired')}</h1>
          <p className="text-gray-700 mb-4">{t('mustSignIn')}</p>
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {t('signIn')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarCollapsed && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarCollapsed(false)} />
          <div className="relative z-10">
            <Sidebar isCollapsed={false} onToggle={() => setSidebarCollapsed(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{t('myResumes')}</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* CV Language Selection */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900">{t('cvLanguage')}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {cvLanguage === 'de' 
                  ? 'Ihr Lebenslauf wird auf Deutsch erstellt'
                  : 'Your CV will be created in English'
                }
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCvLanguage('de')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  cvLanguage === 'de'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setCvLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  cvLanguage === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('myResumes')}</h1>
            <p className="text-gray-600 mt-1">{t('welcomeBack')}, {user?.name || user?.email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchDrafts}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                {t('tryAgain')}
              </button>
            </div>
          )}

          {/* CVs Grid */}
          {draftsLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg text-gray-600">{t('loading')}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 items-stretch">
              {/* New CV Card */}
              <NewCVCard onCreate={handleCreateNewCV} />
              
              {/* Existing CV Cards */}
              {drafts.map((draft) => (
                <CVCard
                  key={draft.id}
                  draft={draft}
                  onDelete={handleDeleteDraft}
                  onDuplicate={handleDuplicateCV}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!draftsLoading && drafts.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noCVsYet')}</h3>
              <p className="text-gray-600 mb-6">{t('createFirstCV')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

