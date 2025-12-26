import { Elysia, t } from 'elysia'
import { InternalItemsService } from './service.js'

export const internalItemsRouter = new Elysia({ prefix: '/internal-items' })
  .get(
    '/',
    async ({ query }) => {
      const filters: any = {}
      if ((query as any)?.q) filters.search = (query as any).q
      if ((query as any)?.status) filters.status = (query as any).status
      if ((query as any)?.offset) filters.offset = Number((query as any).offset)
      if ((query as any)?.limit) filters.limit = Number((query as any).limit)
      const result = await InternalItemsService.list(Object.keys(filters).length ? filters : undefined)
      return { data: result.internalItems, total: result.total, offset: result.offset, limit: filters.limit || null }
    },
    {
      query: t.Object({
        q: t.Optional(t.String()),
        status: t.Optional(t.Union([t.Literal('active'), t.Literal('inactive'), t.Literal('archived')])),
        offset: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: { tags: ['internal-items'], summary: 'Listar catálogo interno' },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const item = await InternalItemsService.getById(Number(params.id))
      return { data: item }
    },
    { params: t.Object({ id: t.Numeric() }), detail: { tags: ['internal-items'], summary: 'Obtener item interno' } }
  )
  .post(
    '/',
    async ({ body }) => {
      const created = await InternalItemsService.create(body)
      return { data: created }
    },
    {
      body: t.Object({
        sku: t.String(),
        name: t.String(),
        description: t.Optional(t.String()),
        status: t.Optional(t.Union([t.Literal('active'), t.Literal('inactive'), t.Literal('archived')])),
      }),
      detail: { tags: ['internal-items'], summary: 'Crear item interno' },
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const updated = await InternalItemsService.update(Number(params.id), body)
      return { data: updated }
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Object({
        sku: t.Optional(t.String()),
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        status: t.Optional(t.Union([t.Literal('active'), t.Literal('inactive'), t.Literal('archived')])),
      }),
      detail: { tags: ['internal-items'], summary: 'Actualizar item interno' },
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const deleted = await InternalItemsService.remove(Number(params.id))
      return { message: 'Eliminado', data: deleted }
    },
    { params: t.Object({ id: t.Numeric() }), detail: { tags: ['internal-items'], summary: 'Eliminar item interno' } }
  )

