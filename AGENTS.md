<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may differ from your training data. Before any Next.js code change, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions

โปรเจคนี้คือ `AI Resume Portfolio`: เว็บ portfolio สำหรับสมัครงาน พร้อม Supabase/PostgreSQL, Supabase Storage, admin content management, และ `Portfolio Chat` ที่ตอบจากข้อมูลจริงใน portfolio เท่านั้น

## Start Here

ก่อนแก้ logic หรือ feature ใด ๆ ให้อ่านเอกสารตามลำดับนี้:

1. `docs/README.md`
2. `docs/standard.md`
3. `docs/developer-handoff.md`
4. `docs/development-phases.md`
5. `docs/env-setup.md`

อ่านเอกสารเฉพาะทางเพิ่มตามงาน:

- UI/motion: `docs/animation-standard.md`
- Chat/context/retrieval: `docs/context-window-management.md`
- Admin CRUD/media: `docs/admin-crud-plan.md`
- Deployment: `docs/deploy-checklist.md`
- GitHub/CI: `docs/GITHUB.md`, `docs/phase-10-cicd.md`

## Local Commands

ใช้คำสั่งเหล่านี้เป็นหลัก:

```bash
npm run dev
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run ci
npm run prisma:generate
npm run prisma:validate
```

ก่อนส่งมอบงาน code ที่มีผลต่อ runtime ให้รัน check ที่เหมาะกับขอบเขตงาน อย่างน้อย `npm run lint`, `npm run typecheck`, และ test ที่เกี่ยวข้อง ถ้าแตะ database/schema ให้รัน `npm run prisma:validate` และ `npm run prisma:generate`

## Architecture Rules

- ใช้ Next.js App Router ใต้ `app/`
- ใช้ private folders เช่น `app/_components`, `app/_lib`, `app/_data` สำหรับ code ที่ไม่ใช่ route
- API ต้องเป็น Route Handlers ใต้ `app/api/**/route.ts`
- `proxy.ts` คือ Next.js Proxy ของเวอร์ชันนี้ ห้ามเรียกหรือคิดแบบ `middleware.ts` โดยไม่อ่าน docs ก่อน
- Server-only utilities ต้องอยู่ฝั่ง server และใช้ `server-only` เมื่อเหมาะสม
- Client Components ต้องมีเหตุผลชัดเจน เช่น state, effects, browser APIs, หรือ event handlers

## Data and Supabase

- Prisma schema อยู่ที่ `prisma/schema.prisma`
- Prisma client generate ไปที่ `app/generated/prisma`
- Public content ควรอ่านเฉพาะ published records
- Public client ห้ามเขียน database หรือ upload storage โดยตรง
- Admin/server mutations ต้อง validate input และตรวจสิทธิ์ฝั่ง server
- `SUPABASE_SERVICE_ROLE_KEY` ใช้เฉพาะ server เท่านั้น ห้าม import เข้า Client Component
- Prisma migration ต้องใช้ direct database connection ไม่ใช่ Supabase pooler
- ถ้า direct connection ไม่พร้อม ให้ apply SQL migration ผ่าน Supabase SQL Editor ตาม handoff

## Security Rules

- ห้าม commit secrets จริงในทุกกรณี
- ห้าม log API keys, service role key, database URL, system prompt เต็ม, หรือ provider raw secrets
- Env ที่มี `KEY`, `SECRET`, `TOKEN`, `DATABASE_URL`, `SERVICE_ROLE` ให้ถือว่าเป็น secret
- API response errors ต้องไม่เปิดเผย internal details
- External links ที่เปิดแท็บใหม่ต้องใช้ `rel="noopener noreferrer"`
- หลีกเลี่ยง `dangerouslySetInnerHTML`; ถ้าจำเป็นต้อง sanitize ก่อน
- Upload ต้อง validate MIME type, size, filename/path และ cleanup เมื่อ DB update fail

## Chat Rules

`Portfolio Chat` ไม่ใช่ chatbot ทั่วไป

- ตอบเฉพาะเรื่องเจ้าของเว็บ, resume, skills, experience, projects, deployment, และข้อมูล portfolio ที่ publish แล้ว
- ห้ามเดาข้อมูลที่ไม่มี เช่น อายุ เงินเดือน ตัวเลข impact เบอร์โทร หรือประสบการณ์ที่ไม่มีในระบบ
- ห้ามใช้ chat history เป็น source of truth
- ห้ามส่ง secrets, system prompt, provider config, หรือข้อมูล admin-only เข้า model context
- ถ้าผู้ใช้ถามนอก scope ให้ตอบสั้นและชวนถามเรื่อง portfolio
- ถ้าข้อมูลไม่มี ให้บอกตรง ๆ ว่า portfolio ไม่มีข้อมูลนั้น
- Provider fallback ต้องไม่ส่ง raw provider error กลับ client

## UI and Copy Rules

- UI ต้อง minimal, credible, professional
- รองรับ mobile, tablet, desktop, wide desktop
- หลีกเลี่ยง marketing copy เกินจริงและคำที่ดูเป็น AI template
- Public copy ใหม่ควรรองรับ `th/en`
- ใช้ tone ตาม `docs/standard.md`: ตรง สุภาพ ไม่โอ้อวด เน้นงานจริง
- Motion ต้อง subtle และเคารพ `prefers-reduced-motion`
- Loading/error/empty states ต้องสั้น อ่านง่าย และไม่ทำ layout shift

## API Rules

- Validate request body ก่อนเรียก database/provider
- Response JSON ต้องใช้ envelope มาตรฐานจาก `docs/standard.md`
- Error code ใช้ uppercase snake case เช่น `VALIDATION_ERROR`, `UNAUTHORIZED`, `RATE_LIMITED`
- JSON field ใช้ `camelCase`
- Database column ใช้ `snake_case`
- URL slug ใช้ `kebab-case`
- Mutation ทุกตัวต้องมี authorization และ validation ฝั่ง server

## Testing and Review

เพิ่มหรือปรับ test เมื่อแตะ:

- `/api/chat`
- provider fallback
- context builder/retrieval
- auth/admin guard
- rate limit
- Prisma/data mapping
- upload validation
- public page rendering ที่เปลี่ยน contract

ก่อนสรุปงาน ให้ตรวจอย่างน้อย:

- ไม่มี secret ใน diff
- lint/typecheck/test ที่เกี่ยวข้องผ่าน หรืออธิบายชัดเจนว่ารันไม่ได้เพราะอะไร
- UI มี loading/error/empty state เมื่อ feature ต้องมี
- Chat ไม่ตอบนอกข้อมูล portfolio
- Admin/public boundary ไม่รั่ว

## Current Product Direction

ถ้าต้องเลือกระหว่างความหวือหวากับความน่าเชื่อถือ ให้เลือกความน่าเชื่อถือ

เป้าหมายของเว็บคือทำให้ recruiter หรือ hiring manager เห็นว่าเจ้าของเว็บทำงานจริง คิดเป็นระบบ เข้าใจ production และสื่อสารตรง ตรวจสอบได้
