'use client';

export function Switch({ checked, onCheckedChange, onClick }: { checked: boolean; onCheckedChange: (v: boolean) => void; onClick?: (e: any) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCheckedChange(!checked);
        }
      }}
      onClick={(e) => { onClick?.(e); onCheckedChange(!checked); }}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

