# System Standards

เอกสารนี้คือมาตรฐานกลางสำหรับเว็บ `Resume Portfolio` และระบบแชตถามตอบเกี่ยวกับเจ้าของเว็บและโปรเจกต์

เอกสารที่ต้องอ่านคู่กัน:

- [Documentation Index](./README.md)
- [Development Phases](./development-phases.md)
- [Animation Standard](./animation-standard.md)
- [Context Window Management Plan](./context-window-management.md)
- [Admin CRUD Plan](./admin-crud-plan.md)
- [Environment Setup](./env-setup.md)

เป้าหมายของมาตรฐานนี้:

- ทำให้ระบบปลอดภัยตั้งแต่เริ่มออกแบบ
- ทำให้ API อ่านง่าย ทดสอบง่าย และเปลี่ยน provider ได้
- ทำให้ UI เรียบ น่าเชื่อถือ และใช้ได้จริงทั้ง desktop/mobile
- ทำให้ภาษา `th/en` สม่ำเสมอ
- ทำให้ข้อความในระบบอ่านเหมือนคนทำงานจริง ไม่เหมือนข้อความ AI สำเร็จรูป

## 1. Product Standard

ระบบนี้คือ portfolio สำหรับสมัครงาน ไม่ใช่ chatbot ทั่วไป

หลักการสำคัญ:

- หน้าเว็บต้องสื่อความสามารถได้แม้ผู้ใช้ไม่เปิดแชต
- แชตต้องช่วยตอบเรื่องเจ้าของเว็บและโปรเจกต์เท่านั้น
- ทุกคำตอบต้องอิงจากข้อมูลจริงใน portfolio
- เนื้อหาต้องเน้นหลักฐาน ผลงาน และผลลัพธ์ มากกว่าคำโฆษณา
- UI ต้อง minimal, credible, professional

คำที่ใช้เรียก feature ต่อผู้ใช้:

| Context | TH | EN |
| --- | --- | --- |
| Main chat feature | ถามข้อมูลโปรไฟล์ | Portfolio Chat |
| Chat helper | แชตช่วยค้นข้อมูล | Portfolio Assistant |
| Project detail | รายละเอียดโปรเจกต์ | Project Case Study |
| Resume | Resume | Resume |
| Work experience | ประสบการณ์ทำงาน | Work Experience |
| Skills | ทักษะ | Skills |

หมายเหตุ:

- ใช้คำว่า `AI` เท่าที่จำเป็นใน UI
- หน้า marketing หรือ section แนะนำ feature ใช้คำว่า `Portfolio Chat` ดีกว่า `AI Chatbot`
- ใน technical docs ใช้คำว่า `AI provider`, `AI service`, `model` ได้ตามปกติ

## 2. Security Standard

### 2.1 Secrets and Environment

รายการ env ที่ใช้สำหรับ local development, Supabase, Storage, AI providers, admin, rate limit, และ debug ให้ยึดตาม [Environment Setup](./env-setup.md)

ต้องทำ:

- เก็บ `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` ใน environment variables เท่านั้น
- ใช้ `SUPABASE_SERVICE_ROLE_KEY` เฉพาะฝั่ง server
- ห้ามส่ง API key, service role key, database URL, system prompt ไป client
- แยก `.env.local`, `.env.production`, และตัวอย่าง `.env.example`
- `.env*` ต้องไม่ถูก commit ยกเว้น `.env.example`

ควรทำ:

- ใช้ชื่อ env ที่อ่านตรงตัว เช่น `OLLAMA_BASE_URL`, `GROQ_MODEL`, `OPENROUTER_MODEL`
- ตั้ง timeout ต่อ provider ผ่าน env หรือ provider settings

### 2.2 Supabase and Database

ต้องทำ:

- เปิด Row Level Security สำหรับตารางที่ client อ่านได้
- public data อ่านได้เฉพาะ record ที่ publish แล้ว
- chat logs ต้องถูกเขียนผ่าน server API เท่านั้น
- ห้ามให้ client เขียน `chat_messages` ตรงผ่าน anon key
- service role key ใช้เฉพาะใน route handlers/server utilities

ตาราง public content ที่อ่านได้:

