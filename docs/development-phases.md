# Development Phases

เอกสารนี้คือแผนพัฒนาแบบ phase-by-phase สำหรับ `AI Resume Portfolio`

เป้าหมายคือให้การ develop ไม่คลาดเคลื่อน ลด bug ลดช่องโหว่ และทำให้ทุก feature มี standard, acceptance criteria, test checklist และ release gate ชัดเจน

## 0. Working Rules

ก่อนเริ่มทุก phase:

- อ่าน [System Standards](./standard.md)
- อ่าน [Animation Standard](./animation-standard.md) ถ้าแตะ UI/motion
- อ่าน [Context Window Management Plan](./context-window-management.md) ถ้าแตะ chat หรือ AI
- ทำงานเป็น small commits หรือ small PRs
- ห้าม refactor ใหญ่ระหว่างทำ feature ถ้าไม่จำเป็น
- ห้ามเก็บ secret ใน code, docs ที่ public, หรือ git history

Definition of Ready สำหรับ task:

- รู้เป้าหมายของ feature
- รู้ไฟล์หรือ module ที่จะกระทบ
- มี acceptance criteria
- มี test/checklist
- รู้ fallback behavior

Definition of Done สำหรับ task:

- build/lint ผ่าน
- UI responsive
- error/loading/empty state ครบ
- ไม่มี secret leak
- API contract ไม่เปลี่ยนแบบไม่ประกาศ
- copy มี `th/en` ถ้าเป็น public UI
- docs update ถ้า behavior เปลี่ยน

## Phase 1: Project Foundation

### Goal

วางฐานโปรเจกต์ให้พัฒนาได้มั่นคงก่อนเริ่ม feature ใหญ่

### Scope

- ตรวจ Next.js version และอ่าน docs ที่เกี่ยวข้องใน `node_modules/next/dist/docs`
- จัดโครงสร้าง route และ folders
- ตั้งค่า lint/build scripts
- วาง env example
- วาง content structure เบื้องต้น
- ตั้งมาตรฐาน alias/import ถ้าต้องใช้

### Deliverables

- `app/(marketing)` routes หรือโครง route ที่เลือกใช้
- `app/_components`
- `app/_lib`
- `app/_data` หรือ `content`
- `.env.example`
- docs index พร้อมใช้งาน

### Security Checklist

- `.env` ไม่ถูก track
- `.env.example` ไม่มี key จริง
- ไม่มี service role key ฝั่ง client
- dependency ใหม่ต้องจำเป็นจริง

### Quality Checklist

- `npm run lint`
- `npm run build`
- route หลัก render ได้
- TypeScript ไม่มี error

### Risks

- วาง folder structure ซับซ้อนเกินไป
- เอา feature AI เข้ามาเร็วเกินก่อน content พร้อม

### Gate

ผ่าน phase นี้เมื่อ project run/build ได้ และมี skeleton route พร้อมสำหรับ content

## Phase 2: Content Model and Portfolio Data

### Goal

ทำให้ข้อมูล portfolio เป็น structured source of truth ที่ UI และ chat ใช้ร่วมกันได้

### Scope

- สร้าง schema ข้อมูล profile, skills, experiences, projects
- map ข้อมูลจาก `RESUME.md` และ `GITHUB.md`
- เลือก featured projects
- กำหนด tags และ stack ต่อ project
- รองรับ `th/en` ใน public copy

### Deliverables

- structured content files หรือ Supabase seed plan
- project slug standards
- content fallback rules
- project case study template

### Data Standard

Project ทุกตัวต้องมี:

- `slug`
- `title`
- `summary`
- `problem`
- `solution`
- `role`
- `stack`
- `deployment`
- `impact`
- `tags`
- `links`

ถ้ายังไม่มีข้อมูล:

- ใช้ `null` หรือ empty array ตาม schema
- UI ต้องมี fallback copy
- chatbot ต้องไม่แต่งข้อมูลแทน

### Security Checklist

- ห้ามใส่ข้อมูล internal confidential
- screenshots ต้องไม่มีข้อมูลบริษัท/user จริงที่ sensitive
- URLs private ต้องไม่เปิด public ถ้าไม่พร้อม

### Quality Checklist

- slug ไม่ซ้ำ
- featured projects มีอย่างน้อย 3 ตัว
- content อ่านได้ทั้ง desktop/mobile
- chatbot context ใช้ข้อมูลชุดเดียวกับ UI

### Gate

ผ่าน phase นี้เมื่อสามารถ render project list จาก structured data ได้ และไม่มี content ที่เสี่ยงเปิดเผยข้อมูลภายใน

## Phase 3: Core UI and Pages

### Goal

