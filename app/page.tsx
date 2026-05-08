"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Shield, Sparkles, ArrowRight, Cpu, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react"

export default function LandingPage() {
  const containerRef = useRef(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as any },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center w-full relative"
    >
      {/* Hero Section */}
      <section className="w-full premium-container pt-20 pb-40 flex flex-col items-center text-center relative z-10">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-12 shadow-2xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Talent Operating System
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="h-xl mb-12 max-w-6xl tracking-tight"
        >
          Architecting <br />
          <span className="text-gradient italic">The Future</span> of Hiring.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-20 px-6 text-balance opacity-80"
        >
          RecruitFlow is the definitive talent infrastructure for the world's most 
          ambitious engineering organizations. Build your legacy on precision.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center px-4"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="btn-quantum group min-w-[260px] h-16 rounded-2xl text-base">
              Initialize Deployment
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-16 px-12 rounded-2xl font-bold text-base hover:bg-secondary border-border/50 transition-all shadow-xl"
            >
              Access Pipeline
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Intelligence Bento Grid */}
      <section className="w-full py-40 relative border-t border-border/40">
        <div className="premium-container">
          <div className="text-center mb-32 space-y-4">
             <motion.h2 
               variants={itemVariants}
               className="h-lg text-gradient"
             >
               Core Intelligence.
             </motion.h2>
             <motion.p 
               variants={itemVariants}
               className="text-lg text-muted-foreground font-medium max-w-lg mx-auto text-balance opacity-60"
             >
               Autonomous telemetry and predictive screening for high-velocity talent sequences.
             </motion.p>
          </div>

          <div className="bento-grid auto-rows-[400px]">
             {/* Large Item: AI Screening */}
             <motion.div variants={itemVariants} className="bento-item md:col-span-8 group">
                <div className="premium-card h-full p-12 md:p-16 flex flex-col justify-end glass-panel">
                   <div className="absolute top-12 right-12 w-24 h-24 sapphire-gradient rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-700">
                      <Cpu className="w-12 h-12" />
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-4xl md:text-5xl font-black tracking-tighter">Vector <br />Screening.</h3>
                      <p className="text-lg text-muted-foreground font-medium max-w-md">Proprietary neural analysis predicting long-term mission alignment and technical velocity.</p>
                   </div>
                </div>
             </motion.div>

             {/* Small Item: Latency */}
             <motion.div variants={itemVariants} className="bento-item md:col-span-4 group">
                <div className="premium-card h-full p-12 flex flex-col justify-between bg-amber-500/5 border-amber-500/10">
                   <Zap className="w-12 h-12 text-amber-500" />
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black tracking-tighter">Zero-Latency.</h3>
                      <p className="text-sm text-muted-foreground font-medium">Real-time telemetry sync across all recruitment edge nodes.</p>
                   </div>
                </div>
             </motion.div>

             {/* Small Item: Global */}
             <motion.div variants={itemVariants} className="bento-item md:col-span-4 group">
                <div className="premium-card h-full p-12 flex flex-col justify-between bg-emerald-500/5 border-emerald-500/10">
                   <Globe2 className="w-12 h-12 text-emerald-500" />
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black tracking-tighter">Global Ops.</h3>
                      <p className="text-sm text-muted-foreground font-medium">Localized compliance and ingestion across 140+ regions.</p>
                   </div>
                </div>
             </motion.div>

             {/* Large Item: Security */}
             <motion.div variants={itemVariants} className="bento-item md:col-span-8 group">
                <div className="premium-card h-full p-12 md:p-16 flex flex-col justify-end sapphire-gradient border-none">
                   <Shield className="w-16 h-16 text-white/40 mb-8" />
                   <div className="space-y-6">
                      <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Data <br />Hardening.</h3>
                      <p className="text-lg text-white/70 font-medium max-w-md">Military-grade encryption for every application, resume, and internal interview note.</p>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-40 border-t border-border/40 overflow-hidden">
        <div className="premium-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-20">
             <div className="max-w-md space-y-6">
                <h2 className="text-4xl font-black tracking-tighter leading-tight">Trusted by the next generation of technical leaders.</h2>
                <p className="text-muted-foreground font-medium opacity-60">RecruitFlow powers high-performance teams globally, from stealth startups to Fortune 500 engineering hubs.</p>
             </div>
             <div className="grid grid-cols-2 gap-12 opacity-30">
                <span className="text-4xl font-black tracking-tighter uppercase">Nexus</span>
                <span className="text-4xl font-black tracking-tighter uppercase">Orbit</span>
                <span className="text-4xl font-black tracking-tighter uppercase">Aether</span>
                <span className="text-4xl font-black tracking-tighter uppercase">Prism</span>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Closing Section */}
      <section className="w-full py-48 flex flex-col items-center text-center relative overflow-hidden border-t border-border/40">
        <motion.div
          variants={itemVariants}
          className="relative z-10 px-6 premium-container"
        >
          <h2 className="h-xl mb-12 tracking-tighter text-gradient">
            Build Your <br />Legacy.
          </h2>
          <Link
            href="/signup"
            className="btn-quantum h-20 px-20 rounded-2xl text-xl shadow-2xl inline-flex items-center"
          >
            Initialize Deployment
          </Link>
          <div className="mt-12 flex items-center justify-center gap-4 text-muted-foreground font-black uppercase tracking-widest text-[10px] opacity-40">
             <span>v4.2.0 Production Ready</span>
             <span className="w-1 h-1 bg-border rounded-full" />
             <span>ISO 27001 Certified</span>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
