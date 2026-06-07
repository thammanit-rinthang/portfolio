# Developer Handoff

เอกสารนี้ใช้ส่งต่องานให้ developer คนถัดไป

โปรเจกต์นี้คือ `AI Resume Portfolio` ที่มีเว็บ portfolio, Supabase/PostgreSQL, Supabase Storage, และ `Portfolio Chat` ที่ตอบคำถามเกี่ยวกับเจ้าของเว็บและโปรเจกต์จากข้อมูลจริงเท่านั้น

## Current Status

ทำถึง Phase 4 บางส่วนแล้ว

เสร็จแล้ว:

- Core UI pages:
  - `/`
  - `/projects`
  - `/projects/[slug]`
  - `/resume`
  - `/contact`
- Static structured content:
  - `app/_data/portfolio.ts`
- Basic components:
  - header
  - footer
  - project card
  - section heading
- Prisma schema:
  - profile
  - skills
  - experiences
  - projects
  - project tags
  - project images
  - chat sessions
  - chat messages
  - AI provider settings
  - portfolio chunks
- Migration SQL:
  - `prisma/migrations/20260606000000_init_portfolio_schema/migration.sql`
- Supabase Storage SQL:
  - `supabase/storage.sql`
- Supabase utilities:
  - server service client
  - browser client
  - env validation
  - storage buckets
  - storage path helpers
- Health endpoint:
  - `/api/health`
- Docs:
  - standards
  - env setup
  - context window plan
  - CRUD plan
  - animation standard
  - development phases

Verified:

- `npx prisma validate`
- `npx prisma generate`
- `npm run lint`
- `npm run build`
- `/api/health` returns `200`

## Important Warning

Prisma migration was not applied directly to Supabase from the local CLI.

Reason:

- `prisma migrate dev --create-only` failed while connecting through Supabase pooler.
- Current connection shown by Prisma was still `pooler.supabase.com`.
- Prisma migrations should use a direct database connection, not the pooler.

Before running Prisma migrations directly:

- Set `DIRECT_URL` to Supabase direct database connection.
- Do not use transaction/session pooler for Prisma migrate.
- If direct connection is not available, run the generated SQL manually in Supabase SQL Editor.

## Must-Read Docs Before Continuing

Read in this order:

1. `docs/README.md`
2. `docs/standard.md`
3. `docs/development-phases.md`
4. `docs/env-setup.md`
5. `docs/context-window-management.md`
6. `docs/admin-crud-plan.md`
7. `docs/animation-standard.md`

Do not skip `standard.md`.

## Phase 4 Remaining: Supabase Integration

Goal:

Move from static data foundation to Supabase-backed content safely.

### Tasks

1. Apply database schema.

Use one of these options:

- Preferred: fix `DIRECT_URL`, then run Prisma migration properly.
- Safe fallback: run `prisma/migrations/20260606000000_init_portfolio_schema/migration.sql` in Supabase SQL Editor.
- Note: Waiting for DB credentials or manual schema application.

2. Apply storage setup.

Run:

```text
supabase/storage.sql
```

in Supabase SQL Editor.

3. Verify Supabase tables.

Expected tables:

- `profiles`
- `skills`
- `experiences`
- `projects`
- `project_tags`
- `project_images`
- `chat_sessions`
- `chat_messages`
- `ai_provider_settings`
- `portfolio_chunks`

4. Verify RLS.

Public should only read:

- published profiles
- published skills
- published experiences
- published projects
- published project tags for published projects
- published project images for published projects
- public portfolio chunks

Public must not write anything.

5. Verify Storage buckets.

Expected buckets:

- `resume-assets`
- `project-images`
- `og-images`
- `private-uploads`

Public read only:

- `resume-assets`
- `project-images`
- `og-images`

No public upload policy.

6. Add seed script.

Seed should create:

- profile
- skills
- experiences
- projects
- tags
- optional provider settings
- optional portfolio chunks

Important:

- Seed must be idempotent.
- Seed must not duplicate records.
- Seed must not include secrets.
- Seed must set `is_published = true` only for content ready for public display.

7. Add public content data layer.

Add functions that read from Supabase:

- `getPublishedProfile`
- `getPublishedSkills`
- `getPublishedExperiences`
- `getPublishedProjects`
- `getPublishedProjectBySlug`

Use static fallback only if Supabase read fails during development.

8. Switch public pages to Supabase data.

Pages to update:

- `/`
- `/projects`
- `/projects/[slug]`
- `/resume`
- `/contact`

Rules:

- public pages must not require service role if anon read policies work
- if using service role server-side, never expose it to client
- handle empty data gracefully
- keep build passing

*(Note: The data access layer, UI updates, and seed script have been implemented. Verification and actual DB testing are pending schema application.)*