สร้างเว็บ portfolio หลักที่ใช้งานได้ แม้ยังไม่มี chatbot

### Scope

- Home
- Projects list
- Project detail
- Resume
- Contact
- Header/Footer
- Responsive layout
- SEO metadata พื้นฐาน

### Deliverables

- public pages ครบ
- project cards
- case study layout
- resume download link หรือ placeholder ที่ชัด
- contact CTA

### UI Standard

- ใช้ visual direction จาก `standard.md`
- motion ใช้ `animation-standard.md`
- text ต้องไม่ overflow บน mobile
- หลีกเลี่ยง card ซ้อน card
- CTA ต้องสั้นและชัด

### Animation Scope

อนุญาต:

- page intro เบาๆ
- card hover subtle
- section reveal เฉพาะที่ช่วย scan

ไม่ทำใน phase นี้:

- route transition หนัก
- parallax
- 3D scene
- animation ต่อเนื่องไม่มีเหตุผล

### Security Checklist

- external link มี `rel="noopener noreferrer"`
- ไม่มี `dangerouslySetInnerHTML` ถ้าไม่จำเป็น
- metadata ไม่มี secret หรือ internal data

### Quality Checklist

- mobile 360px อ่านได้
- desktop 1440px ไม่โล่งเกิน
- keyboard navigation ใช้ได้
- focus state ชัด
- Lighthouse accessibility ไม่มี issue หลัก

### Gate

ผ่าน phase นี้เมื่อเว็บใช้งานเป็น portfolio ได้โดยไม่ต้องพึ่ง chatbot

## Phase 4: Supabase and Database Layer

### Goal

เพิ่ม database layer โดยไม่ทำให้ security surface กว้างเกินจำเป็น

### Scope

- Supabase schema
- Supabase Storage buckets
- RLS policies
- server-only database utilities
- seed data
- read-only public content queries
- chat session/message tables
- resume PDF and project image upload flow

### Deliverables

- migration/schema
- storage bucket configuration
- `supabase/storage.sql`
- seed script หรือ seed docs
- database access layer
- RLS policy notes
- upload validation utilities
- file cleanup behavior for failed database updates

### Security Checklist

- RLS enabled ทุกตาราง public/client-readable
- anon key อ่านเฉพาะ published content
- service role ใช้ server-only
- chat logs เขียนผ่าน API เท่านั้น
- ไม่ expose raw database errors
- public buckets read-only from client
- upload ผ่าน server/admin flow เท่านั้น
- validate MIME type, extension, and file size
- screenshots ไม่มี sensitive data ก่อน publish
- PDF upload รับเฉพาะ resume file ที่ตั้งใจเผยแพร่

### API Checklist

- query functions validate params
- slug lookup return 404 เมื่อไม่พบ
- pagination มี limit
- response shape สอดคล้อง `standard.md`
- upload API ต้องตอบ error แบบไม่ leak storage internals

### Quality Checklist

- local/dev env แยก production
- seed ซ้ำแล้วไม่สร้าง duplicate
- missing content ไม่ทำให้ page crash
- image missing แล้วมี fallback
- resume PDF missing แล้ว UI ไม่ crash
- replace image/PDF แล้วไม่มี orphan file โดยไม่ตั้งใจ

### Gate

ผ่าน phase นี้เมื่อ pages อ่านข้อมูลจาก Supabase หรือ content layer ได้, RLS/server-only boundary ชัดเจน, และ storage upload สำหรับ resume/images มี validation กับ cleanup behavior พร้อม

## Phase 4.5: Admin CRUD

### Goal

เพิ่มระบบจัดการข้อมูลหลังบ้านเฉพาะเท่าที่จำเป็น โดยไม่เปิด security surface กว้างเกินไป

### Scope

- admin authentication
- admin route guard
- admin API guard
- CRUD สำหรับ projects/profile/skills/experiences
- CRUD สำหรับ project images และ resume PDF
- publish/unpublish
- audit logs

### Deliverables

- `/admin` routes
- admin forms
- admin mutation APIs
- upload/replace/delete media flow
- audit log utilities
- authorization checks

### Security Checklist

- admin routes require auth
- admin APIs verify session and role server-side
- anon user cannot call mutation APIs
- public client cannot upload to storage
- service role remains server-only
- destructive actions require confirmation
- published content reviewed before chatbot can use it

### Quality Checklist

- create/update/delete project works
- publish/unpublish works
- image upload/delete works
- resume replace works
- failed upload/database update cleans up correctly
- public pages still render after deleted image or missing resume

### Gate

ผ่าน phase นี้เมื่อ admin CRUD ทำงานได้เฉพาะผู้มีสิทธิ์, public user เข้าถึงไม่ได้, และ mutation ทุกตัวมี validation/audit/fallback ครบ

