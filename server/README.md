# LebenslaufPro Backend Server

Express.js backend (JavaScript/Node.js) for the LebenslaufPro CV builder application.

## Setup

### Prerequisites
- Node.js 20+ and pnpm (or npm)
- PostgreSQL database

### Installation

1. **Install dependencies**
   ```bash
   cd server
   pnpm install
   # or: npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/lebenslaufpro
   JWT_SECRET=your-secret-key-here
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Setup database**
   ```bash
   pnpm db:push
   # or for migrations
   pnpm db:migrate
   ```

4. **Start the server**
   ```bash
   # Development mode (with hot reload via nodemon)
   pnpm dev

   # Production mode
   pnpm start
   ```

The server will run on `http://localhost:4000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `GET /api/auth/session` - Get current user session (requires auth)

### Drafts
All draft endpoints require `Authorization: Bearer <token>` header.

- `GET /api/drafts` - Get all user drafts
- `POST /api/drafts` - Create new draft
- `GET /api/drafts/:id` - Get draft by ID
- `PUT /api/drafts/:id` - Update draft (full)
- `PATCH /api/drafts/:id` - Update draft evaluation scores
- `DELETE /api/drafts/:id` - Delete draft
- `POST /api/drafts/:id/snapshot` - Create snapshot

### PDF Export
- `POST /api/pdf/export` - Export CV as PDF (requires auth)

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js       # Prisma client setup
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── draftsController.js   # Drafts CRUD
│   │   └── pdfController.js      # PDF generation
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── drafts.js             # Draft routes
│   │   └── pdf.js                # PDF routes
│   └── index.js                  # Server entry point
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
└── .env.example
```

## Development Notes

### Authentication
- Uses JWT tokens instead of NextAuth sessions
- Token stored in localStorage on frontend
- Token sent in `Authorization: Bearer <token>` header

### Database
- Shares the same PostgreSQL database with the frontend
- Uses Prisma ORM
- Run migrations from the server directory

### CORS
- Configured to allow requests from `FRONTEND_URL` (default: http://localhost:3000)
- Credentials enabled for cookie support if needed

## Migration from Next.js API Routes

This backend replaces the Next.js API routes with a standalone Express server written in plain JavaScript (not TypeScript). Key differences:

1. **Language**: Plain JavaScript with Node.js (no TypeScript compilation needed)
2. **Authentication**: JWT tokens instead of NextAuth sessions
3. **Separate Process**: Backend runs on port 4000, frontend on 3000
4. **API Client**: Frontend uses `lib/api-client.ts` to communicate with backend
5. **Hot Reload**: Uses nodemon for development hot reloading
