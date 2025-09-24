'use client';

import { CV, SectionVisibility } from '@/lib/types';

interface CVPreviewProps {
  cv: CV;
  sectionVisibility: SectionVisibility;
}

export function CVPreview({ cv, sectionVisibility }: CVPreviewProps) {
  return (
    <div className="mx-auto max-w-[210mm] bg-white p-[18mm] shadow-lg" style={{ minHeight: '297mm' }}>
      {/* Header with name on left, photo on right */}
      {sectionVisibility.personal && (
        <header className="mb-6 pb-2">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">
                {cv.personal.fullName || 'Ihr Name'}
              </h1>
              <div className="mt-4 grid grid-cols-[140px_1fr] gap-y-1 text-[12px] leading-5 text-gray-800">
                {(cv.personal.phone || cv.personal.email) && (<><div className="font-semibold italic text-gray-700">Kontaktdaten</div><div>{[cv.personal.phone, cv.personal.email].filter(Boolean).join(' • ')}</div></>)}
                {(cv.personal.address?.street || cv.personal.address?.city || cv.personal.address?.country) && (
                  <>
                    <div className="font-semibold italic text-gray-700">Adresse</div>
                    <div>
                      {[cv.personal.address?.street, cv.personal.address?.postalCode].filter(Boolean).join(', ')}
                      <br />
                      {[cv.personal.address?.city, cv.personal.address?.country].filter(Boolean).join(', ')}
                    </div>
                  </>
                )}
                {(cv.personal.websiteUrl || cv.personal.linkedinUrl || cv.personal.githubUrl) && (
                  <>
                    <div className="font-semibold italic text-gray-700">Links</div>
                    <div className="flex flex-wrap gap-3">
                      {cv.personal.websiteUrl && <a className="text-blue-700 underline" href={cv.personal.websiteUrl}>Website</a>}
                      {cv.personal.linkedinUrl && <a className="text-blue-700 underline" href={cv.personal.linkedinUrl}>LinkedIn</a>}
                      {cv.personal.githubUrl && <a className="text-blue-700 underline" href={cv.personal.githubUrl}>GitHub</a>}
                    </div>
                  </>
                )}
              </div>
            </div>
            {cv.personal.includePhoto && cv.personal.photoUrl && (
              <div className="h-[110px] w-[110px] overflow-hidden rounded-sm border border-gray-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cv.personal.photoUrl} alt="Foto" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </header>
      )}

      {/* Beruf */}
      {sectionVisibility.experience && (
        <section className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-gray-900">Beruf</h2>
            <div className="h-[2px] w-full translate-x-4 bg-gray-800" />
          </div>
          {cv.experience.length === 0 && (
            <div className="text-sm text-gray-500">Noch keine Einträge</div>
          )}
          <div className="space-y-4">
            {cv.experience.map((exp, i) => (
              <div key={i} className="grid grid-cols-[170px_1fr] gap-4">
                <div className="text-[12px] italic text-gray-700">
                  {exp.start} – {exp.end || 'laufend'}
                </div>
                <div>
                  <div className="text-[13px] text-gray-900">
                    <span className="font-medium">{exp.role}</span> bei <span className="font-semibold">{exp.company}</span>{exp.city ? `, ${exp.city}` : ''}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="mt-1 list-disc pl-5 text-[12px] text-gray-800">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="mb-0.5">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Studium & Ausbildung */}
      {sectionVisibility.education && (
        <section className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-gray-900">Studium & Ausbildung</h2>
            <div className="h-[2px] w-full translate-x-4 bg-gray-800" />
          </div>
          {cv.education.length === 0 && (
            <div className="text-sm text-gray-500">Noch keine Einträge</div>
          )}
          <div className="space-y-3">
            {cv.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-[170px_1fr] gap-4">
                <div className="text-[12px] italic text-gray-700">{edu.graduation || ''}</div>
                <div className="text-[13px] text-gray-900">
                  <div className="font-semibold">{edu.degree}</div>
                  <div className="text-[12px] text-gray-800">{edu.school}{edu.city ? `, ${edu.city}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills && cv.skills.length > 0 && (
        <section className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-gray-900">Fähigkeiten</h2>
            <div className="h-[2px] w-full translate-x-4 bg-gray-800" />
          </div>
          <div className="space-y-3">
            {cv.skills.map((cat, i) => (
              <div key={i}>
                <div className="text-[12px] font-semibold text-gray-900">{cat.category || 'Kategorie'}</div>
                <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-2">
                  {cat.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-40 text-[12px] text-gray-800">{item.name}</div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }).map((_, k) => {
                          const filled = item.level >= (k + 1) * 10;
                          return <span key={k} className={`inline-block h-2 w-2 rounded-full ${filled ? 'bg-gray-900' : 'border border-gray-400'}`} />;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {sectionVisibility.languages && cv.languages.length > 0 && (
        <section className="mb-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-gray-900">Sprachkenntnisse</h2>
            <div className="h-[2px] w-full translate-x-4 bg-gray-800" />
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-[12px] text-gray-900">
            {cv.languages.map((lang, i) => (
              <div key={i}><span className="font-medium">{lang.name}</span>: {lang.level}</div>
            ))}
          </div>
        </section>
      )}

      {/* Closing with signature */}
      {(cv.personal.signatureUrl || cv.closing?.place || cv.closing?.date) && (
        <section className="mt-8">
          <div className="grid grid-cols-2 items-end">
            <div>
              {cv.personal.signatureUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cv.personal.signatureUrl} alt="Unterschrift" className="h-16" />
              )}
              <div className="mt-2 text-[12px] text-gray-800">{cv.personal.fullName}</div>
            </div>
            <div className="text-right text-[12px] text-gray-800">
              {[cv.closing?.place, cv.closing?.date].filter(Boolean).join(', ')}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}