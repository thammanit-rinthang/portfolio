# Environment Setup

เอกสารนี้สรุป env ที่ควรมีสำหรับ development ของ `AI Resume Portfolio`

ไฟล์ที่ใช้:

- `.env.local` สำหรับ Next.js development
- `.env` สำหรับ Prisma CLI ได้ใน local ถ้าต้องการ
- `.env.example` สำหรับ template ที่ commit ได้

ห้าม commit secret จริง

## 1. Minimum Required for Current Repo

ตอนนี้ code ใช้ env โดยตรงแค่ตัวนี้:

```text
DATABASE_URL
```

ใช้โดย:

- `prisma.config.ts`
- Prisma migrations/client ในอนาคต

ถ้ายังไม่ได้ต่อ Supabase หรือ AI สามารถเริ่ม dev UI ได้ด้วย `DATABASE_URL` ก่อน

## 2. App Env

```text
NEXT_PUBLIC_APP_NAME
NEXT_PUBLIC_SITE_URL
```

ใช้สำหรับ:

- metadata
- Open Graph URL
- canonical URL
- OpenRouter attribution

Rules:

- ตัวที่ขึ้นต้น `NEXT_PUBLIC_` จะถูกส่งไป client ได้
- ห้ามใส่ secret ใน `NEXT_PUBLIC_*`

## 3. Database and Prisma

```text
DATABASE_URL
DIRECT_URL
```

ใช้สำหรับ:

- Prisma
- Supabase PostgreSQL
- migrations

คำแนะนำสำหรับ Supabase:

- `DATABASE_URL` ใช้ connection string ที่เหมาะกับ app runtime หรือ pooled connection
- `DIRECT_URL` ใช้ direct connection สำหรับ migration ถ้า schema เพิ่ม `directUrl`
- ตอนนี้ schema ยังไม่ได้ใช้ `DIRECT_URL` แต่เตรียมไว้ได้

## 4. Supabase Client

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

ใช้สำหรับ:

- public read content
- admin/server mutations
- upload ไป Supabase Storage
- chat logs

Security:

- `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ใช้ฝั่ง client ได้
- `SUPABASE_SERVICE_ROLE_KEY` ต้องใช้เฉพาะฝั่ง server
- ห้าม import service role ใน client component

## 5. Supabase Storage

```text
SUPABASE_RESUME_BUCKET
SUPABASE_PROJECT_IMAGES_BUCKET
SUPABASE_OG_IMAGES_BUCKET
SUPABASE_PRIVATE_UPLOADS_BUCKET
```

ค่า default ที่แนะนำ:

```text
SUPABASE_RESUME_BUCKET="resume-assets"
SUPABASE_PROJECT_IMAGES_BUCKET="project-images"
SUPABASE_OG_IMAGES_BUCKET="og-images"
SUPABASE_PRIVATE_UPLOADS_BUCKET="private-uploads"
```

ใช้สำหรับ:

- Resume PDF
- project screenshots
- cover images
- OG images
- draft/private uploads

Storage bucket setup:

- ดู SQL ได้ที่ `supabase/storage.sql`
- run ผ่าน Supabase SQL Editor หลังสร้าง project แล้ว
- public buckets เปิดอ่านไฟล์ได้ แต่ไม่มี public write policy

## 6. Admin

```text
ADMIN_EMAILS
```

ใช้สำหรับ:

- allowlist admin user
- protect `/admin`
- protect admin mutation APIs

Format:

```text
ADMIN_EMAILS="first@example.com,second@example.com"
```

## 7. Chat Runtime

```text
CHAT_DEFAULT_LOCALE
CHAT_MAX_MESSAGE_LENGTH
CHAT_REQUEST_TIMEOUT_MS
CHAT_PROVIDER_TIMEOUT_MS
CHAT_RATE_LIMIT_WINDOW_MS
CHAT_RATE_LIMIT_MAX
```

ค่า default ที่แนะนำ:

```text
CHAT_DEFAULT_LOCALE="en"
CHAT_MAX_MESSAGE_LENGTH="1500"
CHAT_REQUEST_TIMEOUT_MS="20000"
CHAT_PROVIDER_TIMEOUT_MS="10000"
CHAT_RATE_LIMIT_WINDOW_MS="600000"
CHAT_RATE_LIMIT_MAX="20"
```

ใช้สำหรับ:

- validation
- timeout
- rate limit
- locale fallback

## 8. AI Provider Priority

```text
AI_PROVIDER_PRIORITY
```

ค่า default:

```text
AI_PROVIDER_PRIORITY="groq,openrouter"
```

ใช้เพื่อกำหนด fallback order:

1. `groq`
2. `openrouter`

## 9. Groq

```text
GROQ_ENABLED
GROQ_API_KEY
GROQ_MODEL
```

ค่า default:

```text
GROQ_ENABLED="true"
GROQ_API_KEY="YOUR_GROQ_API_KEY"
GROQ_MODEL="llama-3.1-8b-instant"
```

ใช้สำหรับ:

- fast cloud fallback
- primary provider สำหรับ runtime ปัจจุบัน
- production fallback

## 10. OpenRouter

```text
OPENROUTER_ENABLED
OPENROUTER_API_KEY
OPENROUTER_MODEL
OPENROUTER_SITE_URL
OPENROUTER_APP_NAME
```

ค่า default:

```text
OPENROUTER_ENABLED="true"
OPENROUTER_API_KEY="YOUR_OPENROUTER_API_KEY"
OPENROUTER_MODEL="openai/gpt-4o-mini"
OPENROUTER_SITE_URL="http://localhost:3000"
OPENROUTER_APP_NAME="AI Resume Portfolio"
```

ใช้สำหรับ:

- universal backup provider
- ทดลอง model หลายตัว
- fallback เมื่อ Groq limit หรือ unavailable

## 11. Logging and Debug

```text
LOG_LEVEL
ENABLE_CONTEXT_DEBUG_LOGS
```

ค่า default:

```text
LOG_LEVEL="info"
ENABLE_CONTEXT_DEBUG_LOGS="false"
```

Rules:

- เปิด `ENABLE_CONTEXT_DEBUG_LOGS=true` เฉพาะ local development
- ห้ามเปิด context debug logs ใน production
- ห้าม log API keys, service role key, system prompt เต็ม, หรือ raw provider secrets

## 12. Recommended Local Setup

สำหรับ development ที่ลื่นที่สุด:

```text
DATABASE_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GROQ_API_KEY=...
OPENROUTER_API_KEY=...
```

ถ้าต้องการใช้ Groq อย่างเดียว:

```text
GROQ_ENABLED=true
OPENROUTER_ENABLED=false
```

ถ้าต้องการใช้ OpenRouter เป็น fallback:

```text
GROQ_ENABLED=true
OPENROUTER_ENABLED=true
```

## 13. Validation Checklist

ก่อนเริ่ม dev:

- `.env.local` มีค่าที่จำเป็น
- `.env.example` ไม่มี secret จริง
- `DATABASE_URL` ใช้งานได้
- Supabase keys แยก public/server ถูกต้อง
- bucket names ตรงกับ Supabase Storage
- AI provider อย่างน้อย 1 ตัว enabled
- ถ้า enabled provider ต้องมี key ที่ใช้งานได้
- `NEXT_PUBLIC_SITE_URL` ตรงกับ URL dev หรือ production

## 14. Final Rule

ถ้า env มีคำว่า `KEY`, `SECRET`, `TOKEN`, `DATABASE_URL`, หรือ `SERVICE_ROLE` ให้ถือว่าเป็น secret และห้ามส่งไป client
