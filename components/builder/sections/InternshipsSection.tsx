'use client';

import { useCVStore } from '@/lib/store';
import { Evaluation } from '@/lib/types';

export function InternshipsSection({ evaluation }: { evaluation: Evaluation | null }) {
  const { cv, updateSection } = useCVStore();

  const addInternship = () => {
    updateSection('internships', [
      ...cv.internships,
      { role: '', company: '', city: '', start: '', end: '', bullets: [] },
    ]);
  };

  const updateInternship = (idx: number, field: string, value: string) => {
    const next = [...cv.internships];
    // @ts-expect-error dynamic
    next[idx][field] = value;
    updateSection('internships', next);
  };

  const addBullet = (idx: number) => {
    const next = [...cv.internships];
    next[idx].bullets = [...next[idx].bullets, ''];
    updateSection('internships', next);
  };

  const updateBullet = (idx: number, bIdx: number, value: string) => {
    const next = [...cv.internships];
    next[idx].bullets[bIdx] = value;
    updateSection('internships', next);
  };

  return (
    <div className="space-y-4">
      {cv.internships.map((internship, i) => (
        <div key={i} className="rounded border p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Rolle</label>
              <input className="mt-1 w-full rounded border p-2" value={internship.role} onChange={(e) => updateInternship(i, 'role', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Unternehmen</label>
              <input className="mt-1 w-full rounded border p-2" value={internship.company} onChange={(e) => updateInternship(i, 'company', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Stadt</label>
              <input className="mt-1 w-full rounded border p-2" value={internship.city ?? ''} onChange={(e) => updateInternship(i, 'city', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm">Start (MM.YYYY)</label>
                <input className="mt-1 w-full rounded border p-2" value={internship.start} onChange={(e) => updateInternship(i, 'start', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm">Ende (MM.YYYY)</label>
                <input className="mt-1 w-full rounded border p-2" value={internship.end ?? ''} onChange={(e) => updateInternship(i, 'end', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm">Aufzählungspunkte</label>
            {internship.bullets.map((bullet, j) => (
              <input key={j} className="mb-2 w-full rounded border p-2" value={bullet} onChange={(e) => updateBullet(i, j, e.target.value)} />
            ))}
            <button className="rounded bg-blue-500 px-3 py-1 text-white" onClick={() => addBullet(i)}>
              Punkt hinzufügen
            </button>
          </div>
        </div>
      ))}
      <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={addInternship}>
        Praktikum hinzufügen
      </button>
    </div>
  );
}
