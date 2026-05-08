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
            System <br />
            <span className="text-primary italic">Access</span> Hub.
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed text-balance">
            Choose your gateway to authorize access to the RecruitFlow engine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Candidate Path */}
          <Link href="/login/candidate" className="group h-full">
            <Card className="premium-card p-12 flex flex-col items-center text-center h-full bg-card/40">
              <div className="w-16 h-16 sapphire-gradient rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter">Candidate</h3>
              <p className="text-muted-foreground font-medium mb-10 leading-relaxed text-balance">
                Access your job applications and engineer profile dashboard.
              </p>
              <div className="mt-auto flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                Authorize Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Recruiter Path */}
          <Link href="/login/recruiter" className="group h-full">
            <Card className="premium-card p-12 flex flex-col items-center text-center h-full bg-card/40">
              <div className="w-16 h-16 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:-rotate-6 transition-transform">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter">Recruiter</h3>
              <p className="text-muted-foreground font-medium mb-10 leading-relaxed text-balance">
                Access the recruitment console and manage deployment sequences.
              </p>
              <div className="mt-auto flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                Authorize Console <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>

        <p className="text-sm font-medium text-muted-foreground/60 pt-10">
          New to the network? <Link href="/signup" className="text-primary font-black hover:underline underline-offset-4">Initialize Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
