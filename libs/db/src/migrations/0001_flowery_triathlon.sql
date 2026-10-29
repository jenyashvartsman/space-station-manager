ALTER TABLE "modules" ADD COLUMN "repairing" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "modules" ADD COLUMN "repair_progress" integer DEFAULT 0 NOT NULL;