- `profiles`
- `skills`
- `experiences`
- `projects`
- `project_tags`
- `project_images`

ตารางที่ต้อง server-only:

- `chat_sessions`
- `chat_messages`
- `ai_provider_settings`
- provider health logs ถ้ามี

### 2.3 File Storage Standard

ระบบควรรองรับการเก็บไฟล์ใน Supabase Storage สำหรับไฟล์ที่เป็นส่วนหนึ่งของ portfolio

ไฟล์ที่ควรเก็บใน Supabase Storage:

- Resume PDF
- Project screenshots
- Project cover images
- Open Graph source images ถ้าต้องการจัดการผ่าน dashboard

ไฟล์ที่อาจเก็บใน `public/` แทน:

- favicon
- static brand assets
- placeholder images
- assets ที่แทบไม่เปลี่ยน

Bucket ที่แนะนำ:

| Bucket | Access | Use |
| --- | --- | --- |
| `resume-assets` | public read, server write | Resume PDF และ public resume files |
| `project-images` | public read, server write | project screenshots, cover images |
| `og-images` | public read, server write | generated/static OG images ถ้าต้อง persist |
| `private-uploads` | private | ไฟล์ draft หรือไฟล์ที่ยังไม่ตรวจข้อมูล sensitive |

Rules:

- upload ต้องทำผ่าน server API หรือ admin-only flow เท่านั้น
- ห้ามให้ public client upload เข้า bucket โดยตรงใน MVP
- ทุกไฟล์ต้อง validate MIME type และ size ก่อน upload
- filename ต้อง normalize และใส่ unique suffix
- ห้ามใช้ original filename ตรงๆ ถ้ามีข้อมูลส่วนตัว
- public URL ต้องเก็บใน database เป็น `*_url`
- storage path ต้องเก็บเพิ่มเป็น `*_path` ถ้าต้องรองรับ delete/replace
- screenshots ต้องตรวจว่าไม่มีข้อมูลบริษัท, user, email, token, IP, หรือข้อมูลภายในก่อน publish

File limits ที่แนะนำ:

| File Type | Allowed MIME | Max Size |
| --- | --- | --- |
| Resume PDF | `application/pdf` | 5 MB |
| Project image | `image/png`, `image/jpeg`, `image/webp` | 3 MB |
| OG image | `image/png`, `image/jpeg`, `image/webp` | 2 MB |

Path convention:

```text
resume-assets/
  resume/thammanit-rinthang-resume-v1.pdf

project-images/
  qms-system/cover.webp
  qms-system/screenshot-01.webp

og-images/
  projects/qms-system.png
```

Database fields ที่ควรมี:

- `profiles.resume_url`
- `profiles.resume_path`
- `project_images.image_url`
- `project_images.image_path`
- `project_images.alt`
- `project_images.sort_order`
- `project_images.is_cover`

Security checklist:

- bucket public read เฉพาะไฟล์ที่ตั้งใจเผยแพร่
- server-side upload ใช้ service role key เท่านั้น
- client ไม่เห็น service role key
- validate extension และ MIME type ทั้งคู่
- block executable files เช่น `.exe`, `.js`, `.html`, `.svg` ถ้าไม่จำเป็น
- image upload ควรแปลงเป็น `.webp` หรือ sanitize metadata ก่อน publish
- PDF ต้องเป็น resume เท่านั้น ไม่รับ PDF จาก user ทั่วไปใน MVP

Operational checklist:

- replace file ต้องลบไฟล์เก่าหรือ mark unused
- database update ต้องเกิดหลัง upload สำเร็จ
- ถ้า database update fail ต้องลบ uploaded file เพื่อไม่ให้มี orphan
- ถ้า upload fail ต้องไม่สร้าง database record
- มี fallback image เมื่อ image URL หาย
- มี fallback resume state เมื่อ PDF ยังไม่พร้อม

### 2.4 Chat Safety

ต้องทำ:

