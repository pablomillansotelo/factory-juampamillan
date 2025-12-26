import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const internalItemStatusEnum = pgEnum('internal_item_status', ['active', 'inactive', 'archived'])

export const internalItems = pgTable('internal_items', {
  id: serial('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  status: internalItemStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

