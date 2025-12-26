CREATE TYPE "internal_item_status" AS ENUM ('active', 'inactive', 'archived');

CREATE TABLE "api_keys" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "key" text NOT NULL UNIQUE,
  "rate_limit" integer DEFAULT 100,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "internal_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "sku" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text,
  "status" "internal_item_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "item_attributes" (
  "id" serial PRIMARY KEY NOT NULL,
  "internal_item_id" integer NOT NULL,
  "key" text NOT NULL,
  "value" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "item_attributes" ADD CONSTRAINT "item_attributes_internal_item_id_internal_items_id_fk" FOREIGN KEY ("internal_item_id") REFERENCES "internal_items"("id");

--> statement-breakpoint