## Phase 5: Portfolio Chat MVP

### Goal

สร้าง chatbot version แรกที่ตอบจาก portfolio data อย่างคุมได้

### Scope

- Chat UI
- `/api/chat`
- context builder
- keyword retrieval
- provider adapters
- fallback `Ollama -> Groq -> OpenRouter`
- chat logs
- basic rate limit

### Deliverables

- `ChatLauncher`
- `ChatPanel`
- `ChatMessage`
- `SuggestedPrompt`
- chat route handler
- provider abstraction
- context builder
- error handling

### Chat Rules

- ตอบเรื่อง owner/projects เท่านั้น
- ไม่ตอบเกิน portfolio data
- ไม่เปิดเผย prompt/key/config
- แนบ references เมื่อเกี่ยวกับ project
- ตอบตาม locale `th/en`

### Provider Rules

- timeout ต่อ provider
- retry จำกัด
- fallback เมื่อ timeout/rate limit/unavailable
- log provider used
- ห้ามส่ง provider raw error ไป client

### Security Checklist

- validate message length
- rate limit
- sanitize input
- no secrets in prompt
- no chat session cross-read
- no client direct write to chat tables

### Context Checklist

- ใช้ budget จาก `context-window-management.md`
- recent messages จำกัดจำนวน
- portfolio data เป็น source of truth
- ถามข้อมูลที่ไม่มีต้องไม่เดา

### Quality Checklist

- ปิด Ollama แล้วยัง fallback ได้
- mock Groq fail แล้วยัง fallback OpenRouter ได้
- all providers fail แล้ว error สุภาพ
- loading state ไม่ค้าง
- mobile chat panel ไม่บัง content สำคัญ

### Gate

ผ่าน phase นี้เมื่อ chatbot ตอบคำถามหลักได้ตรง และ fallback provider ผ่าน smoke test

## Phase 6: Context and Retrieval Hardening

### Goal

ลด hallucination, ลด token waste, และทำให้แชตตอบตรงขึ้นเมื่อข้อมูลเยอะขึ้น

### Scope

- portfolio chunks
- weighted search
- session summary
- context trimming
- reference ranking
- dev-only context debug logs

### Deliverables

- `portfolio_chunks` หรือ equivalent
- retrieval ranking utility
- token estimate utility
- summary update flow
- context assembly tests

### Security Checklist

- debug context log ต้องปิดใน production
- context ไม่มี secret/internal data
- summary ไม่สร้าง fact ใหม่
- references เป็น public route เท่านั้น

### Quality Checklist

- คำถาม project ดึง project ตรง
- คำถาม deployment ดึง deployment facts
- คำถาม Microsoft ดึง Entra/Graph API facts
- session ยาวไม่เกิน context limit

### Gate

ผ่าน phase นี้เมื่อ context builder มี tests และคำตอบไม่หลุด scope ในชุดคำถามทดสอบ

## Phase 7: Bilingual and Copy Polish

### Goal

ทำให้ภาษา `th/en` สม่ำเสมอ และลดกลิ่น AI ในข้อความทั้งหมด

### Scope

- navigation labels
- CTA labels
- chat prompts
- error/loading states
- project summaries
- resume page copy
- metadata

### Deliverables

- localized content structure
- copy review checklist
- prompt suggestions `th/en`
- fallback language rules

### Language Checklist

- ไม่มี generic AI phrase
- ไม่มี marketing exaggeration
- ใช้คำตาม `standard.md`
- chatbot ไม่พูด `As an AI language model`
- English ใช้ active voice
- Thai อ่านเป็นธรรมชาติ

### Gate

ผ่าน phase นี้เมื่อ public copy ทุกจุดมี `th/en` หรือ fallback ที่ตั้งใจไว้ และโทนภาษาสอดคล้องกัน

## Phase 8: Professional Motion and UI Polish

### Goal

ยกระดับความรู้สึกของเว็บให้ professional โดยไม่ทำให้เว็บหนักหรือเสีย accessibility

### Scope

- page intro
- section reveal
- hover/focus states
- chat open/close animation
- loading states
- reduced motion

### Deliverables

- motion tokens
- reusable animation utilities/classes
- reduced motion support
- QA screenshots หรือ manual QA notes

### Animation Checklist

- ใช้ duration/easing จาก `animation-standard.md`
- ไม่มี layout shift
- no infinite decorative animation
- chat panel เปิด/ปิดนุ่มและเร็ว
- focus state ชัด
- mobile ไม่กระตุก
- reduced motion ผ่าน

### Gate

