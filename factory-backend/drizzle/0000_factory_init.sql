-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'internal_item_status') THEN
    CREATE TYPE "internal_item_status" AS ENUM ('active', 'inactive', 'archived');
  END IF;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_keys" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "key" text NOT NULL UNIQUE,
  "rate_limit" integer DEFAULT 100,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "internal_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "sku" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text,
  "status" "internal_item_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_attributes" (
  "id" serial PRIMARY KEY NOT NULL,
  "internal_item_id" integer NOT NULL,
  "key" text NOT NULL,
  "value" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'item_attributes_internal_item_id_internal_items_id_fk'
  ) THEN
    ALTER TABLE "item_attributes" ADD CONSTRAINT "item_attributes_internal_item_id_internal_items_id_fk" FOREIGN KEY ("internal_item_id") REFERENCES "internal_items"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

--> statement-breakpoint

