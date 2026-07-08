# Notice Board CRUD Application

A complete, production-ready Notice Board application built with Next.js (Pages Router), Prisma ORM, and Tailwind CSS.

## Project Overview

This is a professional dashboard for managing notices (Exam, Event, General). It supports full CRUD operations (Create, Read, Update, Delete) with a modern, responsive UI. It is designed following clean architecture principles.

## Tech Stack

- **Framework:** Next.js (Pages Router)
- **Database ORM:** Prisma Client
- **Styling:** Tailwind CSS (with Lucide React for icons)
- **Language:** TypeScript

## Features

- **Full CRUD:** Create, view, update, and delete notices.
- **Priority Sorting:** Urgent notices always appear at the top, followed by normal notices sorted by publish date (newest first). This is enforced via Prisma database queries, not frontend sorting.
- **Server-Side Validation:** All API endpoints validate incoming requests securely.
- **Responsive UI:** A modern, mobile-first design using standard Tailwind CSS classes.
- **Graceful Fallbacks:** The frontend UI can mock responses if the database backend is unreachable or not yet connected.

## Folder Structure

```text
notice-board/
├── components/          # Reusable UI components (NoticeCard, NoticeForm, etc.)
├── lib/                 # Shared utilities (prisma.ts)
├── pages/               # Next.js Pages Router
│   ├── api/             # API Routes (backend)
│   │   └── notices/     # REST API for notices
│   ├── notice/          # Dynamic frontend pages (new, [id])
│   └── index.tsx        # Dashboard home page
├── prisma/              # Database schema and migrations
├── styles/              # Global CSS (globals.css)
└── package.json         # Dependencies and scripts
```

## API Routes

- `GET /api/notices` - Fetch all notices, sorted by Priority (Urgent first), then Date.
- `POST /api/notices` - Create a new notice (requires title, body, category, priority, publishDate).
- `GET /api/notices/:id` - Fetch a specific notice by ID.
- `PUT /api/notices/:id` - Update a specific notice.
- `DELETE /api/notices/:id` - Delete a specific notice.

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd notice-board
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Database Setup (TiDB Cloud / Neon / Supabase)

1. Create a free hosted PostgreSQL or MySQL database (TiDB Cloud, Neon, or Supabase).
2. Copy the connection string provided by the hosting provider.

## Environment Variables

Create a `.env` file in the root directory and add your database URL:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

## Prisma Commands

After configuring the `.env` file, sync your database schema:

```bash
# Push schema to the database (for prototyping)
npx prisma db push

# OR generate migrations
npx prisma migrate dev --name init
```

Generate the Prisma Client:
```bash
npx prisma generate
```

## Run Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Build Project

To build the project for production:

```bash
npm run build
```

## Deployment

This project is Vercel-ready.

1. Push your code to GitHub.
2. Import the project into Vercel.
3. In the Vercel dashboard, add the `DATABASE_URL` environment variable.
4. Vercel will automatically detect Next.js and build the project.
5. Deploy!

## Future Improvements

- Add user authentication (e.g., NextAuth.js) to restrict who can manage notices.
- Add pagination or infinite scroll for the notices list.
- Implement soft-delete functionality.
- Allow file attachments alongside images.

## AI Collaboration

**Where AI was used:**
- Initial project scaffolding and directory structure setup.
- Generating the Prisma schema and API boilerplate.
- Designing the responsive UI using Tailwind CSS.
- Creating the reusable form and component architecture.

**How AI helped:**
- Accelerated development by providing best-practice implementations for standard Next.js CRUD applications.
- Ensured consistency across the UI and robust server-side validation.
- Provided a clean separation between frontend presentation and backend logic.
