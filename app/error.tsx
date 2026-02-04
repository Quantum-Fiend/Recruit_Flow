'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/monitoring'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Global layout error caught', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We've encountered an unexpected error. Our team has been notified and we're working to fix it.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Try again
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href="/">Go to Home</a>
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-8 p-4 bg-muted rounded-lg text-left overflow-auto max-w-full text-xs font-mono">
          {error.stack}
        </pre>
      )}
    </div>
  )
}
