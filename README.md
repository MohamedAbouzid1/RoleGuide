# LebenslaufPro

LebenslaufPro is a Next.js 14 app for building, evaluating and exporting a German‑market CV. It includes a live builder with instant preview, AI‑assisted evaluation (mocked for now), PDF export, authentication and Prisma persistence.

## Features

- **Builder** with two‑pane layout (form + print‑accurate preview)
- **Sections**: Personal, Beruf (experience), Studium & Ausbildung, Fähigkeiten (categorized with levels), Sprachkenntnisse
- **Photo upload** and toggle, website/LinkedIn/GitHub links
- **Signature upload** and closing block (place/date)
- **Autosave** and snapshots
- **PDF export** via `@react-pdf/renderer`
- **Auth** with NextAuth (Credentials + Google optional)
- **Prisma** models for users, drafts, snapshots
- **TailwindCSS** styling

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Prisma + PostgreSQL
- NextAuth (JWT sessions)
- TailwindCSS
- Zustand (local builder state)
- Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
pnpm install
```

Create `.env`:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB

# Optional Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

NEXTAUTH_SECRET=your-strong-random-secret
NEXTAUTH_URL=http://localhost:3000
```

Prisma setup:

```bash
pnpm prisma generate
pnpm prisma db push
```

Run the app:

```bash
pnpm dev
# http://localhost:3000
```

## Scripts

- `pnpm dev` – dev server
- `pnpm build` – production build
- `pnpm start` – start production server
- `pnpm test` – run tests
- `pnpm db:push` – push Prisma schema
- `pnpm db:migrate` – dev migration
- `pnpm db:seed` – run `prisma/seed.ts` (if present)

## Auth

Credentials login is enabled. Registration endpoint:

`POST /api/auth/register` with `{ email, password, name? }`

Client pages:

- `/auth/register`
- `/auth/login`

Protected API routes use `getServerSession`. For quick local testing you may temporarily relax auth checks in `api/*/route.ts`.

## PDF Export

The preview mirrors the PDF layout. Use the builder toolbar (“Als PDF exportieren”). Endpoint: `POST /api/export/pdf`.

## Structure

- `app/` – pages and re-exported API routes under `app/api/...`
- `api/` – route handlers (source)
- `components/` – UI, builder and PDF components
- `lib/` – auth, db, AI mock, scoring, types, store
- `prisma/` – Prisma schema

## Troubleshooting

- 404 on API: ensure `app/api/...` re-exports exist (already added).
- 401 on API: sign in via `/auth/register` → `/auth/login`.
- No styles: check Tailwind/PostCSS configs; restart dev server and hard refresh.
- Images in PDF (photo/signature): data URLs are supported.

## License

MIT
