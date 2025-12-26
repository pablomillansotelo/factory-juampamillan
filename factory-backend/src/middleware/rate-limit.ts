const WINDOW_MS = 60 * 1000
const buckets: Record<string, { count: number; resetAt: number }> = {}

export function checkRateLimit(key: string, limit: number) {
  const now = Date.now()
  const bucket = buckets[key] || { count: 0, resetAt: now + WINDOW_MS }

  if (now > bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + WINDOW_MS
  }

  bucket.count += 1
  buckets[key] = bucket

  return { allowed: bucket.count <= limit, resetAt: bucket.resetAt }
}

export function getRateLimitHeaders(key: string, limit: number) {
  const bucket = buckets[key] || { count: 0, resetAt: Date.now() + WINDOW_MS }
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, limit - bucket.count)),
    'X-RateLimit-Reset': String(Math.ceil(bucket.resetAt / 1000)),
  }
}

