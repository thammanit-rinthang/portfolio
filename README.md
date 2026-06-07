# AI Resume Portfolio

เว็บ portfolio สำหรับสมัครงานพร้อมระบบ `Portfolio Chat` ที่ตอบคำถามจากข้อมูล resume, project case studies, และ structured portfolio data เท่านั้น

โปรเจคนี้ใช้ Next.js App Router, Prisma, Supabase/PostgreSQL, Supabase Storage, และ AI provider fallback ผ่าน Groq/OpenRouter

## Tech Stack

- Next.js `16.2.7`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- Prisma `7`
- Supabase Auth, Database, Storage
- Vitest
- Groq และ OpenRouter สำหรับ Portfolio Chat

## Main Features

- Public portfolio pages: `/`, `/projects`, `/projects/[slug]`, `/resume`, `/contact`
- Admin area สำหรับจัดการ profile, projects, skills, experience, และ media
- Supabase-backed content พร้อม static fallback สำหรับ development
- Portfolio Chat พร้อม guardrails, rate limit, provider fallback, และ chat persistence
- Bilingual UI/content direction: `th/en`
- Security headers ใน `next.config.ts`

## Project Structure

```text
app/
  _components/        shared UI components
  _data/              static fallback portfolio data
  _lib/               server/client utilities, env, Prisma, Supabase, AI
  admin/              admin UI
  api/                route handlers
  contact/            public contact page
  projects/           project listing and detail pages
  resume/             resume page
docs/                 product, security, architecture, QA, deploy docs
prisma/               Prisma schema, migrations, seed data
supabase/             Supabase Storage SQL and notes
tests/                Vitest tests
public/               static assets
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create local env from the example:

```bash
cp .env.example .env.local
```

At minimum, set `DATABASE_URL`. For full Supabase/admin/chat flows, also set Supabase keys and at least one enabled AI provider key. See [docs/env-setup.md](./docs/env-setup.md).

Generate Prisma client:

```bash
npm run prisma:generate
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment

Important env groups:

- App: `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_SITE_URL`
- Database: `DATABASE_URL`, `DIRECT_URL`
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Storage buckets: `SUPABASE_RESUME_BUCKET`, `SUPABASE_PROJECT_IMAGES_BUCKET`, `SUPABASE_OG_IMAGES_BUCKET`, `SUPABASE_PRIVATE_UPLOADS_BUCKET`
- Admin: `ADMIN_EMAILS`
- Chat runtime: `CHAT_MAX_MESSAGE_LENGTH`, `CHAT_RATE_LIMIT_*`, `CHAT_PROVIDER_TIMEOUT_MS`
- Providers: `AI_PROVIDER_PRIORITY`, `GROQ_*`, `OPENROUTER_*`

Never commit real secrets. `.env.example` is the only env file intended for source control.

## Database and Supabase

Validate schema:

```bash
npm run prisma:validate
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Seed local or connected database:

```bash
npx prisma db seed
```

Important migration note:

- Prisma migrations should use a direct database connection.
- Do not run Prisma migrate through the Supabase transaction/session pooler.
- If direct connection is not available, apply the SQL in `prisma/migrations/*/migration.sql` through the Supabase SQL Editor.
- Apply `supabase/storage.sql` separately for Storage buckets and policies.

## Development Commands

```bash
npm run dev              # start local dev server
npm run lint             # run ESLint
npm run typecheck        # next typegen + TypeScript check
npm run test             # run Vitest in watch mode
npm run test:run         # run Vitest once
npm run build            # production build
npm run ci               # generate, validate, lint, typecheck, test, build
```

## API Notes

Key route handlers:

- `GET /api/health`
- `GET /api/chat-health`
- `POST /api/chat`
- Admin/media routes under `/api/admin/*`

API responses should follow the standard envelope documented in [docs/standard.md](./docs/standard.md):

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

## Chat Safety

`Portfolio Chat` must answer only from public portfolio data. It must not invent experience, expose secrets, reveal system prompts, or use chat history as a factual source about the portfolio owner.

Provider fallback is configured through `AI_PROVIDER_PRIORITY`, currently oriented around:

```text
groq,openrouter
```

## Documentation

Start here:

1. [docs/README.md](./docs/README.md)
2. [docs/standard.md](./docs/standard.md)
3. [docs/development-phases.md](./docs/development-phases.md)
4. [docs/developer-handoff.md](./docs/developer-handoff.md)
5. [docs/env-setup.md](./docs/env-setup.md)
6. [docs/context-window-management.md](./docs/context-window-management.md)
7. [docs/admin-crud-plan.md](./docs/admin-crud-plan.md)
8. [docs/deploy-checklist.md](./docs/deploy-checklist.md)

## Pre-Deploy Checklist

Run:

```bash
npm run ci
```

Then verify:

- No secrets in git diff
- Supabase RLS blocks public writes
- Admin routes and admin APIs are protected
- Storage buckets allow public read only for intended public assets
- Chat refuses out-of-scope and secret-revealing prompts
- Provider fallback works
- Public pages render on mobile and desktop
- Copy is consistent for `th/en`

## Agent Notes

This project uses Next.js `16`, which has version-specific docs in `node_modules/next/dist/docs/`. Before making any Next.js code changes, read the relevant bundled docs and follow [AGENTS.md](./AGENTS.md).
