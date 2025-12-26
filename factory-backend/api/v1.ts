import { Elysia } from 'elysia'
import { apiKeysRouter } from '../src/api-keys/router.js'
import { internalItemsRouter } from '../src/factory/internal-items/router.js'
import { attributesRouter } from '../src/factory/attributes/router.js'

export const v1Routes = new Elysia({ prefix: '/v1' })
  .use(apiKeysRouter)
  .use(internalItemsRouter)
  .use(attributesRouter)

