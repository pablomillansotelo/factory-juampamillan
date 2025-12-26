import { InferModel } from 'drizzle-orm'
import { apiKeys } from './schema.js'

export type ApiKey = InferModel<typeof apiKeys>

