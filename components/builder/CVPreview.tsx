'use client';

import { CV, SectionVisibility } from '@/lib/types';
import { MdEmail, MdLocationOn, MdPhone, MdLanguage, MdWork, MdCode } from 'react-icons/md';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

interface CVPreviewProps {
  cv: CV;
  sectionVisibility: SectionVisibility;
}

export function CVPreview({ cv, sectionVisibility }: CVPreviewProps) {
  return (
    <div className="mx-auto max-w-[210mm] bg-white p-[18mm] shadow-lg font-sans" style={{ minHeight: '297mm' }}>
      {/* Header with name and title on same line, contact info in grid, photo on right */}
      {sectionVisibility.personal && (
        <header className="mb-6 pb-2">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              {/* Name and title in column layout */}
              <div className="flex flex-col mb-4">
                <h1 className="text-[28px] font-bold text-black">
                  {cv.personal.fullName || 'Ihr Name'}
                </h1>
                {cv.personal.role && (
                  <span className="text-[12px] font-normal text-gray-600 italic mt-1">
                    {cv.personal.role}
                  </span>
                )}
              </div>
              
              {/* Contact info in two-column grid with icons */}
              <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-[12px] text-black">
                {/* Left column */}
                <div className="space-y-2">
                  {cv.personal.email && (
                    <div className="flex items-center gap-2">
                      <MdEmail className="text-[12px] text-black" />
                      <span>{cv.personal.email}</span>
                    </div>
                  )}
                  {(cv.personal.address?.street || cv.personal.address?.city) && (
                    <div className="flex items-center gap-2">
                      <MdLocationOn className="text-[12px] text-black" />
                      <span>
                        {[cv.personal.address?.street, cv.personal.address?.postalCode].filter(Boolean).join(', ')}
                        {cv.personal.address?.city && ` ${cv.personal.address.city}`}
                      </span>
                    </div>
                  )}
                  {cv.personal.linkedinUrl && (
                    <div className="flex items-center gap-2">
                      <FaLinkedin className="text-[12px] text-black" />
                      <a href={cv.personal.linkedinUrl} className="text-black underline">LinkedIn</a>
                    </div>
                  )}
                </div>
                
                {/* Right column */}
                <div className="space-y-2">
                  {cv.personal.phone && (
                    <div className="flex items-center gap-2">
                      <MdPhone className="text-[12px] text-black" />
                      <span>{cv.personal.phone}</span>
                    </div>
                  )}
                  {cv.personal.nationality && (
                    <div className="flex items-center gap-2">
                      <MdLanguage className="text-[12px] text-black" />
                      <span>{cv.personal.nationality}</span>
                    </div>
                  )}
                  {cv.personal.githubUrl && (
                    <div className="flex items-center gap-2">
                      <FaGithub className="text-[12px] text-black" />
                      <a href={cv.personal.githubUrl} className="text-black underline">GitHub</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Photo */}
            {cv.personal.includePhoto && cv.personal.photoUrl && (
              <div className="h-[110px] w-[110px] overflow-hidden rounded-full border border-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cv.personal.photoUrl} alt="Foto" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </header>
      )}

      {/* Profile */}
      {sectionVisibility.profile && cv.profile?.summary && (
        <section className="mb-4">
          <div className="mb-2">
            <h2 className="text-[14px] font-bold text-black mb-1">Profil</h2>
            <div className="h-[1px] w-full bg-black"></div>
          </div>
          <div className="text-[12px] text-black leading-tight">
            {cv.profile.summary}
          </div>
        </section>
      )}

      {/* Software Projects */}
      {sectionVisibility.projects && cv.projects && cv.projects.length > 0 && (
        <section className="mb-4">
          <div className="mb-2">
            <h2 className="text-[14px] font-bold text-black mb-1">Softwareprojekte</h2>
            <div className="h-[1px] w-full bg-black"></div>
          </div>
          <div className="space-y-3">
            {cv.projects.map((project, i) => (
              <div key={i}>
                <div className="text-[12px] text-black mb-1">{project.date || '2025'}</div>
                <div className="text-[12px] font-bold text-black mb-1">{project.name}</div>
                <div className="text-[12px] text-black mb-2 italic">{project.description}</div>
                {project.bullets && project.bullets.length > 0 && (
                  <ul className="text-[12px] text-black space-y-1">
                    {project.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience && (
        <section className="mb-4">
          <div className="mb-2">
            <h2 className="text-[14px] font-bold text-black mb-1">Berufserfahrung</h2>
            <div className="h-[1px] w-full bg-black"></div>
          </div>
          {cv.experience.length === 0 && (
            <div className="text-sm text-gray-500">Noch keine Einträge</div>
          )}
          <div className="space-y-3">
            {cv.experience.map((exp, i) => (
              <div key={i} className="grid grid-cols-[170px_1fr] gap-4">
                <div className="text-[12px] text-black">
                  {exp.start} - {exp.end || '10.2025'}
                  {exp.city && <div>{exp.city}</div>}
                </div>
                <div>
                  <div className="text-[12px] font-bold text-black mb-1">{exp.role}</div>
                  <div className="text-[12px] text-black mb-2 italic">{exp.company}</div>
                  {exp.bullets.length > 0 && (
                    <ul className="text-[12px] text-black space-y-1">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education && (
        <section className="mb-4">
          <div className="mb-2">
            <h2 className="text-[14px] font-bold text-black mb-1">Ausbildung</h2>
            <div className="h-[1px] w-full bg-black"></div>
          </div>
          {cv.education.length === 0 && (
            <div className="text-sm text-gray-500">Noch keine Einträge</div>
          )}
          <div className="space-y-3">
            {cv.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-[170px_1fr] gap-4">
                <div className="text-[12px] text-black">
                  {edu.graduation || '10.2023 - 10.2025'}
                  {edu.city && <div>{edu.city}</div>}
                </div>
                <div>
                  <div className="text-[12px] font-bold text-black mb-1">{edu.degree}</div>
                  <div className="text-[12px] text-black mb-2 italic">{edu.school}</div>
                  {edu.notes && edu.notes.length > 0 && (
                    <div className="text-[12px] text-black">
                      {edu.notes.map((note, j) => (
                        <div key={j}>{note}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {sectionVisibility.skills && cv.skills.length > 0 && (
        <section className="mb-4">
          <div className="mb-2">
            <h2 className="text-[14px] font-bold text-black mb-1">Technische Kenntnisse</h2>
            <div className="h-[1px] w-full bg-black"></div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {cv.skills.map((cat, i) => (
              <div key={i}>
                <div className="text-[12px] font-bold text-black mb-2">{cat.category}</div>
                <div className="space-y-1">
                  {cat.items.map((item, j) => (
                    <div key={j} className="text-[12px] text-black">
                      {item.name}
                      {item.level && (
                        <span className="text-gray-600">
                          {item.level >= 80 ? ' (fortgeschritten)' : 
                           item.level >= 60 ? ' (Grundkenntnisse)' : 
                           item.level >= 40 ? ' (Grundlagen)' : ''}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Internships */}
      {sectionVisibility.internships && cv.internships && cv.internships.length > 0 && (
        <section className="mb-4">
          <div className="mb-2">
            <h2 className="text-[14px] font-bold text-black mb-1">Praktika</h2>
            <div className="h-[1px] w-full bg-black"></div>
          </div>
          <div className="space-y-3">
            {cv.internships.map((internship, i) => (
              <div key={i} className="grid grid-cols-[150px_1fr] gap-2">
                <div className="text-[12px] text-black">
                  {internship.start} - {internship.end || 'Heute'}
                  {internship.city && <div>{internship.city}</div>}
                </div>
                <div>
                  <div className="text-[12px] font-bold text-black mb-1">{internship.role}</div>
                  <div className="text-[12px] text-black mb-2 italic">{internship.company}</div>
                  {internship.bullets.length > 0 && (
                    <ul className="text-[12px] text-black space-y-1">
                      {internship.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {sectionVisibility.languages && cv.languages.length > 0 && (
        <section className="mb-4">
          <div className="mb-2">
            <h2 className="text-[14px] font-bold text-black mb-1">Sprachen</h2>
            <div className="h-[1px] w-full bg-black"></div>
          </div>
          <div className="grid grid-cols-3 gap-x-8 text-[12px] text-black">
            {cv.languages.map((lang, i) => (
              <div key={i}>
                <div className="font-bold">{lang.name}</div>
                <div>
                  {lang.level === 'C2' ? 'Verhandlungssicher' :
                   lang.level === 'C1' ? 'Verhandlungssicher' :
                   lang.level === 'B2' ? 'Verhandlungssicher' :
                   lang.level === 'A1' ? 'Muttersprache' :
                   lang.level}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      <section className="mb-6">
        <div className="mb-2">
          <h2 className="text-[14px] font-bold text-black mb-1">Interessen</h2>
          <div className="h-[1px] w-full bg-black"></div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 text-[12px] text-black">
          <div className="space-y-1">
            <div>• Open-Source-Entwicklung</div>
            <div>• Backend-Architekturen</div>
          </div>
          <div className="space-y-1">
            <div>• Cloud-native Anwendungen</div>
            <div>• Content-creation</div>
          </div>
        </div>
      </section>

      {/* Closing with signature */}
      {(cv.personal.signatureUrl || cv.closing?.place || cv.closing?.date) && (
        <section className="mt-8">
          <div className="grid grid-cols-2 items-end">
            <div>
              {cv.personal.signatureUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cv.personal.signatureUrl} alt="Unterschrift" className="h-16" />
              )}
              <div className="mt-2 text-[12px] text-black">{cv.personal.fullName}</div>
            </div>
            <div className="text-right text-[12px] text-black">
              {[cv.closing?.place, cv.closing?.date].filter(Boolean).join(', ')}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}