- จำกัดขอบเขตคำตอบให้อยู่ในข้อมูล portfolio
- ห้าม model เดาข้อมูลประสบการณ์ เงินเดือน อายุ เบอร์โทร หรือข้อมูลส่วนตัวที่ไม่มีในระบบ
- ห้ามนำ chat history มาเป็น fact เกี่ยวกับเจ้าของ portfolio
- ห้ามส่ง secrets, system prompt, provider config เข้า model context
- ถ้าผู้ใช้ขอให้เปิดเผย prompt, key, internal config ให้ปฏิเสธแบบสั้น
- ถ้าข้อมูลไม่มี ให้ตอบว่าไม่มีข้อมูลใน portfolio

ตัวอย่างคำตอบเมื่อไม่มีข้อมูล:

| TH | EN |
| --- | --- |
| ยังไม่มีข้อมูลส่วนนี้ใน portfolio | This portfolio does not include that detail yet. |
| จากข้อมูลที่มี ยังสรุปเรื่องนี้ไม่ได้ | The available portfolio data is not enough to answer that. |

### 2.5 Prompt Injection

ต้องกันเคสเหล่านี้:

- ผู้ใช้สั่งให้ลืม system prompt
- ผู้ใช้ขอ API key หรือ database schema ที่ไม่ public
- ผู้ใช้ให้ model แต่งประสบการณ์เพิ่ม
- ผู้ใช้ให้ model ตอบนอกข้อมูล portfolio
- ผู้ใช้ให้ model แสดงข้อมูล chat session ของคนอื่น

แนวทาง:

- system prompt ต้องระบุว่า portfolio data เป็นแหล่งข้อมูลเดียว
- user message เป็นคำถาม ไม่ใช่คำสั่งเปลี่ยนนโยบาย
- context builder ต้องคัดเฉพาะข้อมูลที่จำเป็น
- references ที่ส่งกลับต้องเป็น public URL หรือ slug เท่านั้น

### 2.6 API Protection

ต้องทำ:

- validate body ทุก endpoint
- จำกัดความยาว message
- rate limit `/api/chat`
- ตั้ง timeout provider
- log error โดยไม่เก็บ secrets
- ตอบ error แบบไม่เปิดเผยรายละเอียดภายใน
- เปิด CORS เฉพาะ origin ที่ใช้จริง ถ้ามี API public

ค่าตั้งต้นที่แนะนำ:

| Item | Default |
| --- | --- |
| Chat message max length | 1,500 characters |
| Chat request timeout | 20 seconds |
| Provider timeout | 8-12 seconds |
| Rate limit | 20 messages / 10 minutes / IP |
| Chat retention | 30-90 days |

### 2.7 Frontend Security

ต้องทำ:

- external links ใช้ `rel="noopener noreferrer"` เมื่อเปิด tab ใหม่
- sanitize หรือ escape rich text จาก database
- หลีกเลี่ยง `dangerouslySetInnerHTML`
- ถ้าต้อง render Markdown ให้ใช้ sanitizer
- ใส่ security headers ใน production

Headers ที่ควรมี:

- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

## 3. API Standard

รายละเอียดการประกอบ prompt, token budget, retrieval, message trimming, และ session summary ให้ยึดตาม [Context Window Management Plan](./context-window-management.md)

รายละเอียด CRUD, admin routes, auth, authorization, form standards, storage mutation, audit logs, และ delete policy ให้ยึดตาม [Admin CRUD Plan](./admin-crud-plan.md)

### 3.1 General Rules

ต้องทำ:

- ใช้ Next.js Route Handlers สำหรับ API
- request/response ต้องเป็น JSON ยกเว้น streaming endpoint
- validate input ก่อนเรียก database หรือ provider
- response ทุกตัวต้องมีรูปแบบคงที่
- error ต้องมี `code` และ `message`
- JSON ใช้ `camelCase`
- database columns ใช้ `snake_case`
- URL slug ใช้ `kebab-case`

### 3.2 Response Envelope

Success response:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Message is too long."
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

### 3.3 HTTP Status Codes

