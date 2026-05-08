'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/monitoring'
import { AlertTriangle, RotateCcw, Home, Terminal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Global system error caught', error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="premium-card p-12 text-center bg-card/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/5 rounded-full blur-[100px] -z-10" />
          
          <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto text-destructive mb-10 shadow-2xl shadow-destructive/10">
            <AlertTriangle className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter mb-4">Sequence Interrupted.</h1>
          <p className="text-lg text-muted-foreground font-medium mb-10 max-w-md mx-auto text-balance">
            The system encountered an unexpected exception in the telemetry pipeline. Our core protocols have been notified.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
               onClick={() => reset()} 
               className="h-14 px-8 rounded-xl font-black text-xs uppercase tracking-widest sapphire-gradient text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Re-initialize Session
            </Button>
            <Link href="/">
               <Button variant="outline" className="h-14 px-8 rounded-xl font-black text-xs uppercase tracking-widest border-border hover:bg-secondary transition-all gap-2">
                 <Home className="w-4 h-4" />
                 Return to Base
               </Button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 text-left">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">
                  <Terminal className="w-3 h-3" />
                  <span>Debug Console</span>
               </div>
               <pre className="p-6 bg-secondary/50 rounded-xl border border-border text-xs font-mono overflow-auto max-h-[200px] text-muted-foreground">
                 {error.stack}
               </pre>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
