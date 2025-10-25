# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (Root Directory)
- `pnpm dev` - Start Next.js development server (http://localhost:3000)
- `pnpm build` - Production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run Vitest tests
- `pnpm test path/to/test-file.test.ts` - Run single test file
- `pnpm db:push` - Push Prisma schema to database
- `pnpm db:migrate` - Run Prisma migration in dev mode
- `pnpm db:seed` - Run seed script (prisma/seed.ts)

### Backend (Server Directory)
- `cd server && pnpm dev` - Start Express dev server with nodemon (http://localhost:4000)
- `cd server && pnpm start` - Start production server
- `cd server && pnpm db:push` - Push server Prisma schema to database
- `cd server && pnpm db:migrate` - Run migrations
- `cd server && pnpm db:migrate:deploy` - Deploy migrations to production
- `cd server && pnpm db:studio` - Open Prisma Studio GUI
- `cd server && pnpm db:backup` - Backup database
- `cd server && pnpm db:restore` - Restore from backup
- `cd server && pnpm db:cleanup` - Clean soft-deleted records
- `cd server && pnpm db:monitor` - Monitor database statistics

### Development Workflow
1. Start backend: `cd server && pnpm dev` (Terminal 1)
2. Start frontend: `pnpm dev` (Terminal 2)
3. Both servers must run concurrently for full functionality

## Architecture

### Two-Server Architecture
This application uses a **separate frontend and backend**:
- **Frontend**: Next.js 14 on port 3000 (`app/`, `components/`, `lib/`)
- **Backend**: Express.js on port 4000 (`server/src/`)
- Communication via REST API at `http://localhost:4000/api`
- Frontend uses `lib/api-client.ts` to communicate with backend

### State Management & Data Flow
- **Zustand store** (`lib/store.ts`) manages CV builder state client-side with `useCVStore`
- CV state includes `cv` data, `sectionVisibility`, `isDirty` flag, and `lastSaved` timestamp
- **Autosave**: Builder pages autosave every 10 seconds when `isDirty` is true
- **Auth Context** (`lib/auth-context.tsx`) manages user authentication state and JWT token
- **Language Context** (`lib/language-context.tsx`) manages i18n state (German/English)
- State flows: User edits → Zustand store → API client → Backend API → Prisma → PostgreSQL

### API Client Architecture
All backend communication goes through `lib/api-client.ts`:
- Base URL: `http://localhost:4000/api` (configurable via `NEXT_PUBLIC_API_URL`)
- Automatically includes JWT token in `Authorization: Bearer <token>` header
- Organized into domain modules: `authApi`, `draftsApi`, `pdfApi`
- Token stored in localStorage as `auth_token`

Example usage:
```typescript
import { draftsApi } from '@/lib/api-client';
const drafts = await draftsApi.getAll();
const draft = await draftsApi.getById(id);
await draftsApi.update(id, { title, data });
```

### Backend API Routes (Express)
Located in `server/src/routes/`:

**Auth Routes** (`POST /api/auth/`):
- `POST /api/auth/register` - Register user → returns `{ user, accessToken, refreshToken }`
- `POST /api/auth/login` - Login user → returns JWT token
- `GET /api/auth/session` - Verify current session (requires auth)

**Drafts Routes** (`/api/drafts/`):
- `GET /api/drafts` - List user's CV drafts
- `POST /api/drafts` - Create new draft
- `GET /api/drafts/:id` - Get specific draft
- `PUT /api/drafts/:id` - Update full draft (title + CV data)
- `PATCH /api/drafts/:id` - Update evaluation scores only
- `DELETE /api/drafts/:id` - Delete draft
- `POST /api/drafts/:id/snapshot` - Create point-in-time backup

**PDF Routes** (`/api/pdf/`):
- `POST /api/pdf/export` - Generate PDF from CV data

All protected routes require JWT token in Authorization header.

### CV Data Model
The CV type (`lib/types.ts`) is the central data structure:
- **Sections**: personal, profile, experience, education, internships, skills, languages
- **Optional sections**: certificates, projects, volunteering, references, closing
- **Format**: German market conventions (MM.YYYY dates, CEFR language levels A1-C2)
- **Storage**: Stored as JSON in Draft.data field (Prisma schema)

Key fields:
```typescript
personal: { fullName, email, role?, address?, phone?, nationality?, photoUrl?, includePhoto?, websiteUrl?, linkedinUrl?, githubUrl?, links?, signatureUrl? }
experience: [{ role, company, city?, start, end?, bullets[] }]
education: [{ degree, school, city?, graduation?, notes? }]
skills: [{ category, items: [{ name, level }] }]
languages: [{ name, level: "A1"|"A2"|"B1"|"B2"|"C1"|"C2" }]
```

### Component Organization
- `components/builder/` - Form sections and builder UI
  - `CVForm.tsx` - Accordion wrapper with section visibility toggles
  - `sections/*Section.tsx` - Individual form sections (Personal, Experience, etc.)
  - `CVPreview.tsx` - Live preview matching PDF layout (WYSIWYG)
  - `Toolbar.tsx` - Save/evaluate/export actions
- `components/pdf/CVTemplate.tsx` - PDF export layout (@react-pdf/renderer)
- `components/ui/` - Shadcn UI components (Radix-based)
- `server/src/pdf/CVTemplate.js` - Server-side PDF template (mirrors frontend)

### Authentication
- **JWT-based authentication** with Express backend (not NextAuth)
- Tokens generated on login/register with `bcryptjs` password hashing
- Token verification via `authenticateToken` middleware in `server/src/middleware/auth.js`
- Frontend stores token in localStorage and includes in all API requests
- Auth context (`lib/auth-context.tsx`) provides `useAuth()` hook for login/logout/register
- Refresh tokens stored in database with 7-day expiry

Flow:
1. User submits credentials → `POST /api/auth/login`
2. Backend validates → returns JWT token
3. Frontend stores in localStorage → includes in all requests
4. Backend middleware verifies token → attaches user to `req.user`

### Database Schema (Prisma)
Two separate Prisma schemas:
- **Frontend** (`prisma/schema.prisma`) - Shared types
- **Backend** (`server/prisma/schema.prisma`) - Extended with soft deletes and refresh tokens

Key models:
- **User**: Auth data (email, password hash, name), relations to drafts
- **Draft**: CV data (JSON), evaluation scores (`overallScore`, `atsScore`), `lastEvaluation` JSON
- **Snapshot**: Point-in-time CV data backups
- **RefreshToken**: JWT refresh tokens with revocation support

Cascade deletes: User deletion → deletes all drafts → deletes all snapshots

Backend schema includes:
- Soft delete support (`deletedAt`, `deletedBy` fields)
- Middleware filters soft-deleted records from queries
- Enables "undelete" functionality

## Development Notes

### Date Format Validation
Use MM.YYYY format for German CVs in experience.start/end, education.graduation, projects.date fields.

### Adding New CV Sections
1. Update `CV` type in `lib/types.ts`
2. Add to `initialCV` in `lib/store.ts`
3. Add to `SectionVisibility` type and `initialVisibility`
4. Create section component in `components/builder/sections/`
5. Add AccordionItem in `CVForm.tsx`
6. Update `CVPreview.tsx` and both `CVTemplate` files (frontend + backend) for rendering

### PDF vs Preview Consistency
The preview (`CVPreview.tsx`) mirrors the PDF layout to ensure WYSIWYG. When modifying:
- Frontend PDF: `components/pdf/CVTemplate.tsx`
- Backend PDF: `server/src/pdf/CVTemplate.js`
- Preview: `components/builder/CVPreview.tsx`

All three should stay in sync for consistent output.

### Thumbnail Generation
CV thumbnails are auto-generated when drafts are created/updated:
- Utility: `lib/thumbnail-generator.ts`
- Stored in: `server/public/thumbnails/`
- Used in dashboard CV cards

### Internationalization
Two-layer i18n system:
- **UI language**: Managed by `lib/language-context.tsx` with translations in `locales/en.json` and `locales/de.json`
- **CV content language**: Stored in `cv.language` field ("en" or "de")
- Use `useLanguage()` hook for UI translations
- Use `t()` function from `lib/i18n.ts` for static translations

### Security Features
- **Helmet.js**: Security headers (CSP, HSTS, X-Frame-Options)
- **CORS**: Restricted to `FRONTEND_URL` environment variable
- **Rate limiting**: General limiter on all API requests
- **bcryptjs**: Password hashing with 10 salt rounds
- **JWT**: Secure token-based authentication (15min access tokens, 7-day refresh tokens)
- **Input validation**: Zod schemas on all auth/draft endpoints
- **CSRF protection**: Middleware exists (currently disabled in development)

### TypeScript Paths
Use `@/` prefix for imports:
```typescript
import { useCVStore } from '@/lib/store';
import { CVForm } from '@/components/builder/CVForm';
```

Configured in `tsconfig.json`:
```json
{ "baseUrl": ".", "paths": { "@/*": ["./*"] } }
```

### Environment Variables
**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: `http://localhost:4000/api`)

**Backend** (`server/.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` / `ACCESS_TOKEN_SECRET` - JWT signing key
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - development/production
- `FRONTEND_URL` - CORS origin (default: `http://localhost:3000`)
- `DB_POOL_MAX` - Connection pool size
- `ACCESS_TOKEN_EXPIRY` - Token expiry time (default: 15m)
- `REFRESH_TOKEN_EXPIRY` - Refresh token expiry (default: 7d)

### Common Pitfalls
- **Always start backend before frontend** - Frontend API calls will fail if backend isn't running
- **Check CORS configuration** - Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- **Token expiry** - Access tokens expire after 15 minutes; implement refresh token flow if needed
- **Soft deletes** - Backend uses soft delete middleware; manually deleted records may still exist with `deletedAt` timestamp
- **Two Prisma schemas** - Frontend and backend have separate schemas; push changes to both when modifying models
