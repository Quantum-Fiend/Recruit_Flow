'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"
import {
  Loader2,
  ArrowRight,
  Lock,
  Mail,
  Command,
  ShieldCheck,
} from "lucide-react";
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
      });

      if (result?.error) {
        toast.error("Authentication Failed: Invalid credentials.");
      } else {
        toast.success("Identity Verified. Access Granted.");
        router.push(callbackUrl);
        router.refresh();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("System Error: Unable to process request.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[500px]"
      >
        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-2xl shadow-primary/10 group"
          >
            <Command className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform duration-500" />
          </motion.div>
          <h1 className="h-lg text-sapphire tracking-tighter">
            System Access.
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Verify your professional credentials to enter the console.
          </p>
        </div>

        <Card className="glass-morphism rounded-[3rem] p-2 border-none shadow-2xl shadow-primary/5 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-1000" />

          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Network Identifier
                  </Label>
                </div>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@organization.com"
                    required
                    className="h-16 pl-16 rounded-2xl bg-foreground/5 border-none font-bold text-lg focus-visible:ring-1 focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Access Key
                  </Label>
                  <Link
                    href="#"
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    Recover
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="h-16 pl-16 rounded-2xl bg-foreground/5 border-none font-bold text-lg focus-visible:ring-1 focus-visible:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-18 rounded-2xl sapphire-gradient text-white font-black text-xl shadow-2xl shadow-primary/20 hover:opacity-95 group transition-all h-16"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center gap-3">
                    Verify Identity
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-foreground/5 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                New to RecruitFlow?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-black hover:underline underline-offset-4 ml-1"
                >
                  Initialize Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3 text-muted-foreground/40 font-black uppercase tracking-widest text-[10px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Protocol 2.0 Active</span>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
