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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="w-full premium-container pt-20 pb-40 flex flex-col items-center text-center relative z-10">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-16 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Talent Acquisition
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="h-xl text-sapphire mb-16 max-w-6xl"
        >
          Engineering <br />
          <span className="text-primary italic">Elite</span> Infrastructure.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-medium leading-relaxed mb-24 px-6 opacity-80"
        >
          RecruitFlow is the definitive talent operating system for world-class
          engineering teams. Build your legacy with the most advanced recruitment
          architecture ever conceived.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-8 w-full justify-center px-4"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="btn-sapphire group min-w-[280px] h-16 rounded-2xl text-lg shadow-2xl shadow-primary/30">
              Initialize Deployment
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              className="h-16 px-12 rounded-2xl font-black text-lg hover:bg-white/5 text-foreground/60 hover:text-foreground border border-white/5 transition-all"
            >
              Access Pipeline
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Stacking Intelligence Cards Section */}
      <section className="w-full py-40 relative">
        <div className="premium-container max-w-4xl space-y-24 md:space-y-40">
          <div className="text-center mb-32 space-y-6">
            <motion.h2 
              variants={itemVariants}
              className="h-lg text-sapphire"
            >
              System <span className="text-primary">Intelligence.</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-foreground font-medium max-w-xl mx-auto"
            >
              The RecruitFlow core engine utilizes advanced telemetry to optimize every stage of the talent sequence.
            </motion.p>
          </div>

          <div className="space-y-24">
            {/* Card 1: AI Screening */}
            <motion.div 
              variants={itemVariants}
              className="sticky top-32 group"
            >
              <div className="glass-morphism rounded-[3rem] p-12 md:p-20 creative-card border-none shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 group-hover:bg-primary/20 transition-all duration-1000" />
                <div className="space-y-8 max-w-2xl">
                  <div className="w-20 h-20 sapphire-gradient rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                    <Cpu className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
                    AI-Assisted <br />
                    Vector Screening
                  </h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed opacity-80">
                    Our proprietary algorithms analyze candidate trajectories to
                    predict long-term performance and cultural alignment with 94%
                    accuracy.
                  </p>
                  <div className="pt-8 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">
                    <span>Neural Network v4.0</span>
                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                    <span>94% Accuracy Rate</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Latency */}
            <motion.div 
              variants={itemVariants}
              className="sticky top-40 group"
            >
              <div className="glass-morphism rounded-[3rem] p-12 md:p-20 creative-card border-none shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center translate-y-4">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] -z-10 group-hover:bg-amber-500/10 transition-all duration-1000" />
                <div className="space-y-8 max-w-2xl">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center text-amber-500 shadow-2xl group-hover:rotate-12 transition-transform">
                    <Zap className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
                    Zero-Latency <br />
                    Flow Optimization
                  </h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed opacity-80">
                    Experience a pipeline that moves as fast as your thoughts.
                    Optimized for extreme recruiting speed with integrated real-time telemetry.
                  </p>
                  <div className="pt-8 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/50">
                    <span>Low Latency Ops</span>
                    <span className="w-1.5 h-1.5 bg-amber-500/30 rounded-full" />
                    <span>Real-time Sync</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Global */}
            <motion.div 
              variants={itemVariants}
              className="sticky top-48 group"
            >
              <div className="glass-morphism rounded-[3rem] p-12 md:p-20 creative-card border-none shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center translate-y-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-1000" />
                <div className="space-y-8 max-w-2xl">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-2xl group-hover:scale-90 transition-transform">
                    <Globe2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
                    Global Scalable <br />
                    Talent Sourcing
                  </h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed opacity-80">
                    Connect with talent across 140+ countries with localized
                    compliance and automated screening powered by global edge nodes.
                  </p>
                  <div className="pt-8 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">
                    <span>140+ Regions</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full" />
                    <span>Edge Compliance</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Security (Full width, not sticky for exit) */}
            <motion.div 
              variants={itemVariants}
              className="relative z-20 group translate-y-12"
            >
              <div className="sapphire-gradient rounded-[3rem] p-12 md:p-20 creative-card border-none shadow-2xl overflow-hidden min-h-[600px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-16">
                  <div className="max-w-2xl space-y-8">
                    <Shield className="w-24 h-24 text-white/40 mb-8" />
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                      Hardened <br />
                      Data Integrity.
                    </h2>
                    <p className="text-xl text-white/70 font-medium leading-relaxed">
                      Bank-grade encryption for every application, resume, and
                      interview note. Your talent data is protected by the most advanced security protocols available today.
                    </p>
                  </div>
                  <Button className="h-20 px-16 rounded-2xl bg-white text-primary font-black hover:bg-zinc-100 shadow-2xl text-xl w-full md:w-auto active:scale-95 transition-all">
                    Security Audit
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-40 flex flex-col items-center bg-foreground/[0.02]">
        <div className="premium-container w-full max-w-5xl">
          <motion.div variants={itemVariants} className="text-center mb-32 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground/40">
              Trusted Infrastructure
            </h2>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-sapphire">
              Powering the next generation <br />of technical leadership.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 items-center">
            <div className="flex items-center justify-center font-black text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">
              NEXUS
            </div>
            <div className="flex items-center justify-center font-black text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">
              ORBIT
            </div>
            <div className="flex items-center justify-center font-black text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">
              AETHER
            </div>
            <div className="flex items-center justify-center font-black text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">
              PRISM
            </div>
          </div>
        </div>
      </section>

      {/* CTA Closing Section */}
      <section className="w-full py-32 flex flex-col items-center text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, hsla(217,91%,60%,0.08) 0%, transparent 70%)",
          }}
        />
        <motion.div
          variants={itemVariants}
          className="relative z-10 px-6 premium-container"
        >
          <h2 className="h-xl text-sapphire mb-10 tracking-tighter">
            Build Your <br />
            <span className="text-primary">Legacy.</span>
          </h2>
          <Link
            href="/signup"
            className="btn-sapphire h-20 px-20 rounded-[2rem] text-xl shadow-2xl inline-flex items-center"
          >
            Initialize Deployment
          </Link>
          <p className="mt-10 text-muted-foreground font-black uppercase tracking-widest text-xs">
            Join 500+ Engineering Teams This Month
          </p>
        </motion.div>
      </section>
    </motion.div>
  );
}
