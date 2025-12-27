import { Elysia, t } from 'elysia'
import { ItemBomsService } from './service.js'

export const bomRouter = new Elysia({ prefix: '/bom' })
  .get(
    '/',
    async ({ query }) => {
      const filters: any = {}
      if ((query as any)?.internalItemId) filters.internalItemId = Number((query as any).internalItemId)
      const list = await ItemBomsService.list(Object.keys(filters).length ? filters : undefined)
      return { data: list, total: list.length, offset: null, limit: null }
    },
    {
      query: t.Object({
        internalItemId: t.Optional(t.String()),
      }),
      detail: { tags: ['bom'], summary: 'Listar BOM por item' },
    }
  )
  .post(
    '/',
    async ({ body }) => {
      const created = await ItemBomsService.create(body)
      return { data: created }
    },
    {
      body: t.Object({
        internalItemId: t.Numeric(),
        component: t.String(),
        quantity: t.Optional(t.Union([t.String(), t.Number()])),
        unit: t.Optional(t.String()),
      }),
      detail: { tags: ['bom'], summary: 'Crear entrada de BOM' },
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const updated = await ItemBomsService.update(Number(params.id), body)
      return { data: updated }
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Object({
        internalItemId: t.Optional(t.Numeric()),
        component: t.Optional(t.String()),
        quantity: t.Optional(t.Union([t.String(), t.Number()])),
        unit: t.Optional(t.String()),
      }),
      detail: { tags: ['bom'], summary: 'Actualizar entrada de BOM' },
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const deleted = await ItemBomsService.remove(Number(params.id))
      return { message: 'Eliminado', data: deleted }
    },
    { params: t.Object({ id: t.Numeric() }), detail: { tags: ['bom'], summary: 'Eliminar entrada de BOM' } }
  )


