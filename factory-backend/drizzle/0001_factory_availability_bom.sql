-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN
    CREATE TYPE "availability_status" AS ENUM ('planned', 'in_production', 'paused', 'blocked', 'done');
  END IF;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_availability" (
  "id" serial PRIMARY KEY NOT NULL,
  "internal_item_id" integer NOT NULL,
  "status" "availability_status" DEFAULT 'planned' NOT NULL,
  "note" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_boms" (
  "id" serial PRIMARY KEY NOT NULL,
  "internal_item_id" integer NOT NULL,
  "component" text NOT NULL,
  "quantity" numeric(10, 2) DEFAULT '1' NOT NULL,
  "unit" text DEFAULT 'unit',
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'item_availability_internal_item_id_internal_items_id_fk'
  ) THEN
    ALTER TABLE "item_availability" ADD CONSTRAINT "item_availability_internal_item_id_internal_items_id_fk" FOREIGN KEY ("internal_item_id") REFERENCES "internal_items"("id") ON DELETE cascade ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'item_boms_internal_item_id_internal_items_id_fk'
  ) THEN
    ALTER TABLE "item_boms" ADD CONSTRAINT "item_boms_internal_item_id_internal_items_id_fk" FOREIGN KEY ("internal_item_id") REFERENCES "internal_items"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

--> statement-breakpoint


