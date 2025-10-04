'use client';

import { useCVStore } from '@/lib/store';

export function ProfileSection() {
  const { cv, updateSection } = useCVStore();
  
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Professionelle Zusammenfassung</label>
        <textarea 
          className="mt-1 w-full rounded border p-2 h-32 resize-none" 
          placeholder="Beschreiben Sie kurz Ihre beruflichen Qualifikationen, Erfahrungen und Ziele..."
          value={cv.profile?.summary ?? ''}
          onChange={(e) => updateSection('profile', { summary: e.target.value })}
        />
        <p className="mt-1 text-xs text-gray-500">
          Eine kurze, prägnante Zusammenfassung Ihrer beruflichen Identität und Ziele.
        </p>
      </div>
    </div>
  );
}
