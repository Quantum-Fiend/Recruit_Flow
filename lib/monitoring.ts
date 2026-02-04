// Centralized Logging and Monitoring

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  userId?: string
  action?: string
  resource?: string
  error?: string
  stack?: string
  metadata?: Record<string, unknown>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? JSON.stringify(context) : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`
  }

  info(message: string, context?: LogContext) {
    const formatted = this.formatMessage('info', message, context)
    console.log(formatted)
    // In production, send to logging service (e.g., Sentry, LogRocket, Datadog)
  }

  warn(message: string, context?: LogContext) {
    const formatted = this.formatMessage('warn', message, context)
    console.warn(formatted)
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    const formatted = this.formatMessage('error', message, {
      ...context,
      error: errorObj.message,
      stack: this.isDevelopment ? errorObj.stack : undefined,
    })
    console.error(formatted)
    // In production, send to error tracking service (e.g., Sentry)
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('debug', message, context)
      console.debug(formatted)
    }
  }

  // Application-specific logging methods
  logApplicationEvent(event: string, applicationId: string, userId: string, metadata?: Record<string, unknown>) {
    this.info(`Application Event: ${event}`, {
      action: event,
      resource: 'application',
      userId,
      metadata: { applicationId, ...metadata },
    })
  }

  logJobEvent(event: string, jobId: string, userId: string, metadata?: Record<string, unknown>) {
    this.info(`Job Event: ${event}`, {
      action: event,
      resource: 'job',
      userId,
      metadata: { jobId, ...metadata },
    })
  }

  logAuthEvent(event: string, userId?: string, metadata?: Record<string, unknown>) {
    this.info(`Auth Event: ${event}`, {
      action: event,
      resource: 'auth',
      userId,
      metadata,
    })
  }

  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high', metadata?: Record<string, unknown>) {
    this.warn(`Security Event: ${event}`, {
      action: event,
      resource: 'security',
      metadata: { severity, ...metadata },
    })
  }
}

// Singleton instance
export const logger = new Logger()

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  startTimer(label: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.recordMetric(label, duration)
      
      if (duration > 1000) {
        logger.warn(`Slow operation detected: ${label}`, {
          metadata: { duration: `${duration.toFixed(2)}ms` },
        })
      }
    }
  }

  private recordMetric(label: string, value: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    this.metrics.get(label)!.push(value)
  }

  getMetrics(label: string) {
    const values = this.metrics.get(label) || []
    if (values.length === 0) return null

    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Usage analytics
export class Analytics {
  track(event: string, properties?: Record<string, unknown>) {
    logger.info(`Analytics: ${event}`, { metadata: properties })
    // In production, send to analytics service (e.g., PostHog, Mixpanel, Amplitude)
  }

  trackPageView(path: string, userId?: string) {
    this.track('page_view', { path, userId })
  }

  trackApplicationSubmitted(jobId: string, applicantId: string) {
    this.track('application_submitted', { jobId, applicantId })
  }

  trackJobPosted(jobId: string, recruiterId: string) {
    this.track('job_posted', { jobId, recruiterId })
  }

  trackStatusUpdate(applicationId: string, oldStatus: string, newStatus: string, recruiterId: string) {
    this.track('status_updated', { applicationId, oldStatus, newStatus, recruiterId })
  }
}

export const analytics = new Analytics()