| Status | Use |
| --- | --- |
| `200` | Request สำเร็จ |
| `201` | สร้าง resource สำเร็จ |
| `400` | input ไม่ถูกต้อง |
| `401` | ไม่มีสิทธิ์หรือ token ไม่ถูกต้อง |
| `403` | มีตัวตนแต่ไม่มีสิทธิ์ |
| `404` | ไม่พบ resource |
| `409` | conflict เช่น slug ซ้ำ |
| `422` | validation ผ่าน format แต่ใช้ไม่ได้เชิง business rule |
| `429` | rate limit |
| `500` | server error |
| `503` | provider หรือ dependency ใช้งานไม่ได้ |

### 3.4 Error Codes

ใช้ error code แบบ uppercase snake case:

- `VALIDATION_ERROR`
- `RATE_LIMITED`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `PROVIDER_TIMEOUT`
- `PROVIDER_RATE_LIMITED`
- `PROVIDER_UNAVAILABLE`
- `ALL_PROVIDERS_FAILED`
- `INTERNAL_ERROR`

### 3.5 Chat Endpoint

Endpoint:

```text
POST /api/chat
```

Request:

```json
{
  "message": "Which projects use Next.js and PostgreSQL?",
  "sessionId": "optional-session-id",
  "locale": "en"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "sessionId": "chat_123",
    "answer": "The strongest matches are QMS System and IT Management...",
    "provider": "groq",
    "model": "llama-3.1-8b-instant",
    "references": [
      {
        "type": "project",
        "title": "QMS System",
        "href": "/projects/qms-system"
      }
    ]
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

Rules:

- `message` required
- `locale` ต้องเป็น `th` หรือ `en`
- `sessionId` optional
- response ต้องระบุ provider ที่ใช้จริง
- references ต้องเป็นข้อมูล public
- ถ้าทุก provider fail ให้ตอบ `503`

### 3.6 Chat Health Endpoint

Endpoint:

```text
GET /api/chat-health
```

Response:

```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "name": "ollama",
        "available": true,
        "priority": 1
      },
      {
        "name": "groq",
        "available": true,
        "priority": 2
      },
      {
        "name": "openrouter",
        "available": true,
        "priority": 3
      }
    ]
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

Rules:

- ห้ามส่ง API keys หรือ raw provider errors
- ใช้สำหรับ UI/debug เท่านั้น
- production UI ไม่ควรแสดง technical status ละเอียดเกินไป

### 3.7 Provider Fallback

Default priority:

1. `ollama`
2. `groq`
3. `openrouter`

Provider selection rules:

- ข้าม provider ที่ disabled
- ข้าม provider ที่ health check fail ในช่วง cache window
- ถ้า timeout ให้ลอง provider ถัดไป
- ถ้า rate limit ให้ลอง provider ถัดไป
- ถ้า response ไม่ valid ให้ลอง provider ถัดไป
- ถ้าสำเร็จให้บันทึก provider และ model ใน `chat_messages`

Fallback message:

| TH | EN |
| --- | --- |
| ตอนนี้แชตตอบไม่ได้ชั่วคราว ลองใหม่อีกครั้ง | Chat is temporarily unavailable. Please try again. |

### 3.8 Pagination and Filtering

ถ้ามี endpoint list:

```text
GET /api/projects?page=1&pageSize=12&tag=nextjs
```

Response meta:

```json
{
  "page": 1,
  "pageSize": 12,
  "total": 32,
  "hasNextPage": true
}
```

Rules:

- default `pageSize` = 12
- max `pageSize` = 50
- filter keys ใช้ชื่ออ่านง่าย เช่น `tag`, `featured`, `stack`

## 4. UI Standard

รายละเอียด motion, transition, hover, chat panel animation, reduced motion, และ performance ให้ยึดตาม [Animation Standard](./animation-standard.md)

### 4.1 Visual Direction

ภาพรวม:

- เรียบ
- คม
- น่าเชื่อถือ
- อ่านง่าย
- ดูเหมือนระบบที่ใช้งานจริง

ต้องทำ:

- ใช้ spacing สม่ำเสมอ
- ใช้สีหลักไม่เกิน 1 accent
- ใช้ neutral colors เป็นพื้น
- ใช้ border และ shadow แบบ subtle
- card radius ไม่เกิน `8px` ยกเว้น component เฉพาะที่มีเหตุผล
- CTA ต้องชัด แต่ไม่ตะโกน

หลีกเลี่ยง:

