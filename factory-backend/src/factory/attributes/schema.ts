import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { internalItems } from '../internal-items/schema.js'

export const itemAttributes = pgTable('item_attributes', {
  id: serial('id').primaryKey(),
  internalItemId: integer('internal_item_id').notNull().references(() => internalItems.id),
  key: text('key').notNull(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

