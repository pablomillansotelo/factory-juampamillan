import { migrate } from 'drizzle-orm/neon-http/migrator'
import { db } from './db.js'

export async function runMigrations() {
  await migrate(db, { migrationsFolder: './drizzle' })
}

