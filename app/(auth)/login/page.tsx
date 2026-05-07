'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowRight, Lock, Mail, Command, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
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
      })

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.")
      } else {
        toast.success("Identity verified. Welcome back.")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full animate-slide-up">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="glass p-4 border-none shadow-2xl relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-foreground/5 rounded-full blur-[80px] -z-10" />
          
          <CardHeader className="p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-foreground text-background rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-foreground/10 rotate-3">
              <Command className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-black tracking-tighter">Access System</CardTitle>
              <CardDescription className="text-muted-foreground font-medium text-lg italic">Authenticate to continue to the console.</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-10 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="h-14 pl-12 rounded-xl bg-foreground/5 border-none font-bold text-lg focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Master Key</Label>
                  <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Lost Access?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="h-14 pl-12 rounded-xl bg-foreground/5 border-none font-bold text-lg focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl bg-foreground text-background font-black text-xl shadow-xl shadow-foreground/10 hover:opacity-90 group transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center gap-3">
                    Initialize Authentication
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="p-10 border-t border-foreground/5 justify-center bg-foreground/[0.02]">
            <p className="text-sm font-medium text-muted-foreground">
              New to the ecosystem?{" "}
              <Link href="/signup" className="text-foreground font-black hover:underline underline-offset-4">
                Initialize Account
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Security Badge */}
        <div className="mt-12 flex items-center justify-center gap-3 text-muted-foreground/30 font-black uppercase tracking-widest text-[10px]">
           <Sparkles className="w-4 h-4" />
           <span>End-to-End Encrypted Session</span>
        </div>
      </motion.div>
    </div>
  )
}
