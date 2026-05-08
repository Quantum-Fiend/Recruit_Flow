'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowRight, User, Lock, Command } from "lucide-react"
import { motion } from "framer-motion"

export default function CandidateLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please verify your telemetry.");
      } else {
        toast.success("Identity Verified. Initializing session.");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("System Error during authentication.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px]"
      >
        <div className="text-center mb-16 space-y-4">
           <Link href="/" className="inline-flex items-center gap-3 group mb-8">
              <div className="w-12 h-12 bg-foreground rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                 <Command className="w-6 h-6 text-background" />
              </div>
           </Link>
           <h1 className="h-lg text-gradient leading-tight">Candidate <br />Access.</h1>
           <p className="text-lg text-muted-foreground font-medium opacity-60">Enter the global talent operating system.</p>
        </div>

        <div className="premium-card glass-panel p-10 md:p-12 space-y-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Network Identifier</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@nexus.com"
                    required
                    className="h-14 pl-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-0 rounded-xl font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Access Key</Label>
                  <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">Recover</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-14 pl-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-0 rounded-xl font-bold transition-all"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-quantum h-16 rounded-xl"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Verify Identity <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-8 border-t border-border/50 text-center">
             <p className="text-sm font-medium text-muted-foreground">
                New candidate? <Link href="/signup/candidate" className="text-primary font-black hover:underline underline-offset-4">Initialize Account</Link>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
