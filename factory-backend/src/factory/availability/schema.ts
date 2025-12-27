import { pgEnum, pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { internalItems } from '../internal-items/schema.js'

export const availabilityStatusEnum = pgEnum('availability_status', [
  'planned',
  'in_production',
  'paused',
  'blocked',
  'done',
])

export const itemAvailability = pgTable('item_availability', {
  id: serial('id').primaryKey(),
  internalItemId: integer('internal_item_id').notNull().references(() => internalItems.id),
  status: availabilityStatusEnum('status').notNull().default('planned'),
  note: text('note'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


