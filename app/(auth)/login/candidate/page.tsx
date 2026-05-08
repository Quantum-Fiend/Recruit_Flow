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
        toast.error("Invalid credentials.");
      } else {
        toast.success("Identity Verified.");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("System Error.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px]"
      >
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 sapphire-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="h-lg text-sapphire tracking-tighter">
            Candidate <br />Access.
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Enter the global engineering network.
          </p>
        </div>

        <Card className="glass-morphism rounded-[2.5rem] p-1 border-none shadow-2xl relative overflow-hidden">
          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Network Identifier</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-14 rounded-xl bg-foreground/5 border-none font-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Key</Label>
                <Input id="password" name="password" type="password" required className="h-14 rounded-xl bg-foreground/5 border-none font-bold" />
              </div>

              <Button type="submit" className="w-full h-16 rounded-xl sapphire-gradient text-white font-black text-lg shadow-xl shadow-primary/20 hover:opacity-95 transition-all" disabled={loading}>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify Identity"}
              </Button>
            </form>

            <div className="pt-6 border-t border-foreground/5 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                New candidate? <Link href="/signup/candidate" className="text-primary font-black hover:underline">Initialize Account</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
