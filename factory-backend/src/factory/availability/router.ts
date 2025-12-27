import { Elysia, t } from 'elysia'
import { AvailabilityService } from './service.js'

export const availabilityRouter = new Elysia({ prefix: '/availability' })
  .get(
    '/',
    async ({ query }) => {
      const filters: any = {}
      if ((query as any)?.internalItemId) filters.internalItemId = Number((query as any).internalItemId)
      if ((query as any)?.status) filters.status = (query as any).status
      if ((query as any)?.offset) filters.offset = Number((query as any).offset)
      if ((query as any)?.limit) filters.limit = Number((query as any).limit)
      const result = await AvailabilityService.list(Object.keys(filters).length ? filters : undefined)
      return { data: result.availability, total: result.total, offset: result.offset, limit: filters.limit || null }
    },
    {
      query: t.Object({
        internalItemId: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal('planned'),
            t.Literal('in_production'),
            t.Literal('paused'),
            t.Literal('blocked'),
            t.Literal('done'),
          ])
        ),
        offset: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: { tags: ['availability'], summary: 'Listar disponibilidad por item' },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const availability = await AvailabilityService.getById(Number(params.id))
      return { data: availability }
    },
    { params: t.Object({ id: t.Numeric() }), detail: { tags: ['availability'], summary: 'Obtener disponibilidad' } }
  )
  .post(
    '/',
    async ({ body }) => {
      const created = await AvailabilityService.create(body)
      return { data: created }
    },
    {
      body: t.Object({
        internalItemId: t.Numeric(),
        status: t.Optional(
          t.Union([
            t.Literal('planned'),
            t.Literal('in_production'),
            t.Literal('paused'),
            t.Literal('blocked'),
            t.Literal('done'),
          ])
        ),
        note: t.Optional(t.String()),
      }),
      detail: { tags: ['availability'], summary: 'Crear disponibilidad' },
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const updated = await AvailabilityService.update(Number(params.id), body)
      return { data: updated }
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Object({
        internalItemId: t.Optional(t.Numeric()),
        status: t.Optional(
          t.Union([
            t.Literal('planned'),
            t.Literal('in_production'),
            t.Literal('paused'),
            t.Literal('blocked'),
            t.Literal('done'),
          ])
        ),
        note: t.Optional(t.String()),
      }),
      detail: { tags: ['availability'], summary: 'Actualizar disponibilidad' },
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const deleted = await AvailabilityService.remove(Number(params.id))
      return { message: 'Eliminado', data: deleted }
    },
    { params: t.Object({ id: t.Numeric() }), detail: { tags: ['availability'], summary: 'Eliminar disponibilidad' } }
  )


