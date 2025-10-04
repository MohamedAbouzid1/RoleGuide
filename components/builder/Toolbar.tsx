"use client";

import { useLanguage } from '@/lib/language-context';
import { useCVStore } from '@/lib/store';

type ToolbarProps = {
  onSave: () => void;
  onEvaluate: () => void;
  onExport: () => void;
  saving: boolean;
  evaluating: boolean;
  isDirty: boolean;
  evaluation: { overallScore: number } | null;
};

export function Toolbar({ onSave, onEvaluate, onExport, saving, evaluating, isDirty, evaluation }: ToolbarProps) {
  const { t } = useLanguage();
  const { cv, updateSection } = useCVStore();

  const handleLanguageChange = (language: 'en' | 'de') => {
    updateSection('language', language);
  };

  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onSave} disabled={saving} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
          {saving ? t('saving') : isDirty ? t('save') : t('saved')}
        </button>
        <button onClick={onEvaluate} disabled={evaluating} className="rounded border px-4 py-2 disabled:opacity-50">
          {evaluating ? t('evaluating') : t('evaluate')}
        </button>
        <button onClick={onExport} className="rounded border px-4 py-2">{t('exportPDF')}</button>
        
        {/* CV Language Selector */}
        <div className="flex items-center gap-2 ml-4 pl-4 border-l">
          <span className="text-sm text-gray-600">{t('cvLanguage')}:</span>
          <select
            value={cv.language || 'de'}
            onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'de')}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      <div className="text-sm text-gray-700">
        {evaluation ? `${t('overallScore')}: ${evaluation.overallScore}/100` : t('noEvaluation')}
      </div>
    </div>
  );
}

