'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { draftsApi } from '@/lib/api-client';
import { useLanguage } from '@/lib/language-context';

interface NewCVCardProps {
  onCreate: (id: string) => void;
}

export default function NewCVCard({ onCreate }: NewCVCardProps) {
  const router = useRouter();
  const { t, cvLanguage } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNewCV = async () => {
    setIsCreating(true);
    try {
      // Create a new draft using the backend API
      const draft = await draftsApi.create({
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
      });

      onCreate(draft.id);
      router.push(`/builder/${draft.id}`);
    } catch (error) {
      console.error('Error creating new CV:', error);
      alert(t('createCVError'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreateNewCV}
      disabled={isCreating}
      className="bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all duration-300 group h-full flex flex-col items-center justify-center p-6 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
    >
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors duration-300">
          {isCreating ? (
            <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {isCreating ? t('creating') : t('newResume')}
        </h3>
        <p className="text-xs text-gray-600">
          {isCreating ? t('pleaseWait') : t('createNewCVDescription')}
        </p>
      </div>
    </button>
  );
}
