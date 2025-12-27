-- Factory Backend: Production Orders migration
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'production_order_status') THEN
    CREATE TYPE "production_order_status" AS ENUM ('pending','approved','in_production','completed','cancelled');
  END IF;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "production_orders" (
  "id" serial PRIMARY KEY NOT NULL,
  "vendor_order_id" integer NOT NULL,
  "internal_item_id" integer NOT NULL,
  "quantity" integer NOT NULL,
  "priority" integer DEFAULT 3 NOT NULL,
  "status" "production_order_status" DEFAULT 'pending' NOT NULL,
  "notes" text,
  "estimated_completion_date" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_production_orders_vendor_order_id" ON "production_orders" ("vendor_order_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_production_orders_internal_item_id" ON "production_orders" ("internal_item_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_production_orders_status" ON "production_orders" ("status");
