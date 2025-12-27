import { Elysia, t } from 'elysia'
import { ProductionOrdersService } from './service.js'

export const productionOrdersRouter = new Elysia({ prefix: '/production-orders' })
  .get(
    '/',
    async ({ query }) => {
      const filters: any = {}
      if ((query as any)?.vendorOrderId) filters.vendorOrderId = Number((query as any).vendorOrderId)
      if ((query as any)?.status) filters.status = (query as any).status
      const list = await ProductionOrdersService.list(Object.keys(filters).length ? filters : undefined)
      return { data: list, total: list.length, offset: null, limit: null }
    },
    {
      query: t.Object({
        vendorOrderId: t.Optional(t.String()),
        status: t.Optional(t.Union([
          t.Literal('pending'),
          t.Literal('approved'),
          t.Literal('in_production'),
          t.Literal('completed'),
          t.Literal('cancelled'),
        ])),
      }),
      detail: { tags: ['production-orders'], summary: 'Listar órdenes de producción' },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const order = await ProductionOrdersService.getById(Number(params.id))
      return { data: order }
    },
    { params: t.Object({ id: t.Numeric() }), detail: { tags: ['production-orders'], summary: 'Obtener orden de producción' } }
  )
  .post(
    '/',
    async ({ body }) => {
      const created = await ProductionOrdersService.create(body)
      return { data: created }
    },
    {
      body: t.Object({
        vendorOrderId: t.Numeric(),
        internalItemId: t.Numeric(),
        quantity: t.Numeric(),
        priority: t.Optional(t.Numeric()),
        notes: t.Optional(t.String()),
        estimatedCompletionDate: t.Optional(t.String()),
      }),
      detail: { tags: ['production-orders'], summary: 'Crear orden de producción' },
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const updated = await ProductionOrdersService.update(Number(params.id), body)
      return { data: updated }
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Object({
        status: t.Optional(t.Union([
          t.Literal('pending'),
          t.Literal('approved'),
          t.Literal('in_production'),
          t.Literal('completed'),
          t.Literal('cancelled'),
        ])),
        notes: t.Optional(t.String()),
        estimatedCompletionDate: t.Optional(t.String()),
      }),
      detail: { tags: ['production-orders'], summary: 'Actualizar orden de producción' },
    }
  )

