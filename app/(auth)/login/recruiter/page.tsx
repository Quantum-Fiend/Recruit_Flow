'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ArrowRight, Briefcase, Lock, AlertCircle, UserX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { checkUserExistsAction } from "@/app/actions/auth"

export default function RecruiterLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ type: 'not_found' | 'wrong_password' | 'generic'; message: string } | null>(null)
  const callbackUrl = searchParams.get("callbackUrl") || "/recruiter/dashboard"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Step 1: Check if the account exists
      const { exists } = await checkUserExistsAction(email)

      if (!exists) {
        setError({
          type: 'not_found',
          message: "No recruiter account found with this email. Please sign up to get started.",
        })
        setLoading(false)
        return
      }

      // Step 2: Attempt sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError({
          type: 'wrong_password',
          message: "Incorrect password. Please check your credentials and try again.",
        })
      } else {
        toast.success("Welcome back! Redirecting to your console.")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError({
        type: 'generic',
        message: "Something went wrong. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full px-6 pt-40 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px]"
      >
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="h-lg text-gradient leading-tight mb-3">Recruiter Login.</h1>
          <p className="text-base text-muted-foreground font-medium opacity-60">
            Access your hiring console and manage candidates.
          </p>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-2xl border flex gap-3 items-start ${
                error.type === 'not_found'
                  ? 'bg-amber-500/5 border-amber-500/20 text-amber-500'
                  : 'bg-destructive/5 border-destructive/20 text-destructive'
              }`}
            >
              {error.type === 'not_found' ? (
                <UserX className="w-5 h-5 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              )}
              <div className="space-y-1">
                <p className="text-sm font-bold">
                  {error.type === 'not_found' ? 'Account Not Found' : 'Authentication Failed'}
                </p>
                <p className="text-sm font-medium opacity-80">{error.message}</p>
                {error.type === 'not_found' && (
                  <Link href="/signup/recruiter" className="text-sm font-black underline underline-offset-2 hover:opacity-80 transition-opacity">
                    Create a recruiter account →
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                Corporate Email
              </Label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
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
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                  Forgot Password?
                </Link>
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
                  Login <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              New recruiter?{" "}
              <Link href="/signup/recruiter" className="text-primary font-black hover:underline underline-offset-4">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
