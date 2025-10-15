# RoleGuide

RoleGuide is a full-stack application for building, evaluating and exporting a German‑market CV. It features a Next.js frontend with a live builder interface and a separate Express.js backend API. The app includes instant preview, AI‑assisted evaluation (mocked for now), PDF export, JWT authentication and Prisma persistence.

## Features

- **Builder** with two‑pane layout (form + print‑accurate preview)
- **Sections**: Personal, Beruf (experience), Studium & Ausbildung, Fähigkeiten (categorized with levels), Sprachkenntnisse
- **Photo upload** and toggle, website/LinkedIn/GitHub links
- **Signature upload** and closing block (place/date)
- **Autosave** and snapshots
- **PDF export** via `@react-pdf/renderer`
- **JWT Authentication** with secure token-based auth
- **Prisma** models for users, drafts, snapshots
- **TailwindCSS** styling

## Tech Stack

### Frontend

- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Zustand (local builder state)
- Vitest + Testing Library

### Backend

- Node.js + Express.js (JavaScript)
- JWT authentication
- Prisma + PostgreSQL
- CORS-enabled API

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone and install frontend dependencies:**

```bash
pnpm install
```

2. **Install backend dependencies:**

```bash
cd server
pnpm install
cd ..
```

3. **Configure environment variables:**

Create `.env` in the root directory:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=your-strong-random-secret
NEXTAUTH_URL=http://localhost:3000
```

Create `server/.env`:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=your-strong-random-secret
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Setup database:**

```bash
# From root directory
pnpm prisma generate
pnpm prisma db push
```

5. **Start both servers:**

Terminal 1 (Backend):

```bash
cd server
pnpm dev
# Backend runs on http://localhost:4000
```

Terminal 2 (Frontend):

```bash
pnpm dev
# Frontend runs on http://localhost:3000
```

## Scripts

### Frontend (Root Directory)

- `pnpm dev` – start Next.js dev server (port 3000)
- `pnpm build` – production build
- `pnpm start` – start production server
- `pnpm test` – run tests
- `pnpm db:push` – push Prisma schema
- `pnpm db:migrate` – dev migration
- `pnpm db:seed` – run `prisma/seed.ts`

### Backend (Server Directory)

- `cd server && pnpm dev` – start Express dev server with nodemon (port 4000)
- `cd server && pnpm start` – start production server
- `cd server && pnpm db:push` – push Prisma schema
- `cd server && pnpm db:migrate` – dev migration
- `cd server && pnpm db:seed` – run seed script

## Authentication

The application uses JWT token-based authentication with the Express backend.

### API Endpoints (Backend - Port 4000)

- `POST /api/auth/register` - Register new user with `{ email, password, name? }`
- `POST /api/auth/login` - Login user, returns JWT token
- `GET /api/auth/session` - Get current user session (requires auth header)

### Frontend Pages

- `/auth/register` - User registration
- `/auth/login` - User login

### Authentication Flow

1. User registers/logs in via frontend forms
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. All API requests include `Authorization: Bearer <token>` header
5. Backend middleware validates JWT tokens for protected routes

### Protected Routes

All draft and PDF endpoints require authentication. The frontend automatically includes the JWT token in API requests via `lib/api-client.ts`.

## PDF Export

The preview mirrors the PDF layout. Use the builder toolbar ("Als PDF exportieren"). Endpoint: `POST /api/pdf/export` (backend).

## Project Structure

### Frontend (Root Directory)

- `app/` – Next.js pages and routing
- `components/` – UI, builder and PDF components
- `lib/` – utilities, API client, auth context, types, store
- `locales/` – internationalization files
- `prisma/` – Prisma schema (shared with backend)

### Backend (Server Directory)

- `src/` – Express.js server code
  - `config/` – database configuration
  - `controllers/` – route handlers (auth, drafts, PDF)
  - `middleware/` – authentication middleware
  - `routes/` – API route definitions
  - `index.js` – server entry point
- `prisma/` – Prisma schema and migrations

## Troubleshooting

### Common Issues

- **Backend not starting**: Ensure you're in the `server/` directory and have run `pnpm install`
- **CORS errors**: Check that `FRONTEND_URL` in `server/.env` matches your frontend URL
- **Database connection**: Verify `DATABASE_URL` is correct in both `.env` files
- **401 Unauthorized**: Ensure JWT token is being sent in API requests; check `lib/api-client.ts`
- **404 on API calls**: Verify backend is running on port 4000 and frontend is configured to use the correct API base URL
- **No styles**: Check Tailwind/PostCSS configs; restart dev server and hard refresh
- **Images in PDF**: Data URLs are supported for photo/signature uploads

### Development Tips

- Start backend first, then frontend
- Check browser network tab for API call failures
- Backend logs will show detailed error information
- Use `GET /health` endpoint to verify backend is running

## License

MIT
