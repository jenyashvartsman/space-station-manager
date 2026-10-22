ALTER TABLE "missions" ADD COLUMN IF NOT EXISTS "duration_seconds" integer NOT NULL DEFAULT 60;
