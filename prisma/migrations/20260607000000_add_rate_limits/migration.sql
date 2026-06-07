-- CreateTable
CREATE TABLE IF NOT EXISTS "rate_limits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ip_address" TEXT NOT NULL,
    "action_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "rate_limits_ip_action_created_idx" ON "rate_limits"("ip_address", "action_key", "created_at");
