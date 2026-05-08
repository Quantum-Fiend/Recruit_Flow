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

export default function SignupChoicePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px] text-center space-y-16"
      >
        <div className="space-y-6">
          <h1 className="h-xl text-sapphire tracking-tighter">
            Select Your <br />Deployment Path.
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
            Choose your interface to begin the high-performance talent sequence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidate Path */}
          <Link href="/signup/candidate" className="group">
            <Card className="glass-morphism rounded-[3rem] p-12 border-none shadow-2xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden h-full flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
              <div className="w-20 h-20 sapphire-gradient rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Candidate</h3>
              <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                Join the global engineering network and apply to world-class positions.
              </p>
              <div className="mt-auto flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                Initialize Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Recruiter Path */}
          <Link href="/signup/recruiter" className="group">
            <Card className="glass-morphism rounded-[3rem] p-12 border-none shadow-2xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden h-full flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
              <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl group-hover:-rotate-6 transition-transform">
                <Briefcase className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Recruiter</h3>
              <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                Deploy hiring infrastructure and acquire elite technical talent.
              </p>
              <div className="mt-auto flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                Setup Console <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>

        <p className="text-sm font-medium text-muted-foreground pt-10">
          Already have an account? <Link href="/login" className="text-primary font-black hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
