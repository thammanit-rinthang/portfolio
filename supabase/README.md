# Supabase Setup

ไฟล์ในโฟลเดอร์นี้เป็น SQL เฉพาะ Supabase ที่ไม่ควรใส่รวมกับ Prisma migration

ลำดับที่แนะนำ:

1. Apply Prisma migration SQL จาก `prisma/migrations`
2. Run `supabase/storage.sql` ใน Supabase SQL Editor
3. ตรวจ bucket และ policies ใน Supabase dashboard

หมายเหตุ:

- Prisma ดูแล schema ของ application tables
- Supabase SQL ดูแล Storage buckets และ Storage policies
- ห้ามเปิด public upload ใน MVP