- gradient หนัก
- animation เยอะ
- card ซ้อน card
- section ที่ดูเหมือน template landing page ทั่วไป
- ข้อความขายเกินจริง

### 4.2 Layout

ต้องรองรับ:

- mobile
- tablet
- desktop
- wide desktop

แนวทาง:

- content max width ประมาณ `1120px-1200px`
- body text อ่านสบาย ไม่ยาวเต็มจอ
- project detail ใช้ layout ที่อ่านเป็น case study ได้
- chatbot panel ต้องไม่บัง CTA สำคัญบน mobile
- navbar ต้องใช้ง่ายด้วย keyboard

### 4.3 Components

Component หลัก:

- `Header`
- `Footer`
- `Button`
- `LinkButton`
- `ProjectCard`
- `ProjectTag`
- `SectionHeader`
- `SkillGroup`
- `Timeline`
- `ChatLauncher`
- `ChatPanel`
- `ChatMessage`
- `SuggestedPrompt`

Rules:

- button text ต้องเป็น action ชัดเจน
- link ไป page ใช้ semantic link
- icon ใช้เพื่อช่วย scan ไม่ใช่ตกแต่งอย่างเดียว
- loading state ต้องไม่ทำ layout shift
- focus state ต้องมองเห็นชัด

### 4.4 Chat UI

Chat placement:

- desktop: floating button มุมขวาล่าง เปิดเป็น side panel
- mobile: floating button เปิดเป็น full-height sheet

Chat panel ต้องมี:

- header สั้น เช่น `Portfolio Chat`
- suggested prompts
- message history
- input
- send button
- references ในคำตอบ
- error state
- loading state

Chat panel ไม่ควรมี:

- ข้อความอธิบายยาวๆ ว่า chatbot ทำอะไรได้
- technical provider logs
- คำว่า `AI` ซ้ำหลายจุด
- mascot หรือภาษาที่ทำให้ดูเล่นเกินไป

### 4.5 Accessibility

ต้องทำ:

- ใช้ semantic HTML
- input มี label หรือ accessible name
- icon-only button มี `aria-label`
- contrast ผ่าน WCAG AA
- รองรับ keyboard navigation
- trap focus ใน modal/sheet
- ปิด chat ได้ด้วย `Esc`
- error ต้องอ่านเข้าใจได้โดย screen reader

### 4.6 Loading and Empty States

ใช้ข้อความสั้น:

| Context | TH | EN |
| --- | --- | --- |
| Chat loading | กำลังค้นข้อมูล | Looking up the details |
| No projects | ยังไม่มีโปรเจกต์ในหมวดนี้ | No projects in this category yet |
| No search result | ไม่พบข้อมูลที่ตรงกัน | No matching results |
| General error | มีบางอย่างผิดพลาด ลองใหม่อีกครั้ง | Something went wrong. Please try again. |

หลีกเลี่ยง:

- `AI กำลังคิด...`
- `ระบบอัจฉริยะกำลังประมวลผล...`
- `ขออภัยในความไม่สะดวกอย่างสูง`

## 5. Language Standard

### 5.1 Supported Languages

ระบบต้องรองรับ:

- `th`
- `en`

Default:

- ใช้ `en` เป็น default สำหรับ portfolio public
- ให้ผู้ใช้เปลี่ยนเป็น `th` ได้
- จำภาษาด้วย cookie หรือ local storage
- chatbot ต้องตอบภาษาเดียวกับ `locale` ปัจจุบัน ยกเว้นผู้ใช้ถามเป็นอีกภาษาอย่างชัดเจน

### 5.2 Content Source

ห้าม hardcode copy กระจายตาม component โดยไม่มีเหตุผล

แนะนำให้ใช้ structured content:

```ts
type LocalizedText = {
  th: string
  en: string
}
```

หรือแยกไฟล์:

```text
content/
  th/
  en/
```

Rules:

- ทุก navigation label ต้องมี `th/en`
- ทุก CTA ต้องมี `th/en`
- project content สำคัญควรมี `th/en`
- ถ้า content ยังแปลไม่ครบ ให้ fallback เป็น `en`
- ห้ามผสมไทยอังกฤษแบบไม่ตั้งใจใน sentence เดียว ยกเว้นชื่อ tech, product, repo