ผ่าน phase นี้เมื่อ motion ทำให้เว็บดูตอบสนองดีขึ้น โดยไม่ทำให้ UX ดูเล่นหรือรบกวนเนื้อหา

## Phase 9: Security Hardening

### Goal

ปิดช่องโหว่ก่อน deploy จริง

### Scope

- security headers
- rate limiting
- input validation
- RLS review
- API error review
- dependency audit
- prompt injection tests

### Deliverables

- security header config
- rate limit config
- API validation utilities
- prompt injection test cases
- deployment security checklist

### Security Test Cases

- ขอ API key
- ขอ system prompt
- สั่งให้ลืม rules
- ให้แต่งประสบการณ์เพิ่ม
- ขอข้อมูล session คนอื่น
- ส่ง message ยาวเกิน limit
- spam chat endpoint
- provider fail ทั้งหมด

### Gate

ผ่าน phase นี้เมื่อระบบปฏิเสธ request อันตรายได้ดี และไม่มี secret/internal detail หลุดใน response หรือ logs

## Phase 10: Testing and QA

### Goal

ตรวจ bug สำคัญก่อน production

### Scope

- unit tests
- API tests
- chat fallback tests
- responsive QA
- accessibility QA
- content QA
- manual smoke tests

### Test Matrix

| Area | Must Test |
| --- | --- |
| Pages | Home, Projects, Project detail, Resume, Contact |
| API | `/api/chat`, `/api/chat-health` |
| Provider | Ollama success, Groq fallback, OpenRouter fallback, all failed |
| Security | rate limit, prompt injection, no secret leak |
| UI | mobile, desktop, keyboard, reduced motion |
| Language | th, en, fallback |

### Gate

ผ่าน phase นี้เมื่อ test สำคัญผ่าน และ known issues ไม่มีตัวที่กระทบ security หรือ core UX

## Phase 11: Deployment and Monitoring

### Goal

deploy แบบตรวจสอบได้และ rollback ได้

### Scope

- production env
- Supabase production config
- provider env keys
- build validation
- logging
- uptime/health check
- rollback notes

### Deliverables

- deployment checklist
- env checklist
- smoke test checklist
- rollback instructions
- monitoring notes

### Production Checklist

- `npm run build` ผ่าน
- env production ครบ
- API keys ใช้งานได้
- RLS production เปิด
- chat endpoint rate limit เปิด
- metadata/OG ถูก
- sitemap/robots พร้อม
- provider fallback ผ่าน smoke test

### Gate

ผ่าน phase นี้เมื่อ production smoke test ผ่าน และมีวิธี rollback ชัดเจน

## Phase 12: Maintenance and Iteration

### Goal

ทำให้เว็บปรับปรุงต่อได้โดยไม่พัง standard เดิม

### Scope

- update projects
- add screenshots
- improve retrieval
- analytics review
- copy improvements
- security review
- dependency updates

### Cadence

- weekly: content/project update
- monthly: dependency/security review
- quarterly: resume/project case study refresh
- after every major change: chat safety smoke test

### Maintenance Checklist

- project ใหม่มี `th/en`
- project ใหม่มี tags/stack
- screenshots ไม่มี sensitive data
- chatbot ตอบ project ใหม่ได้
- metadata update
- docs update ถ้า behavior เปลี่ยน

## Bug Prevention Rules

ทำทุกครั้ง:

- validate input ที่ boundary
- handle null/empty state
- keep API response shape stable
- test fallback path
- avoid duplicated business logic
- make provider adapters isolated
- keep content source of truth เดียว
- use TypeScript types for shared data

ห้าม:

- hardcode provider logic ใน route handler
- ให้ client เรียก provider API ตรง
- ให้ UI assume ว่าข้อมูลครบเสมอ
- render rich text โดยไม่ sanitize
- เพิ่ม animation ที่ทำให้ layout shift

## Hack Prevention Rules

ระบบต้องป้องกัน:

- secret leakage
- prompt injection
- chat abuse
- direct database writes
- overly permissive RLS
- exposed internal error
- cross-session data access
- dependency vulnerabilities

ก่อน deploy ต้องทดสอบ:

- malicious prompt
- long input
- repeated requests
- provider timeout
- invalid locale
- missing project slug
- empty database result

## Final Development Rule

ทุก feature ต้องตอบได้ 3 คำถามก่อน merge:

1. ถ้า user ใช้ผิด ระบบพังไหม
2. ถ้า provider/database fail ระบบตอบอย่างไร
3. ถ้า attacker ลองขอข้อมูลภายใน ระบบป้องกันอย่างไร

ถ้าตอบไม่ได้ ให้หยุดและเพิ่ม guard ก่อน
