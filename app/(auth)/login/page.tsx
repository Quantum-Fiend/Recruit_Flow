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

import { Briefcase, User } from "lucide-react";

export default function LoginChoicePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full px-6 py-20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[800px] text-center space-y-16"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-[10px] font-black uppercase tracking-widest text-primary mb-4 mx-auto">
            <Lock className="w-3 h-3" />
            <span>Secure Access Gateway</span>
          </div>
          <h1 className="h-xl">
            Access Hub.
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed text-balance">
            Choose your gateway to authorize access to the RecruitFlow engine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Candidate Path */}
          <Link href="/login/candidate" className="group h-full">
            <div className="premium-card p-16 flex flex-col items-center text-center h-full glass-panel group-hover:border-primary/50 transition-all duration-700">
              <div className="w-20 h-20 sapphire-gradient rounded-2xl flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-all duration-700">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4 mb-10">
                <h3 className="text-3xl font-black tracking-tighter">Candidate</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-[240px] opacity-60">
                  Access global pipelines and manage your technical identity.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                Authorize Profile <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Recruiter Path */}
          <Link href="/login/recruiter" className="group h-full">
            <div className="premium-card p-16 flex flex-col items-center text-center h-full glass-panel group-hover:border-emerald-500/50 transition-all duration-700">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-all duration-700">
                <Briefcase className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-4 mb-10">
                <h3 className="text-3xl font-black tracking-tighter">Recruiter</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-[240px] opacity-60">
                  Deploy hiring infrastructure and manage elite talent sequences.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                Authorize Console <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 pt-16">
          New to the network? <Link href="/signup" className="text-primary hover:text-foreground transition-colors">Initialize Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
