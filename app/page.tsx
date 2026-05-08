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
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="w-full premium-container pt-32 pb-40 flex flex-col items-center text-center relative z-10">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-surface text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-12"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Talent Acquisition
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="h-xl mb-12 max-w-5xl"
        >
          Engineering <br />
          <span className="text-primary italic">Elite</span> Infrastructure.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-20 px-6 text-balance"
        >
          RecruitFlow is the definitive talent operating system for world-class
          engineering teams. Build your legacy with advanced recruitment
          architecture.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center px-4"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="btn-sapphire group min-w-[240px] h-14 rounded-xl text-base shadow-xl shadow-primary/20">
              Initialize Deployment
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-14 px-10 rounded-xl font-bold text-base hover:bg-secondary border-border transition-all"
            >
              Access Pipeline
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Stacking Intelligence Cards Section */}
      <section className="w-full py-40 relative">
        <div className="premium-container max-w-4xl space-y-24 md:space-y-40">
          <div className="text-center mb-32 space-y-4">
            <motion.h2 
              variants={itemVariants}
              className="h-lg"
            >
              System <span className="text-primary">Intelligence.</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-foreground font-medium max-w-lg mx-auto text-balance"
            >
              The RecruitFlow core engine utilizes advanced telemetry to optimize every stage of the talent sequence.
            </motion.p>
          </div>

          <div className="space-y-32">
            {/* Card 1: AI Screening */}
            <motion.div 
              variants={itemVariants}
              className="sticky top-24 group"
            >
              <div className="premium-card p-12 md:p-20 overflow-hidden min-h-[480px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
                <div className="space-y-8 max-w-2xl">
                  <div className="w-16 h-16 sapphire-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-balance">
                    AI-Assisted <br />
                    Vector Screening
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                    Our proprietary algorithms analyze candidate trajectories to
                    predict long-term performance and cultural alignment with high accuracy.
                  </p>
                  <div className="pt-6 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                    <span>Neural Network v4.0</span>
                    <span className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
                    <span>94% Success Rate</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Latency */}
            <motion.div 
              variants={itemVariants}
              className="sticky top-32 group"
            >
              <div className="premium-card p-12 md:p-20 overflow-hidden min-h-[480px] flex flex-col justify-center translate-y-4">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -z-10 group-hover:bg-amber-500/10 transition-all duration-1000" />
                <div className="space-y-8 max-w-2xl">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-lg">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-balance">
                    Zero-Latency <br />
                    Flow Optimization
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                    Experience a pipeline that moves as fast as your thoughts.
                    Optimized for extreme recruiting speed with integrated real-time telemetry.
                  </p>
                  <div className="pt-6 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60">
                    <span>Low Latency Ops</span>
                    <span className="w-1.5 h-1.5 bg-amber-500/20 rounded-full" />
                    <span>Real-time Sync</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Global */}
            <motion.div 
              variants={itemVariants}
              className="sticky top-40 group"
            >
              <div className="premium-card p-12 md:p-20 overflow-hidden min-h-[480px] flex flex-col justify-center translate-y-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-1000" />
                <div className="space-y-8 max-w-2xl">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg">
                    <Globe2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-balance">
                    Global Scalable <br />
                    Talent Sourcing
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                    Connect with talent across 140+ countries with localized
                    compliance and automated screening powered by global edge nodes.
                  </p>
                  <div className="pt-6 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">
                    <span>140+ Regions</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full" />
                    <span>Edge Compliance</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Security */}
            <motion.div 
              variants={itemVariants}
              className="relative z-20 group translate-y-12"
            >
              <div className="sapphire-gradient rounded-[2.5rem] p-12 md:p-20 creative-card border-none shadow-premium overflow-hidden min-h-[500px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-16">
                  <div className="max-w-2xl space-y-8">
                    <Shield className="w-20 h-20 text-white/40 mb-4" />
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none text-balance">
                      Hardened <br />
                      Data Integrity.
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 font-medium leading-relaxed">
                      Bank-grade encryption for every application, resume, and
                      interview note. Your talent data is protected by elite security protocols.
                    </p>
                  </div>
                  <Button className="h-16 px-12 rounded-xl bg-white text-primary font-black hover:bg-zinc-100 shadow-2xl text-lg w-full md:w-auto active:scale-95 transition-all">
                    Security Audit
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-40 flex flex-col items-center border-t border-border/40">
        <div className="premium-container w-full max-w-5xl">
          <motion.div variants={itemVariants} className="text-center mb-32 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">
              Trusted Infrastructure
            </h2>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-balance">
              Powering the next generation <br />of technical leadership.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 items-center">
            <div className="flex items-center justify-center font-black text-3xl md:text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">
              NEXUS
            </div>
            <div className="flex items-center justify-center font-black text-3xl md:text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">
              ORBIT
            </div>
            <div className="flex items-center justify-center font-black text-3xl md:text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">
              AETHER
            </div>
            <div className="flex items-center justify-center font-black text-3xl md:text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">
              PRISM
            </div>
          </div>
        </div>
      </section>

      {/* CTA Closing Section */}
      <section className="w-full py-40 flex flex-col items-center text-center relative overflow-hidden border-t border-border/40">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, hsla(217,91%,60%,0.05) 0%, transparent 70%)",
          }}
        />
        <motion.div
          variants={itemVariants}
          className="relative z-10 px-6 premium-container"
        >
          <h2 className="h-xl mb-12 tracking-tighter">
            Build Your <br />
            <span className="text-primary">Legacy.</span>
          </h2>
          <Link
            href="/signup"
            className="btn-sapphire h-16 px-16 rounded-xl text-lg shadow-xl inline-flex items-center"
          >
            Initialize Deployment
          </Link>
          <p className="mt-12 text-muted-foreground font-black uppercase tracking-widest text-[10px] opacity-60">
            Join 500+ Engineering Teams This Month
          </p>
        </motion.div>
      </section>
    </motion.div>
  );
}
