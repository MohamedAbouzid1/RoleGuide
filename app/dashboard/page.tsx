'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export default function DashboardIndex() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { t, language, setLanguage, cvLanguage, setCvLanguage } = useLanguage();

  const handleCreateNewCV = async () => {
    setIsCreating(true);
    try {
      // Create a new draft
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: cvLanguage === 'de' ? 'Mein Lebenslauf' : 'My CV',
          data: {
            personal: {
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              address: '',
              dateOfBirth: '',
              nationality: '',
              profilePicture: ''
            },
            profile: {
              summary: ''
            },
            experience: [],
            education: [],
            skills: [],
            languages: [],
            language: cvLanguage
          }
        }),
      });

      if (response.ok) {
        const draft = await response.json();
        router.push(`/builder/${draft.id}`);
      } else {
        console.error('Failed to create new CV');
      }
    } catch (error) {
      console.error('Error creating new CV:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">{t('loading')}</div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('loginRequired')}</h1>
          <p className="text-gray-700 mb-4">{t('mustSignIn')}</p>
          <Link href="/auth/login" className="bg-black text-white px-4 py-2 rounded">
            {t('signIn')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-600 mt-1">{t('welcomeBack')}, {session.user?.name || session.user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">{t('selectLanguage')}:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'de')}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {/* CV Language Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">{t('cvLanguage')}</h2>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">{t('cvLanguage')}:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setCvLanguage('de')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                cvLanguage === 'de'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Deutsch (German CV)
            </button>
            <button
              onClick={() => setCvLanguage('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                cvLanguage === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              English (English CV)
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {cvLanguage === 'de' 
            ? 'Ihr Lebenslauf wird auf Deutsch erstellt (für deutsche Stellenausschreibungen)'
            : 'Your CV will be created in English (for English job applications)'
          }
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Create New CV */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold ml-3">{t('createNewCV')}</h3>
          </div>
          <p className="text-gray-600 mb-4">{t('createNewCVDescription')}</p>
          <button
            onClick={handleCreateNewCV}
            disabled={isCreating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? t('saving') : t('createNewCV')}
          </button>
        </div>

        {/* View Saved Drafts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold ml-3">{t('savedDrafts')}</h3>
          </div>
          <p className="text-gray-600 mb-4">{t('savedDraftsDescription')}</p>
          <Link
            href="/dashboard/dashboard"
            className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-center"
          >
            {t('savedDrafts')}
          </Link>
        </div>

        {/* CV Evaluation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold ml-3">{t('cvEvaluation')}</h3>
          </div>
          <p className="text-gray-600 mb-4">{t('cvEvaluationDescription')}</p>
          <button
            disabled
            className="w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
          >
            {t('comingSoon')}
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{t('recentActivity')}</h2>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>{t('noActivityYet')}</p>
          <p className="text-sm">{t('createFirstCV')}</p>
        </div>
      </div>
    </main>
  );
}

