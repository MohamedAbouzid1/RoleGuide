"use client";

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
  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onSave} disabled={saving} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
          {saving ? 'Speichern...' : isDirty ? 'Speichern' : 'Gespeichert'}
        </button>
        <button onClick={onEvaluate} disabled={evaluating} className="rounded border px-4 py-2 disabled:opacity-50">
          {evaluating ? 'Bewerten...' : 'Bewerten'}
        </button>
        <button onClick={onExport} className="rounded border px-4 py-2">Als PDF exportieren</button>
      </div>
      <div className="text-sm text-gray-700">
        {evaluation ? `Gesamt: ${evaluation.overallScore}/100` : 'Noch keine Bewertung'}
      </div>
    </div>
  );
}

