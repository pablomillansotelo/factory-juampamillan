import { Elysia, t } from 'elysia'
import { ItemAttributesService } from './service.js'

export const attributesRouter = new Elysia({ prefix: '/attributes' })
  .get(
    '/:internalItemId',
    async ({ params }) => {
      const list = await ItemAttributesService.listByItem(Number(params.internalItemId))
      return { data: list }
    },
    { params: t.Object({ internalItemId: t.Numeric() }), detail: { tags: ['attributes'], summary: 'Atributos por item' } }
  )
  .post(
    '/',
    async ({ body }) => {
      const created = await ItemAttributesService.create(body)
      return { data: created }
    },
    {
      body: t.Object({
        internalItemId: t.Numeric(),
        key: t.String(),
        value: t.String(),
      }),
      detail: { tags: ['attributes'], summary: 'Crear atributo' },
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const updated = await ItemAttributesService.update(Number(params.id), body)
      return { data: updated }
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Object({
        key: t.Optional(t.String()),
        value: t.Optional(t.String()),
      }),
      detail: { tags: ['attributes'], summary: 'Actualizar atributo' },
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const deleted = await ItemAttributesService.remove(Number(params.id))
      return { message: 'Eliminado', data: deleted }
    },
    { params: t.Object({ id: t.Numeric() }), detail: { tags: ['attributes'], summary: 'Eliminar atributo' } }
  )

