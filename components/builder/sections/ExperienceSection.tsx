'use client';

import { useCVStore } from '@/lib/store';
import { Evaluation } from '@/lib/types';

export function ExperienceSection({ evaluation }: { evaluation: Evaluation | null }) {
  const { cv, updateSection } = useCVStore();

  const addExperience = () => {
    updateSection('experience', [
      ...cv.experience,
      { role: '', company: '', city: '', start: '', end: '', bullets: [] },
    ]);
  };

  const updateExp = (idx: number, field: string, value: string) => {
    const next = [...cv.experience];
    // @ts-expect-error dynamic
    next[idx][field] = value;
    updateSection('experience', next);
  };

  const addBullet = (idx: number) => {
    const next = [...cv.experience];
    next[idx].bullets = [...next[idx].bullets, ''];
    updateSection('experience', next);
  };

  const updateBullet = (idx: number, bIdx: number, value: string) => {
    const next = [...cv.experience];
    next[idx].bullets[bIdx] = value;
    updateSection('experience', next);
  };

  return (
    <div className="space-y-4">
      {cv.experience.map((exp, i) => (
        <div key={i} className="rounded border p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Rolle</label>
              <input className="mt-1 w-full rounded border p-2" value={exp.role} onChange={(e) => updateExp(i, 'role', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Firma</label>
              <input className="mt-1 w-full rounded border p-2" value={exp.company} onChange={(e) => updateExp(i, 'company', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Stadt</label>
              <input className="mt-1 w-full rounded border p-2" value={exp.city ?? ''} onChange={(e) => updateExp(i, 'city', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Start (MM.YYYY)</label>
                <input className="mt-1 w-full rounded border p-2" value={exp.start} onChange={(e) => updateExp(i, 'start', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm">Ende (MM.YYYY/Heute)</label>
                <input className="mt-1 w-full rounded border p-2" value={exp.end ?? ''} onChange={(e) => updateExp(i, 'end', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-2 text-sm font-medium">Aufzählungspunkte</div>
            {exp.bullets.map((b, j) => (
              <input key={j} className="mb-2 w-full rounded border p-2" value={b} onChange={(e) => updateBullet(i, j, e.target.value)} />
            ))}
            <button type="button" onClick={() => addBullet(i)} className="rounded border px-3 py-1 text-sm">Punkt hinzufügen</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addExperience} className="rounded bg-black px-4 py-2 text-white">Erfahrung hinzufügen</button>
      {evaluation && evaluation.sectionFeedback.length > 0 && (
        <div className="rounded border bg-yellow-50 p-3 text-sm">
          <div className="font-medium">Feedback</div>
          <ul className="list-disc pl-5">
            {evaluation.sectionFeedback.flatMap((s, k) => s.comments.map((c, j) => <li key={`${k}-${j}`}>{c}</li>))}
          </ul>
        </div>
      )}
    </div>
  );
}