### 5.3 Tone of Voice

โทนรวม:

- ตรง
- สุภาพ
- ไม่เยิ่นเย้อ
- ไม่โอ้อวด
- เน้นงานจริง
- อ่านเหมือนคนที่ทำงานจริงเขียน

ภาษาไทย:

- ใช้ประโยคสั้น
- ใช้คำธรรมชาติ เช่น `ทำ`, `ดูแล`, `เชื่อมต่อ`, `นำไปใช้`, `แก้ปัญหา`
- ใช้คำอังกฤษสำหรับ tech ตามจริง เช่น `deploy`, `Docker`, `Next.js`, `API`
- ไม่ต้องลงท้าย `ครับ/ค่ะ` ใน UI ทั่วไป
- ใน chatbot ใช้น้ำเสียงสุภาพได้ แต่ไม่ต้องเป็นทางการจัด

ภาษาอังกฤษ:

- ใช้ active voice
- ใช้คำเรียบ เช่น `built`, `deployed`, `maintained`, `integrated`
- หลีกเลี่ยงคำใหญ่ที่ไม่มีหลักฐาน
- ใช้ `I` เฉพาะใน about/resume copy ที่ตั้งใจให้เป็น personal
- chatbot ควรพูดถึงเจ้าของเว็บเป็นบุคคลที่สาม เช่น `He has experience with...`

### 5.4 Words to Prefer

| Meaning | TH | EN |
| --- | --- | --- |
| project | โปรเจกต์ | project |
| case study | case study | case study |
| production | production | production |
| deployment | deployment | deployment |
| internal system | ระบบภายใน | internal system |
| workflow | workflow | workflow |
| resume | Resume | resume |
| contact | ติดต่อ | contact |
| chat | แชต | chat |
| ask | ถาม | ask |

### 5.5 Words to Avoid

หลีกเลี่ยงคำที่ทำให้ดูเป็น AI หรือ marketing เกินไป:

| Avoid TH | Better TH |
| --- | --- |
| ระบบอัจฉริยะ | แชตช่วยค้นข้อมูล |
| ขับเคลื่อนด้วย AI | มีแชตช่วยตอบจากข้อมูล portfolio |
| ยกระดับประสบการณ์ | ช่วยให้ดูข้อมูลได้เร็วขึ้น |
| ปลดล็อกศักยภาพ | ใช้งานได้จริง |
| โซลูชันครบวงจร | ระบบที่ดูแลตั้งแต่พัฒนาถึง deploy |
| ขออภัยในความไม่สะดวก | มีบางอย่างผิดพลาด ลองใหม่อีกครั้ง |
| กรุณาดำเนินการ | ลองใหม่ |

| Avoid EN | Better EN |
| --- | --- |
| AI-powered experience | portfolio chat |
| unlock potential | make it easier to review |
| cutting-edge solution | practical system |
| seamless experience | simple flow |
| leverage | use |
| utilize | use |
| apologize for the inconvenience | something went wrong |

### 5.6 Chat Answer Style

Chatbot ต้องตอบแบบ:

- สั้นก่อน แล้วค่อยให้รายละเอียดถ้าจำเป็น
- ถ้าพูดถึงโปรเจกต์ ให้ใส่ชื่อโปรเจกต์และลิงก์
- ถ้าพูดถึง skill ให้โยงกลับไปงานหรือโปรเจกต์จริง
- ถ้าไม่มีข้อมูล ให้บอกตรงๆ
- ไม่พูดว่า `As an AI language model`
- ไม่พูดว่า `I think` เมื่อข้อมูลมาจาก portfolio
- ไม่แต่งตัวเลข impact เอง

ตัวอย่าง TH:

```text
จากข้อมูลใน portfolio เขาเด่นด้านการทำระบบภายในองค์กรแบบ full-stack โดยดูแลตั้งแต่ requirement, development, deployment, จนถึง support ผู้ใช้จริง

โปรเจกต์ที่ควรดูต่อคือ QMS System และ IT Management
```

ตัวอย่าง EN:

