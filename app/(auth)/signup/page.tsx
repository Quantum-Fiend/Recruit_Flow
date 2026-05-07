'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowRight, User, Mail, Lock, UserCheck, Briefcase, Command, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<"APPLICANT" | "RECRUITER">("APPLICANT")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (response.ok) {
        toast.success("Account initialized successfully.")
        router.push("/login")
      } else {
        const error = await response.text()
        toast.error(error || "Initialization failed.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 w-full animate-slide-up">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <Card className="glass p-4 border-none shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-foreground/5 rounded-full blur-[100px] -z-10" />
          
          <CardHeader className="p-12 text-center space-y-8">
            <div className="w-20 h-20 bg-foreground text-background rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-foreground/10 group">
              <Command className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-5xl font-black tracking-tighter">Initialize Account</CardTitle>
              <CardDescription className="text-muted-foreground font-medium text-xl leading-relaxed">Choose your operational role in the ecosystem.</CardDescription>
            </div>

            {/* Premium Role Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("APPLICANT")}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group ${
                  role === "APPLICANT" 
                  ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10" 
                  : "bg-foreground/5 border-transparent text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  role === "APPLICANT" ? "bg-background text-foreground" : "bg-foreground/10"
                }`}>
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="font-black uppercase tracking-widest text-[10px]">Talent</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole("RECRUITER")}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group ${
                  role === "RECRUITER" 
                  ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10" 
                  : "bg-foreground/5 border-transparent text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  role === "RECRUITER" ? "bg-background text-foreground" : "bg-foreground/10"
                }`}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="font-black uppercase tracking-widest text-[10px]">Recruiter</span>
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="p-12 pt-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="name" name="name" placeholder="John Doe" required className="h-14 pl-12 rounded-xl bg-foreground/5 border-none font-bold text-lg" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Communication Channel</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-14 pl-12 rounded-xl bg-foreground/5 border-none font-bold text-lg" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Key</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" name="password" type="password" required className="h-14 pl-12 rounded-xl bg-foreground/5 border-none font-bold text-lg" />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-20 rounded-[2rem] bg-foreground text-background font-black text-2xl shadow-2xl shadow-foreground/10 hover:opacity-90 group transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <span className="flex items-center gap-4">
                    Deploy Profile
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="p-12 border-t border-foreground/5 justify-center bg-foreground/[0.01]">
            <p className="text-sm font-medium text-muted-foreground">
              Already integrated?{" "}
              <Link href="/login" className="text-foreground font-black hover:underline underline-offset-4">
                Access System
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Legal Disclaimer */}
        <div className="mt-12 flex flex-col items-center gap-4 text-center opacity-30 px-10">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Identity Protection Active</span>
           </div>
           <p className="text-[10px] font-medium leading-relaxed">By initializing an account, you agree to our Enterprise Terms of Service and Global Privacy Protocol.</p>
        </div>
      </motion.div>
    </div>
  )
}
