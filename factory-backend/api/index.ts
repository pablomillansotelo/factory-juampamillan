import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { neon } from '@neondatabase/serverless'
import { v1Routes } from './v1.js'
import { ApiKeysService } from '../src/api-keys/service.js'
import { checkRateLimit, getRateLimitHeaders } from '../src/middleware/rate-limit.js'
import { getCorsHeaders, getSecurityHeaders } from '../src/middleware/cors.js'

const neonClient = neon(process.env.DATABASE_URL!)
const API_KEY = process.env.API_KEY || ''

const app = new Elysia()
  .onBeforeHandle(async ({ request, path, set }) => {
    const origin = request.headers.get('origin')
    const corsHeaders = getCorsHeaders(origin)
    Object.entries(corsHeaders).forEach(([k, v]) => {
      set.headers[k] = v
    })

    const isSwaggerPath = path.startsWith('/swagger') || path === '/swagger'
    const securityHeaders = getSecurityHeaders(isSwaggerPath)
    Object.entries(securityHeaders).forEach(([k, v]) => {
      set.headers[k] = v
    })

    if (request.method === 'OPTIONS') {
      set.status = 204
      return ''
    }

    const publicPaths = ['/', '/swagger', '/db', '/health']
    const isPublic = publicPaths.includes(path) || path.startsWith('/swagger') || path.startsWith('/api-keys')

    if (!isPublic) {
      const apiKeyHeader = request.headers.get('x-api-key')
      if (!apiKeyHeader) {
        set.status = 401
        return { error: 'No autorizado', message: 'API Key faltante. Header: X-API-Key' }
      }
      const validation = await ApiKeysService.validateApiKey(apiKeyHeader)
      if (validation.valid && validation.apiKey) {
        const rateLimit = validation.apiKey.rateLimit || 100
        const check = checkRateLimit(String(validation.apiKey.id), rateLimit)
        const rlHeaders = getRateLimitHeaders(String(validation.apiKey.id), rateLimit)
        Object.entries(rlHeaders).forEach(([k, v]) => {
          set.headers[k] = v
        })
        if (!check.allowed) {
          set.status = 429
          return {
            error: 'Rate limit excedido',
            message: `Límite de ${rateLimit} req/min alcanzado`,
            retryAfter: Math.ceil((check.resetAt - Date.now()) / 1000),
          }
        }
      } else if (apiKeyHeader === API_KEY && API_KEY) {
        // legacy
      } else {
        set.status = 401
        return { error: 'No autorizado', message: validation.error || 'API Key inválida' }
      }
    }
  })

app
  .get('/', () => ({
    message: 'Factory Backend API',
    version: '1.0.0',
    endpoints: { v1: '/v1', docs: '/swagger' },
    note: 'Catálogo interno y atributos de manufactura',
  }))
  .get('/health', () => ({ status: 'ok' }))
  .get('/db', async () => {
    const result = await neonClient`SELECT NOW()`
    return { message: 'Conectado a Neon vía HTTP con Elysia.js', fecha: result![0]!.now }
  })
  .use(v1Routes)
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Factory Backend API',
          description: 'API para catálogo interno y atributos de manufactura',
          version: '1.0.0',
        },
        tags: [
          { name: 'api-keys', description: 'Gestión de API keys' },
          { name: 'internal-items', description: 'Catálogo interno' },
          { name: 'attributes', description: 'Atributos de manufactura' },
        ],
        servers: [{ url: 'http://localhost:8000', description: 'Servidor de desarrollo' }],
      },
    })
  )
  .compile()

export default app

