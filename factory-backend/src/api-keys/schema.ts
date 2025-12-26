import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  rateLimit: integer('rate_limit').default(100),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

