'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowRight, User, Mail, Lock, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { signUpAction } from "@/app/actions/auth"

export default function CandidateSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
        role: "APPLICANT",
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Candidate Profile Initialized.");
        router.push("/dashboard");
        router.refresh();
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
        className="w-full max-w-[500px]"
      >
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 sapphire-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="h-lg text-sapphire tracking-tighter">
            Candidate <br />Registration.
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Join the global engineering network.
          </p>
        </div>

        <Card className="glass-morphism rounded-[2.5rem] p-1 border-none shadow-2xl relative overflow-hidden">
          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity</Label>
                <Input id="name" name="name" placeholder="John Doe" required className="h-14 rounded-xl bg-foreground/5 border-none font-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Network Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-14 rounded-xl bg-foreground/5 border-none font-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Key</Label>
                <Input id="password" name="password" type="password" required minLength={8} className="h-14 rounded-xl bg-foreground/5 border-none font-bold" />
              </div>

              <Button type="submit" className="w-full h-16 rounded-xl sapphire-gradient text-white font-black text-lg shadow-xl shadow-primary/20 hover:opacity-95 transition-all" disabled={loading}>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Deploy Candidate Profile"}
              </Button>
            </form>

            <div className="pt-6 border-t border-foreground/5 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Recruiter? <Link href="/signup/recruiter" className="text-primary font-black hover:underline">Switch to Console</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
