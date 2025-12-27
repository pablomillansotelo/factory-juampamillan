import { Elysia } from 'elysia'
import { apiKeysRouter } from '../src/api-keys/router.js'
import { internalItemsRouter } from '../src/factory/internal-items/router.js'
import { attributesRouter } from '../src/factory/attributes/router.js'
import { availabilityRouter } from '../src/factory/availability/router.js'
import { bomRouter } from '../src/factory/bom/router.js'
import { productionOrdersRouter } from '../src/factory/production-orders/router.js'

export const v1Routes = new Elysia({ prefix: '/v1' })
  .use(apiKeysRouter)
  .use(internalItemsRouter)
  .use(attributesRouter)
  .use(availabilityRouter)
  .use(bomRouter)
  .use(productionOrdersRouter)

