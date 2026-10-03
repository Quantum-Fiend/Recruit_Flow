'use client'

import { useState, useEffect, Suspense } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callbackUrl = searchParams.get("callbackUrl")
  const { status, data: session } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      const defaultPath = session?.user?.role === "RECRUITER" || session?.user?.role === "ADMIN"
        ? "/recruiter/dashboard"
        : "/dashboard"
      const safeCallback = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
        ? callbackUrl
        : null
      router.push(safeCallback ?? defaultPath)
    }
  }, [status, router, callbackUrl, session?.user?.role])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email or password is incorrect. Please check your credentials.")
      } else {
        toast.success("Welcome back!")
        const defaultPath = session?.user?.role === "RECRUITER" || session?.user?.role === "ADMIN"
          ? "/recruiter/dashboard"
          : "/dashboard"
        const safeCallback = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : null
        router.push(safeCallback ?? defaultPath)
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] w-full px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px]"
      >
        <div className="text-center mb-10">
          <h1 className="h-lg text-gradient leading-tight mb-3">Welcome back</h1>
          <p className="text-base text-muted-foreground font-medium opacity-60">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl border flex gap-3 items-start bg-destructive/5 border-destructive/20 text-destructive"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold">Authentication Failed</p>
                <p className="text-sm font-medium opacity-80">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-panel rounded-3xl p-8 md:p-10 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  onChange={() => setError(null)}
                  className="h-13 pl-12 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  Password
                </Label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  onChange={() => setError(null)}
                  className="h-13 pl-12 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl font-medium transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-quantum h-13 rounded-xl mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-black hover:underline underline-offset-4">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
