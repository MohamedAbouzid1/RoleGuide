# Backend Server & Features Setup

## ✅ Completed Setup

### 1. PDF Export Functionality

**Status**: ✅ WORKING

The PDF export functionality has been fixed and is now operational.

#### What Was Fixed:
- Created a CommonJS-compatible version of CVTemplate at `server/src/pdf/CVTemplate.js`
- Updated PDF controller to use the correct module path
- Added proper error handling and validation

#### How It Works:
1. Frontend sends CV data to `/api/pdf/export`
2. Backend uses `@react-pdf/renderer` to generate PDF from CV data
3. Returns PDF file with sanitized filename

#### API Endpoint:
```
POST http://localhost:4000/api/pdf/export
Content-Type: application/json

{
  "personal": {
    "fullName": "John Doe",
    "email": "john@example.com",
    ...
  },
  "experience": [...],
  "education": [...],
  ...
}
```

### 2. Draft Saving Functionality

**Status**: ✅ WORKING

All draft-related endpoints are properly configured and connected to the database.

#### Available Endpoints:

**Get All Drafts** (for authenticated user)
```
GET http://localhost:4000/api/drafts
Authorization: Bearer <token>
```

**Create New Draft**
```
POST http://localhost:4000/api/drafts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My CV",
  "data": { ...CV data... }
}
```

**Get Single Draft**
```
GET http://localhost:4000/api/drafts/:id
Authorization: Bearer <token>
```

**Update Draft (Full Update)**
```
PUT http://localhost:4000/api/drafts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "data": { ...complete CV data... }
}
```

**Update Draft (Partial - Evaluation Scores)**
```
PATCH http://localhost:4000/api/drafts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "overallScore": 85,
  "atsScore": 90,
  "lastEvaluation": { ...evaluation results... }
}
```

**Delete Draft**
```
DELETE http://localhost:4000/api/drafts/:id
Authorization: Bearer <token>
```

**Create Snapshot**
```
POST http://localhost:4000/api/drafts/:id/snapshot
Authorization: Bearer <token>
Content-Type: application/json

{
  "data": { ...CV data to snapshot... }
}
```

### 3. Database Setup

**Status**: ✅ CONNECTED

- PostgreSQL database is properly configured
- Prisma schema is synced with database
- All tables are created (User, Draft, Snapshot, Account, Session, VerificationToken)

#### Database Schema:
- **User**: Stores user accounts with email/password authentication
- **Draft**: Stores CV data as JSON with evaluation scores
- **Snapshot**: Point-in-time backups of draft data
- **Account/Session**: NextAuth authentication tables (optional)

### 4. Authentication

**Status**: ✅ CONFIGURED

JWT-based authentication is implemented.

#### Authentication Endpoints:

**Register**
```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Login**
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "jwt-token-here",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

Use the returned token in the `Authorization: Bearer <token>` header for all protected endpoints.

## Running the Application

### Start Frontend (Next.js)
```bash
# From project root
pnpm dev
# Runs on http://localhost:3001 (or 3000 if available)
```

### Start Backend (Express)
```bash
# From project root
node server/src/index.js

# OR with auto-reload:
cd server
npm run dev
# Runs on http://localhost:4000
```

### Both Services Together
Open two terminal windows:

**Terminal 1 (Frontend)**:
```bash
pnpm dev
```

**Terminal 2 (Backend)**:
```bash
node server/src/index.js
```

## Environment Variables

### Frontend (.env)
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Backend (server/.env)
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=your-strong-random-secret-here
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Testing the Features

### Test PDF Export

1. Make sure backend is running on port 4000
2. Use the CV builder to create a CV
3. Click "Export PDF" button
4. PDF should download with the filename based on your name

### Test Draft Saving

1. Register/login to get auth token
2. Create a new draft via the dashboard or CV builder
3. Make changes to your CV
4. Changes auto-save every 10 seconds (when `isDirty` is true)
5. Manual save via "Save" button creates a snapshot

### Test API Directly

Using curl or Postman:

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Create Draft (use token from login response)
curl -X POST http://localhost:4000/api/drafts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"My CV","data":{}}'

# Export PDF
curl -X POST http://localhost:4000/api/pdf/export \
  -H "Content-Type: application/json" \
  -d '{"personal":{"fullName":"John Doe","email":"john@example.com"},"experience":[],"education":[],"skills":[],"languages":[]}' \
  --output test.pdf
```

## Troubleshooting

### Backend won't start
```bash
# Regenerate Prisma client
npx prisma generate

# Check if port 4000 is already in use
lsof -i :4000

# Kill process using port 4000 if needed
kill -9 $(lsof -t -i:4000)
```

### Database connection issues
```bash
# Verify DATABASE_URL in .env
# Push schema to database
pnpm db:push

# Check database connection
npx prisma studio
```

### PDF Export fails
- Make sure `@react-pdf/renderer` is installed in the server
- Check server logs for detailed error messages
- Verify CV data structure matches expected format

### Authentication issues
- Verify JWT_SECRET is set in server/.env
- Check token expiration (default: 24 hours)
- Ensure Authorization header format: `Bearer <token>`

## File Structure

```
LebenslaufPro_2/
├── app/                    # Next.js frontend
│   ├── api/               # API route re-exports
│   ├── auth/              # Auth pages (login, register)
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Landing page
├── api/                   # API implementations
├── components/            # React components
│   ├── builder/          # CV builder components
│   ├── pdf/              # PDF template (frontend)
│   └── ui/               # UI components
├── lib/                   # Utilities & types
├── prisma/               # Prisma schema & migrations
└── server/               # Express backend
    ├── src/
    │   ├── config/       # Database configuration
    │   ├── controllers/  # Request handlers
    │   ├── middleware/   # Auth middleware
    │   ├── pdf/          # PDF template (backend)
    │   ├── routes/       # API routes
    │   └── index.js      # Server entry point
    └── package.json      # Server dependencies
```

## Next Steps

1. **Test all features** in the browser
2. **Implement autosave** on the frontend (already configured in Zustand store)
3. **Add error handling** for network failures
4. **Implement loading states** during save/export operations
5. **Add success/error toasts** for user feedback
6. **Consider adding cover letter functionality** (marked as "Coming Soon")

## Security Notes

- JWT tokens expire after 24 hours
- Passwords are hashed with bcrypt
- All draft operations require authentication
- CORS is configured to allow requests from frontend URL
- Always use HTTPS in production
- Set strong JWT_SECRET in production
- Use environment variables for sensitive data

## Support

If you encounter issues:
1. Check server logs (Terminal 2)
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure database is accessible
5. Check that both frontend and backend are running
