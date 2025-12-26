export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean)
  const isAllowed = origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))

  const finalOrigin = isAllowed ? origin! : allowedOrigins[0] || '*'

  return {
    'Access-Control-Allow-Origin': finalOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    'Access-Control-Allow-Credentials': 'true',
  }
}

export function getSecurityHeaders(isSwagger = false): Record<string, string> {
  return {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    ...(isSwagger ? { 'X-Robots-Tag': 'noindex' } : {}),
  }
}

