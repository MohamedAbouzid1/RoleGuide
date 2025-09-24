'use client';

import { useCVStore } from '@/lib/store';

export function PersonalSection() {
  const { cv, updateSection } = useCVStore();
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Vollständiger Name</label>
        <input className="mt-1 w-full rounded border p-2" value={cv.personal.fullName}
          onChange={(e) => updateSection('personal', { ...cv.personal, fullName: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Adresse</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input className="rounded border p-2" placeholder="Straße & Nr." value={cv.personal.address?.street ?? ''}
              onChange={(e) => updateSection('personal', { ...cv.personal, address: { ...cv.personal.address, street: e.target.value } })} />
            <input className="rounded border p-2" placeholder="PLZ" value={cv.personal.address?.postalCode ?? ''}
              onChange={(e) => updateSection('personal', { ...cv.personal, address: { ...cv.personal.address, postalCode: e.target.value } })} />
            <input className="rounded border p-2" placeholder="Stadt" value={cv.personal.address?.city ?? cv.personal.city ?? ''}
              onChange={(e) => updateSection('personal', { ...cv.personal, address: { ...cv.personal.address, city: e.target.value } })} />
            <input className="rounded border p-2" placeholder="Land" value={cv.personal.address?.country ?? ''}
              onChange={(e) => updateSection('personal', { ...cv.personal, address: { ...cv.personal.address, country: e.target.value } })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">E-Mail</label>
          <input className="mt-1 w-full rounded border p-2" value={cv.personal.email}
            onChange={(e) => updateSection('personal', { ...cv.personal, email: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Telefon</label>
          <input className="mt-1 w-full rounded border p-2" value={cv.personal.phone ?? ''}
            onChange={(e) => updateSection('personal', { ...cv.personal, phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Foto (optional)</label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = reader.result as string;
                  updateSection('personal', { ...cv.personal, photoUrl: dataUrl, includePhoto: true });
                };
                reader.readAsDataURL(file);
              }}
            />
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!cv.personal.includePhoto}
                onChange={(e) => updateSection('personal', { ...cv.personal, includePhoto: e.target.checked })}
              />
              Foto anzeigen
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">Website</label>
          <input className="mt-1 w-full rounded border p-2" placeholder="https://…" value={cv.personal.websiteUrl ?? ''}
            onChange={(e) => updateSection('personal', { ...cv.personal, websiteUrl: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">LinkedIn</label>
          <input className="mt-1 w-full rounded border p-2" placeholder="https://linkedin.com/in/..." value={cv.personal.linkedinUrl ?? ''}
            onChange={(e) => updateSection('personal', { ...cv.personal, linkedinUrl: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">GitHub</label>
          <input className="mt-1 w-full rounded border p-2" placeholder="https://github.com/..." value={cv.personal.githubUrl ?? ''}
            onChange={(e) => updateSection('personal', { ...cv.personal, githubUrl: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Unterschrift (optional)</label>
          <input
            className="mt-1 w-full"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result as string;
                updateSection('personal', { ...cv.personal, signatureUrl: dataUrl });
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ort & Datum (optional)</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input className="rounded border p-2" placeholder="Ort" value={cv.closing?.place ?? ''}
              onChange={(e) => updateSection('closing', { ...(cv.closing || {}), place: e.target.value })} />
            <input className="rounded border p-2" placeholder="TT.MM.JJJJ" value={cv.closing?.date ?? ''}
              onChange={(e) => updateSection('closing', { ...(cv.closing || {}), date: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}

