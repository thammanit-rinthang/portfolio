-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('user', 'assistant', 'system');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('profile', 'skill', 'experience', 'project', 'project_image', 'resume');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "location" TEXT,
    "email" TEXT,
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "resume_url" TEXT,
    "resume_path" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "period_label" TEXT,
    "summary" TEXT,
    "highlights" JSONB NOT NULL DEFAULT '[]',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "problem" TEXT,
    "solution" TEXT,
    "role" TEXT,
    "stack" JSONB NOT NULL DEFAULT '[]',
    "architecture" TEXT,
    "deployment" TEXT,
    "impact" TEXT,
    "github_url" TEXT,
    "demo_url" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "tag" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_path" TEXT,
    "alt" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_key" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "summary" TEXT,
    "active_topic" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "provider" TEXT,
    "model" TEXT,
    "token_estimate" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_provider_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider_name" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "timeout_ms" INTEGER NOT NULL DEFAULT 10000,
    "model_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_provider_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_chunks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_type" "SourceType" NOT NULL,
    "source_id" UUID,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skills_category_priority_idx" ON "skills"("category", "priority");

-- CreateIndex
CREATE INDEX "experiences_sort_order_idx" ON "experiences"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_is_published_is_featured_sort_order_idx" ON "projects"("is_published", "is_featured", "sort_order");

-- CreateIndex
CREATE INDEX "project_tags_tag_idx" ON "project_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "project_tags_project_id_tag_key" ON "project_tags"("project_id", "tag");

-- CreateIndex
CREATE INDEX "project_images_project_id_is_cover_sort_order_idx" ON "project_images"("project_id", "is_cover", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "chat_sessions_session_key_key" ON "chat_sessions"("session_key");

-- CreateIndex
CREATE INDEX "chat_messages_session_id_created_at_idx" ON "chat_messages"("session_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_provider_settings_provider_name_key" ON "ai_provider_settings"("provider_name");

-- CreateIndex
CREATE INDEX "ai_provider_settings_is_enabled_priority_idx" ON "ai_provider_settings"("is_enabled", "priority");

-- CreateIndex
CREATE INDEX "portfolio_chunks_source_type_source_id_idx" ON "portfolio_chunks"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "portfolio_chunks_locale_is_public_priority_idx" ON "portfolio_chunks"("locale", "is_public", "priority");

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UpdatedAtTrigger
CREATE OR REPLACE FUNCTION "public"."set_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "profiles_set_updated_at"
BEFORE UPDATE ON "profiles"
FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "skills_set_updated_at"
BEFORE UPDATE ON "skills"
FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "experiences_set_updated_at"
BEFORE UPDATE ON "experiences"
FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "projects_set_updated_at"
BEFORE UPDATE ON "projects"
FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "project_images_set_updated_at"
BEFORE UPDATE ON "project_images"
FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "chat_sessions_set_updated_at"
BEFORE UPDATE ON "chat_sessions"
FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "ai_provider_settings_set_updated_at"
BEFORE UPDATE ON "ai_provider_settings"
FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "portfolio_chunks_set_updated_at"
BEFORE UPDATE ON "portfolio_chunks"
FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

-- RowLevelSecurity
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "experiences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_provider_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "portfolio_chunks" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable"
ON "profiles"
FOR SELECT
USING ("is_published" = true);

CREATE POLICY "Public skills are readable"
ON "skills"
FOR SELECT
USING ("is_published" = true AND "deleted_at" IS NULL);

CREATE POLICY "Public experiences are readable"
ON "experiences"
FOR SELECT
USING ("is_published" = true AND "deleted_at" IS NULL);

CREATE POLICY "Public projects are readable"
ON "projects"
FOR SELECT
USING ("is_published" = true AND "deleted_at" IS NULL);

CREATE POLICY "Public project tags are readable"
ON "project_tags"
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM "projects"
    WHERE "projects"."id" = "project_tags"."project_id"
      AND "projects"."is_published" = true
      AND "projects"."deleted_at" IS NULL
  )
);

CREATE POLICY "Public project images are readable"
ON "project_images"
FOR SELECT
USING (
  "is_published" = true
  AND "deleted_at" IS NULL
  AND EXISTS (
    SELECT 1
    FROM "projects"
    WHERE "projects"."id" = "project_images"."project_id"
      AND "projects"."is_published" = true
      AND "projects"."deleted_at" IS NULL
  )
);

CREATE POLICY "Public portfolio chunks are readable"
ON "portfolio_chunks"
FOR SELECT
USING ("is_public" = true);
