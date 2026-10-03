import { RateLimiterMemory } from 'rate-limiter-flexible'

// In-memory rate limiter for general API calls (e.g., by IP)
const apiLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 1, // per 1 second
})

// In-memory rate limiter for auth actions (e.g., by email)
const authLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60, // per 60 seconds
})

const uploadLimiter = new RateLimiterMemory({
  points: 20,
  duration: 60 * 60,
})

const aiLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60 * 60,
})

export async function checkAiRateLimit(key: string) {
  try {
    await aiLimiter.consume(key)
    return { success: true as const }
  } catch (rejection) {
    const waitMs = (rejection as { msBeforeNext?: number })?.msBeforeNext ?? 60_000
    return {
      success: false as const,
      error: `AI request limit reached. Try again in about ${Math.max(1, Math.ceil(waitMs / 60_000))} minute(s).`,
    }
  }
}

export async function checkRateLimit(
  key: string,
  type: 'api' | 'auth' | 'upload' = 'auth',
) {
  const limiter = type === 'api'
    ? apiLimiter
    : type === 'upload'
      ? uploadLimiter
      : authLimiter
  try {
    await limiter.consume(key)
    return { success: true }
  } catch (rejRes) {
    const msBeforeNext = (rejRes as { msBeforeNext?: number })?.msBeforeNext || 1000
    return { 
      success: false, 
      error: `Too many requests. Please try again in ${Math.round(msBeforeNext / 1000)}s.`,
      msBeforeNext
    }
  }
}

// Shorthand for API routes that need a NextResponse-compatible check
export async function rateLimit(ip: string) {
  return checkRateLimit(ip, 'api')
}
