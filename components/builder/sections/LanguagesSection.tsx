'use client';

import { useCVStore } from '@/lib/store';

export function LanguagesSection() {
  const { cv, updateSection } = useCVStore();

  const addLang = () => updateSection('languages', [...cv.languages, { name: '', level: 'B2' }]);
  const updateLang = (i: number, field: 'name' | 'level', value: string) => {
    const next = [...cv.languages];
    // @ts-expect-error dynamic
    next[i][field] = value;
    updateSection('languages', next);
  };

  return (
    <div className="space-y-3">
      {cv.languages.map((l, i) => (
        <div key={i} className="grid grid-cols-2 gap-3">
          <input className="rounded border p-2" placeholder="Sprache" value={l.name} onChange={(e) => updateLang(i, 'name', e.target.value)} />
          <select className="rounded border p-2" value={l.level} onChange={(e) => updateLang(i, 'level', e.target.value)}>
            {['A1','A2','B1','B2','C1','C2'].map(level => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>
      ))}
      <button type="button" onClick={addLang} className="rounded border px-3 py-1">Sprache hinzufügen</button>
    </div>
  );
}

