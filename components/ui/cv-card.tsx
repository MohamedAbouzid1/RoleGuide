'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { draftsApi } from '@/lib/api-client';
import { useLanguage } from '@/lib/language-context';
import { generateCVThumbnail } from '@/lib/thumbnail-generator';

interface Draft {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  overallScore?: number;
  atsScore?: number;
  data?: any; // CV data for thumbnail generation
}

interface CVCardProps {
  draft: Draft;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export default function CVCard({ draft, onDelete, onDuplicate }: CVCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('/assets/cv_example/full_page.png');
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(true);

  // Load thumbnail when component mounts
  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        setIsLoadingThumbnail(true);
        const url = await generateCVThumbnail(draft);
        setThumbnailUrl(url);
      } catch (error) {
        console.error('Error loading thumbnail:', error);
        setThumbnailUrl('/assets/cv_example/full_page.png');
      } finally {
        setIsLoadingThumbnail(false);
      }
    };

    loadThumbnail();
  }, [draft]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return t('editedYesterday');
    } else if (diffDays < 7) {
      return t('editedDaysAgo').replace('{days}', diffDays.toString());
    } else {
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('confirmDeleteCV'))) {
      return;
    }

    try {
      setIsDeleting(true);
      await draftsApi.delete(draft.id);
      onDelete(draft.id);
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert(t('deleteError'));
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleDuplicate = async () => {
    if (!onDuplicate) return;
    
    try {
      // Get the current draft data
      const currentDraft = await draftsApi.getById(draft.id);
      
      // Create a new draft with duplicated data
      const newDraft = await draftsApi.create({
        title: `${draft.title} (Copy)`,
        data: currentDraft.data
      });
      
      onDuplicate(newDraft.id);
      setShowMenu(false);
    } catch (error) {
      console.error('Error duplicating draft:', error);
      alert(t('duplicateError'));
    }
  };

  const handleDownload = async () => {
    try {
      // This would typically generate and download a PDF
      // For now, we'll just show an alert
      alert(t('downloadFeatureComingSoon'));
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert(t('downloadError'));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-1 h-full flex flex-col">
      {/* CV Preview Thumbnail */}
      <div className="aspect-[4/3] bg-gray-50 rounded-t-lg overflow-hidden relative flex-shrink-0">
        {/* CV Screenshot Preview */}
        <div className="w-full h-full relative">
          <Image
            src={thumbnailUrl}
            alt={`${draft.title || t('untitledCV')} preview`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Loading overlay */}
          {isLoadingThumbnail && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-500 text-sm">Loading...</div>
            </div>
          )}
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-opacity duration-300" />
          
          {/* CV Title overlay */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded px-2 py-1">
              <p className="text-xs font-medium text-gray-800 truncate">
                {draft.title || t('untitledCV')}
              </p>
            </div>
          </div>
        </div>
        
        {/* ATS Score Badge */}
        {draft.atsScore !== undefined && draft.atsScore !== null && (
          <div className="absolute top-3 left-3">
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center shadow-sm">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ATS {draft.atsScore}%
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* CV Title and Metadata */}
        <div className="mb-2 flex-shrink-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1 text-sm">
            {draft.title || t('untitledCV')}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(draft.updatedAt)}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">A4</span>
          </div>
        </div>

        {/* Scores */}
        {(draft.overallScore !== undefined || draft.atsScore !== undefined) && (
          <div className="flex gap-2 mb-2 flex-shrink-0">
            {draft.overallScore !== undefined && (
              <div className="flex-1 bg-blue-50 rounded px-2 py-1 text-center">
                <div className="text-xs text-gray-600">{t('overall')}</div>
                <div className="text-xs font-bold text-blue-600">{draft.overallScore}%</div>
              </div>
            )}
            {draft.atsScore !== undefined && (
              <div className="flex-1 bg-green-50 rounded px-2 py-1 text-center">
                <div className="text-xs text-gray-600">ATS</div>
                <div className="text-xs font-bold text-green-600">{draft.atsScore}%</div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto">
          <button
            onClick={() => router.push(`/builder/${draft.id}`)}
            className="flex-1 bg-blue-600 text-white px-2 py-1.5 rounded-md hover:bg-blue-700 text-xs font-medium transition-colors"
          >
            {t('edit')}
          </button>
          
          {/* Three-dot menu */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={handleDownload}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('download')}
                  </button>
                  
                  {onDuplicate && (
                    <button
                      onClick={handleDuplicate}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {t('duplicate')}
                    </button>
                  )}
                  
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isDeleting ? t('deleting') : t('delete')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
