'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, User, Briefcase, Lock, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { signUpAction } from "@/app/actions/auth"

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
      const result = await signUpAction({
        name,
        email,
        password,
        role,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(role === "APPLICANT" ? "Candidate Profile Initialized." : "Recruiter Console Initialized.");
        router.push(role === "APPLICANT" ? "/dashboard" : "/recruiter/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("System Error: Unable to process registration.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full px-6 pt-40 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[500px]"
      >
        <div className="text-center mb-12 space-y-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-all ${role === 'APPLICANT' ? 'sapphire-gradient text-white shadow-primary/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
            {role === 'APPLICANT' ? <User className="w-8 h-8" /> : <Briefcase className="w-8 h-8" />}
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            {role === 'APPLICANT' ? "Candidate Registration" : "Recruiter Registration"}
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            {role === 'APPLICANT' ? "Join the global engineering network." : "Deploy hiring infrastructure."}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 mb-8 bg-foreground/5 rounded-2xl">
          <button
            onClick={() => setRole("APPLICANT")}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              role === "APPLICANT" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Candidate
          </button>
          <button
            onClick={() => setRole("RECRUITER")}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              role === "RECRUITER" ? "bg-background shadow-md text-emerald-500" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recruiter
          </button>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-1 border-none shadow-2xl relative overflow-hidden">
          <div className="p-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                  <Input id="name" name="name" placeholder={role === "APPLICANT" ? "John Doe" : "Jane Smith"} required className="h-14 pl-12 rounded-xl bg-foreground/5 border-none font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{role === 'APPLICANT' ? "Network Email" : "Corporate Email"}</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                  <Input id="email" name="email" type="email" placeholder={role === "APPLICANT" ? "john@example.com" : "jane@company.com"} required className="h-14 pl-12 rounded-xl bg-foreground/5 border-none font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Key</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                  <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} className="h-14 pl-12 rounded-xl bg-foreground/5 border-none font-bold" />
                </div>
              </div>

              <Button type="submit" className={`w-full h-16 rounded-xl font-black text-lg shadow-xl hover:opacity-95 transition-all text-white ${role === 'APPLICANT' ? 'sapphire-gradient shadow-primary/20' : 'bg-emerald-500 shadow-emerald-500/20'}`} disabled={loading}>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (role === "APPLICANT" ? "Deploy Candidate Profile" : "Initialize Recruiter Console")}
              </Button>
            </form>

            <div className="pt-6 border-t border-foreground/5 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Already have an account? <Link href="/login" className="text-primary font-black hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
