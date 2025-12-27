CREATE TYPE "availability_status" AS ENUM ('planned', 'in_production', 'paused', 'blocked', 'done');

CREATE TABLE "item_availability" (
  "id" serial PRIMARY KEY NOT NULL,
  "internal_item_id" integer NOT NULL,
  "status" "availability_status" DEFAULT 'planned' NOT NULL,
  "note" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "item_availability" ADD CONSTRAINT "item_availability_internal_item_id_internal_items_id_fk" FOREIGN KEY ("internal_item_id") REFERENCES "internal_items"("id");

CREATE TABLE "item_boms" (
  "id" serial PRIMARY KEY NOT NULL,
  "internal_item_id" integer NOT NULL,
  "component" text NOT NULL,
  "quantity" numeric(10, 2) DEFAULT '1' NOT NULL,
  "unit" text DEFAULT 'unit',
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "item_boms" ADD CONSTRAINT "item_boms_internal_item_id_internal_items_id_fk" FOREIGN KEY ("internal_item_id") REFERENCES "internal_items"("id");

--> statement-breakpoint


