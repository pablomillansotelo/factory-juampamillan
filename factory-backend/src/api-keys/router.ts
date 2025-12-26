import { Elysia, t } from 'elysia'
import { ApiKeysService } from './service.js'

export const apiKeysRouter = new Elysia({ prefix: '/api-keys' })
  .get(
    '/',
    async () => ({ message: 'Gestión de API Keys (solo admin)', hint: 'Usa DB para crear/rotar claves' }),
    { detail: { tags: ['api-keys'], summary: 'Info API Keys' } }
  )
  .post(
    '/',
    async () => ({ error: 'No permitido', message: 'Crear API Keys solo vía base de datos/ops' }),
    { detail: { tags: ['api-keys'], summary: 'No permitido en runtime' } }
  )

