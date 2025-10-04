# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start Next.js development server (http://localhost:3000)
- `pnpm build` - Production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Testing
- `pnpm test` - Run Vitest tests

### Database
- `pnpm db:push` - Push Prisma schema to database
- `pnpm db:migrate` - Run Prisma migration in dev mode
- `pnpm db:seed` - Run seed script (prisma/seed.ts)

### Running a Single Test
```bash
pnpm test path/to/test-file.test.ts
```

## Architecture

### State Management & Data Flow
- **Zustand store** (`lib/store.ts`) manages CV builder state client-side with `useCVStore`
- CV state includes `cv` data, `sectionVisibility`, `isDirty` flag, and `lastSaved` timestamp
- **Autosave**: Builder pages autosave every 10 seconds when `isDirty` is true
- **Manual saves** create snapshots via `/api/drafts/[id]/snapshot`
- State flows: User edits → Zustand store → API routes → Prisma → PostgreSQL

### API Routes Architecture
API routes exist in two locations due to Next.js 14 App Router migration:
- **Source**: `api/` directory (contains actual implementation)
- **Re-exports**: `app/api/` directory (re-exports for routing)

When modifying API routes, edit files in `api/` directory. The `app/api/` structure mirrors this for Next.js routing.

Key endpoints:
- `POST /api/drafts` - Create draft
- `PUT /api/drafts/[id]` - Update draft (full)
- `PATCH /api/drafts/[id]` - Update evaluation scores only
- `POST /api/drafts/[id]/snapshot` - Create snapshot
- `POST /api/evaluate` - Evaluate CV (currently uses mock AI)
- `POST /api/export/pdf` - Export PDF using @react-pdf/renderer

### CV Data Model
The CV type (`lib/types.ts`) is the central data structure:
- **Sections**: personal, profile, experience, education, skills, languages, plus optional sections (certificates, projects, volunteering, references)
- **Format**: German market conventions (MM.YYYY dates, CEFR language levels A1-C2)
- **Storage**: Stored as JSON in Draft.data field (Prisma schema)

### Evaluation System
Two-tier evaluation system (`lib/scoring.ts` + `lib/ai.ts`):
1. **Deterministic scoring** (`scoreCV`): Rule-based checks for structure, content quality, language, ATS compliance, and GDPR compliance
2. **AI evaluation** (`evaluateResume`): Currently mocked, returns mock insights. Designed to be replaced with Claude API integration
3. **Merged results**: Combines deterministic + AI scores, averages them

Evaluation produces: `overallScore`, `atsScore`, `redFlags`, `quickWins`, `sectionFeedback`, `improvedBullets`, `keywordsToAdd`

### Component Organization
- `components/builder/` - Form sections and builder UI
  - `CVForm.tsx` - Accordion wrapper with section visibility toggles
  - `sections/*Section.tsx` - Individual form sections (Personal, Experience, etc.)
  - `CVPreview.tsx` - Live preview matching PDF layout
  - `Toolbar.tsx` - Save/evaluate/export actions
- `components/pdf/CVTemplate.tsx` - PDF export layout (@react-pdf/renderer)
- `components/ui/` - Shadcn UI components

### Authentication
- NextAuth v4 with JWT sessions (`lib/auth.ts`)
- Credentials provider + optional Google OAuth
- Protected API routes use `getServerSession`
- Registration: `POST /api/auth/register` with `{ email, password, name? }`

### Database Schema (Prisma)
Key models:
- **User**: Auth data, relations to drafts
- **Draft**: CV data (JSON), evaluation scores, snapshots
- **Snapshot**: Point-in-time CV data backups
- **Account/Session**: NextAuth tables

Cascade deletes configured on user → drafts → snapshots.

## Development Notes

### Date Format Validation
Use `isValidDateFormat()` from `lib/scoring.ts` - expects MM.YYYY format for German CVs.

### Adding New CV Sections
1. Update `CV` type in `lib/types.ts`
2. Add to `initialCV` in `lib/store.ts`
3. Add to `SectionVisibility` type and `initialVisibility`
4. Create section component in `components/builder/sections/`
5. Add AccordionItem in `CVForm.tsx`
6. Update `CVPreview.tsx` and `CVTemplate.tsx` for rendering
7. Update scoring logic in `lib/scoring.ts` if needed

### PDF vs Preview Consistency
The preview (`CVPreview.tsx`) mirrors the PDF layout to ensure WYSIWYG. When modifying PDF layout in `CVTemplate.tsx`, update `CVPreview.tsx` correspondingly.

### Mocked AI Integration
`lib/ai.ts` contains mock evaluation. To integrate real AI:
1. Replace `mockAIEvaluation()` with actual API call
2. Use prompts from `lib/prompts.ts`
3. Update `setAIProvider()` function for provider switching
