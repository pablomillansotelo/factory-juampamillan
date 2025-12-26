import { db } from '../db.js'
import { apiKeys } from './schema.js'
import { eq } from 'drizzle-orm'

export class ApiKeysService {
  static async validateApiKey(key: string) {
    const [row] = await db.select().from(apiKeys).where(eq(apiKeys.key, key))
    if (!row) {
      return { valid: false, error: 'API Key no válida' }
    }
    return { valid: true, apiKey: row }
  }
}

