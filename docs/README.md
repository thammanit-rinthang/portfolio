# Documentation Index

โฟลเดอร์นี้คือแหล่งอ้างอิงหลักสำหรับการพัฒนา `AI Resume Portfolio`

ทุกครั้งก่อนเริ่มพัฒนา feature ใหม่ ให้เปิดเอกสารตามลำดับนี้:

1. [System Standards](./standard.md)
2. [Development Phases](./development-phases.md)
3. [Developer Handoff](./developer-handoff.md)
4. [AI Portfolio System Plan](./ai-portfolio-system-plan.md)
5. [Context Window Management Plan](./context-window-management.md)
6. [Animation Standard](./animation-standard.md)
7. [Admin CRUD Plan](./admin-crud-plan.md)
8. [Environment Setup](./env-setup.md)
9. [Portfolio Plan](./portfolio-plan.md)
10. [Phase 4 / 4.5 Fix Checklist](./phase-4-4.5-fix-checklist.md)
11. [Phase 5 to 12 Checklists](./phase-5-to-12-checklists.md)
12. [Deploy Checklist](./deploy-checklist.md)

## Project Summary

ระบบนี้คือเว็บ portfolio สำหรับสมัครงานที่มี `Portfolio Chat` ช่วยตอบคำถามเกี่ยวกับเจ้าของเว็บและโปรเจกต์ โดยใช้ข้อมูลจาก resume, project case studies, และ structured portfolio data เท่านั้น

เป้าหมายของระบบ:

- สื่อความสามารถด้าน full-stack, internal systems, deployment, และ IT operations ให้ชัด
- ทำให้ recruiter หรือ hiring manager เข้าใจจุดแข็งได้เร็ว
- มี chatbot ที่ตอบจากข้อมูลจริง ไม่เดา ไม่พูดเกินจริง
- ใช้ provider fallback: `Groq -> OpenRouter`
- รองรับภาษา `th/en`
- UI ต้อง minimal, credible, professional

## Source of Truth

ลำดับการอ้างอิงเมื่อเอกสารมีข้อมูลซ้ำกัน:

1. `standard.md` สำหรับ rule ที่ต้องทำตาม
2. `development-phases.md` สำหรับลำดับการลงมือ
3. `developer-handoff.md` สำหรับสถานะล่าสุดและสิ่งที่ต้องทำต่อ
4. `context-window-management.md` สำหรับ chat context และ prompt assembly
5. `animation-standard.md` สำหรับ motion/interaction
6. `admin-crud-plan.md` สำหรับ CRUD/admin/content management
7. `env-setup.md` สำหรับ env และ local development setup
8. `ai-portfolio-system-plan.md` สำหรับภาพรวม product และ architecture
9. `portfolio-plan.md` สำหรับแนวคิด portfolio และ content strategy

ถ้าเอกสารขัดกัน ให้ใช้ `standard.md` เป็นหลัก และปรับเอกสารอื่นตาม

## Development Rule

ห้ามเริ่ม implement feature ใหม่โดยไม่มี:

- acceptance criteria
- security notes
- API contract ถ้ามี endpoint
- UI state checklist
- test checklist
- rollback หรือ fallback behavior ถ้า feature เกี่ยวกับ provider/database

## Release Rule

ก่อน deploy ทุกครั้งต้องผ่าน:

- lint/build
- security checklist
- responsive check
- chat safety smoke test
- provider fallback smoke test
- copy review `th/en`
- animation/accessibility check

## Current Core Docs

| File | Purpose |
| --- | --- |
| `standard.md` | มาตรฐานความปลอดภัย, API, UI, ภาษา, testing |
| `development-phases.md` | แผนพัฒนา phase-by-phase พร้อม gate กัน bug/security issue |
| `developer-handoff.md` | สรุปสถานะล่าสุดและแผน phase ที่เหลือสำหรับ developer คนถัดไป |
| `animation-standard.md` | มาตรฐาน motion ให้ดู professional และไม่รบกวน UX |
| `admin-crud-plan.md` | แผน CRUD/admin สำหรับจัดการ portfolio content, media, และ settings |
| `env-setup.md` | รายการ env สำหรับ local development, Supabase, Storage, และ AI providers |
| `context-window-management.md` | แผนจัดการ context window, token budget, retrieval, trimming |
| `ai-portfolio-system-plan.md` | แผนระบบภาพรวมของ AI portfolio |
| `portfolio-plan.md` | แผน content และ structure ของ portfolio |
| `phase-4-4.5-fix-checklist.md` | checklist ปิด gap ของ Supabase integration และ Admin CRUD แบบเป็นระบบ |
| `phase-5-to-12-checklists.md` | checklist phase ถัดไปสำหรับ chatbot, retrieval, copy, motion, security, QA, deploy, maintenance |
