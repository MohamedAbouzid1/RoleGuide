'use client';

import { useCVStore } from '@/lib/store';
import { Evaluation } from '@/lib/types';

export function SkillsSection({ evaluation }: { evaluation: Evaluation | null }) {
  const { cv, updateSection } = useCVStore();

  const addCategory = () => updateSection('skills', [...cv.skills, { category: '', items: [] }]);
  const updateCategoryName = (i: number, value: string) => {
    const next = [...cv.skills];
    next[i].category = value;
    updateSection('skills', next);
  };
  const removeCategory = (i: number) => {
    const next = [...cv.skills];
    next.splice(i, 1);
    updateSection('skills', next);
  };
  const addItem = (i: number) => {
    const next = [...cv.skills];
    next[i].items.push({ name: '', level: 50 });
    updateSection('skills', next);
  };
  const updateItem = (i: number, j: number, field: 'name' | 'level', value: string | number) => {
    const next = [...cv.skills];
    // @ts-expect-error dynamic
    next[i].items[j][field] = value;
    updateSection('skills', next);
  };
  const removeItem = (i: number, j: number) => {
    const next = [...cv.skills];
    next[i].items.splice(j, 1);
    updateSection('skills', next);
  };

  return (
    <div className="space-y-5">
      {cv.skills.map((cat, i) => (
        <div key={i} className="rounded border p-3">
          <div className="mb-2 flex items-center gap-2">
            <input className="w-full rounded border p-2" placeholder="Kategorie (z.B. Programmiersprachen)" value={cat.category}
              onChange={(e) => updateCategoryName(i, e.target.value)} />
            <button type="button" onClick={() => removeCategory(i)} className="rounded border px-3 py-2 text-sm">Entfernen</button>
          </div>
          <div className="space-y-2">
            {cat.items.map((item, j) => (
              <div key={j} className="grid grid-cols-[1fr_220px_90px] items-center gap-3">
                <input className="rounded border p-2" placeholder="Fähigkeit" value={item.name}
                  onChange={(e) => updateItem(i, j, 'name', e.target.value)} />
                <div className="flex items-center gap-2">
                  <input type="range" min={0} max={100} step={10} value={item.level}
                    onChange={(e) => updateItem(i, j, 'level', Number(e.target.value))} />
                  <span className="w-16 text-right text-sm">Level {Math.round(item.level / 10)}/10</span>
                </div>
                <button type="button" onClick={() => removeItem(i, j)} className="justify-self-end rounded border px-3 py-2 text-sm">Löschen</button>
              </div>
            ))}
            <button type="button" onClick={() => addItem(i)} className="rounded border px-3 py-1 text-sm">Fähigkeit hinzufügen</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addCategory} className="rounded bg-black px-4 py-2 text-white">Kategorie hinzufügen</button>
      {evaluation && evaluation.keywordsToAdd.length > 0 && (
        <div className="rounded border bg-blue-50 p-3 text-sm">
          <div className="font-medium">Empfohlene Keywords</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {evaluation.keywordsToAdd.map((k, i) => (
              <span key={i} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs">{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

