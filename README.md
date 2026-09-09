# Task Management Dashboard

Next.js application for the frontend learning path. It uses Auth.js credentials authentication and Prisma with PostgreSQL for persistent task data.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a PostgreSQL connection string.
3. Generate the Prisma client:

```bash
npm run db:generate
```

4. Create the database tables:

```bash
npm run db:push
```

5. Start the app:

```bash
npm run dev
```

Create an account at `/register`, then sign in at `/login`.

## Vercel deployment

1. Import this repository into Vercel and set the project root to `next-js-practice`.
2. Create a PostgreSQL database through Vercel Marketplace, Neon, or another hosted PostgreSQL provider.
3. Add these Vercel environment variables for Preview and Production:

```text
DATABASE_URL
AUTH_SECRET
AUTH_URL
```

Set `AUTH_URL` to the deployed app URL. Run the database schema step against the hosted database before first use:

```bash
npm run db:push
```

The task API is protected by the authenticated user session. All signed-in users can view every task and project. `ADMIN` users can create, update, and delete tasks and projects. `VIEWER` users can only read.

## Roles

New accounts receive the `VIEWER` role. Viewers can only view tasks and projects; they cannot create, edit, or delete anything. `ADMIN` users can manage tasks and projects.

Promote an account to administrator directly in PostgreSQL:

```sql
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@example.com';
```

## Checks

```bash
npm test
npm run build
```
