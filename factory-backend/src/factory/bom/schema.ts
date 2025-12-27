import { pgTable, serial, integer, text, numeric, timestamp } from 'drizzle-orm/pg-core'
import { internalItems } from '../internal-items/schema.js'

export const itemBoms = pgTable('item_boms', {
  id: serial('id').primaryKey(),
  internalItemId: integer('internal_item_id').notNull().references(() => internalItems.id),
  component: text('component').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull().default('1'),
  unit: text('unit').default('unit'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


