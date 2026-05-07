'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowRight, User, Mail, Lock, Briefcase, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { signUpAction } from "@/app/actions/auth"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    try {
      const result = await signUpAction({ name, email, password, role: role as "APPLICANT" | "RECRUITER" })
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Account initialized. Welcome to RecruitFlow.")
        router.push(role === "RECRUITER" ? "/recruiter/dashboard" : "/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast.error("System Error: Unable to process registration.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[600px]"
      >
        <div className="text-center mb-12 space-y-4">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-2xl shadow-primary/10"
           >
              <User className="w-10 h-10 text-primary" />
           </motion.div>
           <h1 className="h-lg text-sapphire tracking-tighter">Initialize Account.</h1>
           <p className="text-lg text-muted-foreground font-medium">Create your unique identifier within the RecruitFlow network.</p>
        </div>

        <Card className="glass-morphism rounded-[3rem] p-2 border-none shadow-2xl shadow-primary/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
          
          <CardContent className="p-12 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    <Input id="name" name="name" placeholder="John Doe" required className="h-16 pl-16 rounded-2xl bg-foreground/5 border-none font-bold text-lg focus-visible:ring-1 focus-visible:ring-primary/30" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    <Input id="email" name="email" type="email" placeholder="name@company.com" required className="h-16 pl-16 rounded-2xl bg-foreground/5 border-none font-bold text-lg focus-visible:ring-1 focus-visible:ring-primary/30" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                  <Input id="password" name="password" type="password" required minLength={8} className="h-16 pl-16 rounded-2xl bg-foreground/5 border-none font-bold text-lg focus-visible:ring-1 focus-visible:ring-primary/30" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Professional Capacity</Label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative cursor-pointer group">
                    <input type="radio" name="role" value="APPLICANT" className="peer sr-only" defaultChecked />
                    <div className="p-6 rounded-2xl bg-foreground/5 border-2 border-transparent peer-checked:border-primary/50 peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-3">
                       <User className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                       <span className="text-sm font-black uppercase tracking-widest">Candidate</span>
                    </div>
                  </label>
                  <label className="relative cursor-pointer group">
                    <input type="radio" name="role" value="RECRUITER" className="peer sr-only" />
                    <div className="p-6 rounded-2xl bg-foreground/5 border-2 border-transparent peer-checked:border-primary/50 peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-3">
                       <Briefcase className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                       <span className="text-sm font-black uppercase tracking-widest">Recruiter</span>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 rounded-2xl sapphire-gradient text-white font-black text-xl shadow-2xl shadow-primary/20 hover:opacity-95 group transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <span className="flex items-center gap-3">
                    Initialize Deployment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="pt-8 border-t border-foreground/5 text-center">
               <p className="text-sm font-medium text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary font-black hover:underline underline-offset-4 ml-1">
                    Sign In
                  </Link>
               </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 flex items-center justify-center gap-3 text-muted-foreground/40 font-black uppercase tracking-widest text-[10px]">
           <ShieldCheck className="w-4 h-4" />
           <span>Secure Ecosystem Protocol Active</span>
        </div>
      </motion.div>
    </div>
  )
}
