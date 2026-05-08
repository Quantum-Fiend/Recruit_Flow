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
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl text-center space-y-24"
      >
        <div className="space-y-8">
          <h1 className="h-lg text-gradient leading-tight">
            Select Your <br />Deployment Path.
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed opacity-60">
            Choose your operational interface to initialize the high-performance talent sequence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Candidate Path */}
          <Link href="/signup/candidate" className="group h-full">
            <div className="premium-card h-full glass-panel p-16 flex flex-col items-center text-center space-y-10 group-hover:border-primary/50 transition-all duration-700">
               <div className="w-24 h-24 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-foreground group-hover:text-background transition-all duration-700 shadow-2xl">
                  <User className="w-10 h-10" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tighter">Candidate</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-[240px]">
                     Access global pipelines and manage your technical identity.
                  </p>
               </div>
               <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                  Initialize Profile <ArrowRight className="w-4 h-4" />
               </div>
            </div>
          </Link>

          {/* Recruiter Path */}
          <Link href="/signup/recruiter" className="group h-full">
            <div className="premium-card h-full glass-panel p-16 flex flex-col items-center text-center space-y-10 group-hover:border-primary/50 transition-all duration-700">
               <div className="w-24 h-24 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-foreground group-hover:text-background transition-all duration-700 shadow-2xl">
                  <Briefcase className="w-10 h-10" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tighter">Recruiter</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-[240px]">
                     Deploy hiring infrastructure and acquire elite technical talent.
                  </p>
               </div>
               <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                  Setup Console <ArrowRight className="w-4 h-4" />
               </div>
            </div>
          </Link>
        </div>

        <div className="pt-12 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Grade Auth</span>
           </div>
           <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Already have an account? <span className="text-primary underline underline-offset-4">Sign In</span>
           </Link>
        </div>
      </motion.div>
    </div>
  )
}