```text
Based on the portfolio, he is strongest in building internal business systems end to end, from requirements and development to deployment and user support.

The best projects to review next are QMS System and IT Management.
```

### 5.7 CTA Labels

| Action | TH | EN |
| --- | --- | --- |
| View projects | ดูโปรเจกต์ | View Projects |
| Read case study | อ่าน case study | Read Case Study |
| Download resume | ดาวน์โหลด Resume | Download Resume |
| Contact | ติดต่อ | Contact |
| Open chat | ถามข้อมูลโปรไฟล์ | Ask About This Profile |
| Send chat | ส่ง | Send |
| Try prompt | ลองถามเรื่องนี้ | Try This |
| Copy email | คัดลอกอีเมล | Copy Email |
| View GitHub | ดู GitHub | View GitHub |

### 5.8 Navigation Labels

| Route | TH | EN |
| --- | --- | --- |
| `/` | หน้าแรก | Home |
| `/projects` | โปรเจกต์ | Projects |
| `/resume` | Resume | Resume |
| `/contact` | ติดต่อ | Contact |

## 6. Content Quality Standard

ทุก project ต้องตอบ 6 ข้อนี้ได้:

1. ปัญหาคืออะไร
2. ใครใช้หรือได้รับผลกระทบ
3. คุณทำส่วนไหน
4. ใช้ tech อะไร
5. deploy หรือดูแลอย่างไร
6. ผลลัพธ์คืออะไร

Project copy ต้องเลี่ยง:

- list tech อย่างเดียว
- คำว่า `ทำระบบ` โดยไม่บอกปัญหา
- claim ที่ไม่มีหลักฐาน
- metric ที่ยังไม่ได้ยืนยัน

Project copy ควรมี:

- problem
- solution
- stack
- role
- deployment
- impact

## 7. Logging and Observability

ต้อง log:

- request id
- endpoint
- status code
- provider used
- provider failure reason แบบ sanitized
- latency
- rate limit events

ห้าม log:

- API keys
- service role key
- full system prompt
- raw secrets
- sensitive user input ที่ไม่จำเป็น

สำหรับ chat logs:

- เก็บ message เท่าที่ต้องใช้ debug หรือปรับปรุง UX
- กำหนด retention
- ถ้าจะใช้ analytics ให้ใช้ aggregated data ก่อน

## 8. Testing Standard

ลำดับการพัฒนา, phase gates, QA matrix, security hardening, และ deployment checklist ให้ยึดตาม [Development Phases](./development-phases.md)

ควรมี test อย่างน้อย:

- validation ของ `/api/chat`
- provider fallback
- context builder ไม่ส่งข้อมูลนอก scope
- error response shape
- language fallback `th/en`
- UI rendering ของ chat panel
- keyboard close/open chat

Manual QA checklist:

- เปิดเว็บบน mobile แล้วไม่บัง CTA
- แชตตอบคำถามจาก portfolio ได้
- ถามข้อมูลที่ไม่มีแล้วไม่เดา
- ปิด Ollama แล้ว fallback ไป Groq/OpenRouter
- ติด rate limit แล้วระบบตอบ error ดีพอ
- share project link แล้ว metadata ถูกต้อง

## 9. Review Checklist

ก่อน merge หรือ deploy:

- ไม่มี secret ใน code หรือ git diff
- API response ใช้ envelope เดียวกัน
- error ไม่ leak รายละเอียดระบบ
- UI มี loading/error/empty state
- text มีทั้ง `th/en` ถ้าเป็น public copy
- chatbot ไม่ตอบนอกข้อมูล portfolio
- provider fallback ผ่าน smoke test
- mobile layout อ่านง่าย
- copy ไม่ใช้คำ AI/marketing เกินจำเป็น

## 10. Final Rule

ถ้าต้องเลือกระหว่างความหวือหวากับความน่าเชื่อถือ ให้เลือกความน่าเชื่อถือ

ระบบนี้ควรทำให้คนดูรู้สึกว่าเจ้าของเว็บ:

- ทำงานจริง
- คิดเป็นระบบ
- เข้าใจ production
- ใช้ AI อย่างมีเป้าหมาย
- สื่อสารตรงและตรวจสอบได้
