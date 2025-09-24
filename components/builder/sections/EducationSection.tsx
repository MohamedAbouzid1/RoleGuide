'use client';

import { useCVStore } from '@/lib/store';

export function EducationSection() {
  const { cv, updateSection } = useCVStore();

  const addEdu = () => {
    updateSection('education', [...cv.education, { degree: '', school: '', city: '', graduation: '', notes: [] }]);
  };

  const updateEdu = (i: number, field: string, value: string) => {
    const next = [...cv.education];
    // @ts-expect-error dynamic
    next[i][field] = value;
    updateSection('education', next);
  };

  return (
    <div className="space-y-4">
      {cv.education.map((edu, i) => (
        <div key={i} className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Abschluss</label>
            <input className="mt-1 w-full rounded border p-2" value={edu.degree} onChange={(e) => updateEdu(i, 'degree', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Schule</label>
            <input className="mt-1 w-full rounded border p-2" value={edu.school} onChange={(e) => updateEdu(i, 'school', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Stadt</label>
            <input className="mt-1 w-full rounded border p-2" value={edu.city ?? ''} onChange={(e) => updateEdu(i, 'city', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Abschlussdatum</label>
            <input className="mt-1 w-full rounded border p-2" value={edu.graduation ?? ''} onChange={(e) => updateEdu(i, 'graduation', e.target.value)} />
          </div>
        </div>
      ))}
      <button type="button" onClick={addEdu} className="rounded bg-black px-4 py-2 text-white">Ausbildung hinzufügen</button>
    </div>
  );
}