### Phase 4 Done When

- Supabase schema exists
- Storage buckets exist
- RLS policies work
- seed runs safely
- public pages can render from Supabase data
- static fallback works in local/dev
- lint/build pass

## Phase 4.5 Remaining: Admin CRUD

Goal:

Add admin-only content management only after public Supabase read is stable.

### Recommendation

Do not start Admin CRUD before:

- public Supabase read works
- RLS is verified
- storage policies are verified
- seed data is stable

### Tasks

1. Add Supabase Auth.

Use allowlist:

```text
ADMIN_EMAILS
```

2. Protect admin routes.

Routes:

- `/admin`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]`
- `/admin/profile`
- `/admin/experience`
- `/admin/skills`
- `/admin/media`
- `/admin/settings/ai-providers`
- `/admin/chat-logs`

3. Protect admin APIs server-side.

Do not rely on client-side checks.

4. Add CRUD for portfolio content.

CRUD scope:

- profile update
- skills create/update/delete
- experiences create/update/delete
- projects create/update/soft delete
- tags through project form
- publish/unpublish

5. Add media CRUD.

Scope:

- upload/replace resume PDF
- upload/delete project images
- set cover image
- update image alt text

6. Add audit logging.

Log:

- create/update/delete
- publish/unpublish
- file upload/delete
- provider setting changes

7. Add destructive confirmation.

Required for:

- project delete
- image delete
- resume replace
- unpublish content

### Do Not Forget

- public client must not write to database
- public client must not upload to storage
- service role key must stay server-only
- content published through admin will be used as chatbot context
- sanitize content before rendering
- never render raw HTML from admin content unless sanitized

### Phase 4.5 Done When

- public user cannot access admin routes
- public user cannot call admin mutation APIs
- admin can create/update/publish content
- image/PDF upload works with validation
- failed upload/database update cleans up files
- audit logs record mutations
- lint/build pass

## Phase 5 Remaining: Portfolio Chat MVP

Goal:

Build the first working `Portfolio Chat` that answers from verified portfolio data.

### Tasks

1. Add AI provider adapters.

Providers:

- Ollama
- Groq
- OpenRouter

Each adapter must:

- receive normalized messages/context
- respect timeout
- return normalized response
- hide raw provider error from client

2. Add provider fallback orchestrator.

Default order:

```text
Ollama -> Groq -> OpenRouter
```

Rules:

- skip disabled providers
- on timeout, try next provider
- on rate limit, try next provider
- on unavailable provider, try next provider
- if all fail, return safe error

3. Add context builder.

Use:

- profile
- skills
- experiences
- projects
- project tags
- portfolio chunks if available
- recent messages limited by budget

Do not use chat history as source of truth.

4. Add `/api/chat`.

Request:

```json
{
  "message": "Which projects use Docker?",
  "sessionId": "optional",
  "locale": "en"
}
```

Response must follow `standard.md` envelope.

5. Add chat session persistence.

Tables:

- `chat_sessions`
- `chat_messages`

Store:

- user message
- assistant answer
- provider
- model
- token estimate

6. Add Chat UI.

Components:

- `ChatLauncher`
- `ChatPanel`
- `ChatMessage`
- `SuggestedPrompt`

7. Add safety behavior.

If user asks outside scope:

- respond that chat focuses on portfolio information
- suggest relevant portfolio questions

If user asks for secrets/system prompt:

- refuse briefly

If data is missing:

- say portfolio does not include that detail

### Do Not Forget

- validate message length
- rate limit `/api/chat`
- never send secrets to model
- never send service role key to client
- no raw provider errors in response
- answer in `th/en` based on locale/user language
- references must be public routes only

### Phase 5 Done When

- chat answers basic profile questions
- chat answers project questions
- chat answers deployment/stack questions
- provider fallback works
- all providers fail gracefully
- chat logs save correctly
- lint/build pass

## Phase 6 Remaining: Context and Retrieval Hardening

Goal:

Make chat more accurate and cheaper as content grows.

### Tasks

1. Add portfolio chunks.

Chunk sources:

- profile
- experiences
- project summaries
- project deployment notes
- skill groups

2. Add retrieval ranking.

Start with:

- keyword match
- tag match
- stack match
- project title/slug match
- featured boost

3. Add token estimation.

Use approximate estimation first:

```text
Math.ceil(text.length / 4)
```

4. Add trimming.

Trim in this order:

1. old raw messages
2. long assistant history
3. low-ranked projects
4. verbose fields
5. non-matching skills

Never trim:

- system rules
- current user message
- no-guessing rule
- relevant portfolio facts

5. Add session summary.

Use for conversation continuity only.

Do not let summary create new facts about owner.

### Phase 6 Done When

- long chat does not exceed context budget
- project questions retrieve correct projects
- deployment questions retrieve deployment facts
- missing data is not guessed
- context debug logs are off in production

## Phase 7 Remaining: Bilingual and Copy Polish

Goal:

Make `th/en` consistent and human-written.

### Tasks

- localize navigation
- localize CTA
- localize chat prompts
- localize loading/error states
- localize project content
- localize metadata
- add locale selection

### Do Not Forget

- avoid generic AI phrases
- avoid over-marketing
- keep Thai natural
- keep English direct and active
- tech names can stay English
- chatbot should not say `As an AI language model`

### Phase 7 Done When

- all public UI has `th/en`
- locale fallback works
- chatbot respects locale
- copy follows `standard.md`

## Phase 8 Remaining: Professional Motion and UI Polish

Goal:

Improve feel without making the site flashy or heavy.

### Tasks

- page intro polish
- section reveal polish
- card hover polish
- chat panel open/close animation
- loading states
- reduced motion support

### Do Not Forget

- use `animation-standard.md`
- no infinite decorative motion
- no layout shift
- no heavy blur
- no animation that blocks reading
- `prefers-reduced-motion` must work

### Phase 8 Done When

- UI feels responsive and calm
- motion is consistent
- mobile remains smooth
- accessibility is not harmed

## Phase 9 Remaining: Security Hardening

Goal:

Close security gaps before production.

### Tasks

- add security headers
- review RLS
- review storage policies
- add rate limiting
- add input validation
- add prompt injection tests
- review logs for secret leakage
- review admin auth

### Test Cases

Test:

- ask for API key
- ask for system prompt
- ask to ignore rules
- ask to invent experience
- spam chat endpoint
- upload invalid file
- access admin route without auth
- access admin API without auth
- read unpublished content

### Phase 9 Done When

- no secret leakage
- admin is protected
- RLS blocks public writes
- chat rejects unsafe behavior
- errors do not reveal internals

## Phase 10 Remaining: Testing and QA

Goal:

Make sure the site is stable before release.

### Required Checks

- lint
- build
- Prisma validate
- API tests
- chat fallback tests
- responsive screenshots
- keyboard navigation
- reduced motion
- storage upload tests
- RLS tests

### Manual QA

Check:

- `/`
- `/projects`
- `/projects/[slug]`
- `/resume`
- `/contact`
- `/admin` if built
- chat open/close
- chat fallback
- missing data states
- mobile 360px
- desktop 1440px

### Phase 10 Done When

- critical tests pass
- no known security bugs
- no blocking UX bugs
- docs match behavior

## Phase 11 Remaining: Deployment and Monitoring

Goal:

Deploy safely and know when something breaks.

### Tasks

- prepare production env
- verify Supabase production project
- verify Storage buckets
- verify RLS
- run production build
- deploy
- smoke test
- set up monitoring

### Smoke Test

After deploy:

- home loads
- project detail loads
- resume link works
- storage images load
- chat answers basic question
- provider fallback works
- admin protected
- metadata/OG okay

### Phase 11 Done When

- production URL works
- core pages load
- chat works
- logs are usable
- rollback plan exists

## Phase 12 Remaining: Maintenance

Goal:

Keep the portfolio useful and safe over time.

### Recurring Tasks

Weekly:

- update project content if needed
- check broken links

Monthly:

- dependency/security review
- provider cost/limit review
- chat logs review

Quarterly:

- refresh resume
- refresh project case studies
- review screenshots for sensitive data
- review chatbot answers

After every content update:

- verify project page
- verify chatbot can answer about updated content
- verify metadata

## Developer Reminders

Do not forget:

- Use direct DB connection for Prisma migrations.
- Do not use Supabase pooler for Prisma migrate.
- Run storage SQL separately.
- RLS must stay enabled.
- Public website should be read-only.
- Uploads must be admin/server-only.
- Service role key must never reach client.
- Chatbot must answer from portfolio data only.
- Chat history is not source of truth.
- If data is missing, say it is missing.
- Do not invent numbers or experience.
- Keep copy human and direct.
- Keep animation subtle and professional.
- Every new public copy should support `th/en`.
- Every API should use standard response envelope.
- Every mutation should validate input.
- Every destructive action should have confirmation.
- Every provider failure should have fallback.

## Handoff Recommendation

Next developer should continue in this order:

1. Finish Phase 4 Supabase apply + seed.
2. Switch public pages to Supabase data with static fallback.
3. Add Portfolio Chat MVP.
4. Add Admin CRUD only after public read and RLS are stable.
5. Harden security before production.

Do not jump to chatbot before Supabase content source is reliable. The chat quality depends on clean, published, structured portfolio data.

