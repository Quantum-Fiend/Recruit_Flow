"use client"

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Shield, ArrowRight, Cpu, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center w-full relative"
    >
      {/* Hero Section */}
      <section className="w-full premium-container pt-12 pb-24 sm:pt-16 sm:pb-32 flex flex-col items-center text-center relative z-10">
        <motion.div
          variants={itemVariants}
          className="inline-flex max-w-full items-center gap-2 px-3 py-2 rounded-full glass-panel text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-primary mb-7 sm:mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Talent Operating System
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="h-xl mb-7 sm:mb-10 max-w-6xl tracking-tight"
        >
          Architecting <br />
          <span className="text-gradient">The Future</span> of Hiring.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-10 sm:mb-14 px-2 sm:px-6 text-balance"
        >
          RecruitFlow is the definitive talent infrastructure for the
          world&apos;s most ambitious engineering organizations. Build your
          legacy on precision.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full justify-center px-2 sm:px-4"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="btn-quantum group w-full sm:w-auto min-w-0 sm:min-w-[260px] h-14 sm:h-16 px-4 rounded-xl sm:rounded-2xl text-sm sm:text-base">
              Initialize Deployment
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-10 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-secondary border-border/50 transition-all shadow-sm"
            >
              Access Pipeline
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Intelligence Bento Grid */}
      <section className="w-full py-20 sm:py-28 relative border-t border-border/40">
        <div className="premium-container">
          <div className="text-center mb-12 sm:mb-20 space-y-3 sm:space-y-4">
            <motion.h2 variants={itemVariants} className="h-lg text-gradient">
              Core Intelligence.
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground font-medium max-w-lg mx-auto text-balance opacity-60"
            >
              Autonomous telemetry and predictive screening for high-velocity
              talent sequences.
            </motion.p>
          </div>

          <div className="flex flex-col gap-8 sm:gap-10 relative">
            {/* Large Item: AI Screening */}
            <motion.div variants={itemVariants} className="group">
              <div className="premium-card landing-intelligence-card flex flex-col items-center justify-center text-center glass-panel relative overflow-hidden">
                {/* Background Telemetry Visualization */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid grid-cols-24 gap-1 px-4 py-8">
                  {Array.from({ length: 288 }).map((_, i) => (
                    <div key={i} className="h-4 w-4 rounded-sm bg-primary" />
                  ))}
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 sapphire-gradient rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300 mb-8 relative z-10">
                  <Cpu className="w-12 h-12" />
                </div>

                <div className="space-y-7 sm:space-y-9 max-w-4xl z-10">
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="landing-feature-title">
                      Vector <br />
                      Screening.
                    </h3>
                    <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                      Proprietary neural analysis predicting long-term mission
                      alignment and technical velocity with 99.4% precision.
                    </p>
                  </div>

                  {/* Illustrative Telemetry Content */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full pt-5 sm:pt-8">
                    {[
                      { label: "Neural Mapping", value: "Active" },
                      { label: "Pattern Delta", value: "0.002s" },
                      { label: "Velocity Index", value: "98.4" },
                      { label: "Risk Vector", value: "Minimal" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="min-w-0 p-3 sm:p-4 rounded-xl glass-panel border-primary/10 flex flex-col items-center gap-2"
                      >
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-normal sm:tracking-wider text-primary/70">
                          {stat.label}
                        </span>
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-primary">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {[
                      "Proprietary Logic",
                      "Behavioral Sync",
                      "Skill Telemetry",
                      "AI Matrix",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 sm:px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-[9px] sm:text-[10px] font-bold uppercase tracking-normal sm:tracking-wider text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small Item: Latency */}
            <motion.div variants={itemVariants} className="group">
              <div className="premium-card landing-intelligence-card flex flex-col items-center justify-center text-center bg-warning/5 border-warning/15 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
                  <div className="w-[min(80vw,64rem)] aspect-square border-[clamp(1rem,4vw,3.75rem)] border-warning rounded-full animate-pulse" />
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-warning/15 rounded-2xl flex items-center justify-center text-warning mb-8 relative z-10">
                  <Zap className="w-10 h-10" />
                </div>

                <div className="space-y-7 sm:space-y-9 max-w-4xl z-10">
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="landing-feature-title">
                      Zero-Latency <br />
                      Telemetry.
                    </h3>
                    <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                      Real-time telemetry synchronization across all global
                      recruitment edge nodes, ensuring instant data parity.
                    </p>
                  </div>

                  <div className="w-full max-w-2xl mx-auto space-y-4">
                    <div className="flex flex-wrap justify-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-normal sm:tracking-wider text-warning mb-2">
                      <span>Propagation Stream</span>
                      <span>99.99% Uptime</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-10 sm:h-12 rounded-lg bg-warning/10 overflow-hidden relative border border-warning/10"
                        >
                          <motion.div
                            className="absolute inset-0 bg-warning/20"
                            animate={{ height: ["10%", "90%", "10%"] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-8 justify-center text-muted-foreground font-semibold text-[9px] sm:text-[10px] uppercase tracking-wider">
                    <span>Stream: AES-256</span>
                    <span>Ping: 0.4ms</span>
                    <span>Jitter: 0.01ms</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small Item: Global */}
            <motion.div variants={itemVariants} className="group">
              <div className="premium-card landing-intelligence-card flex flex-col items-center justify-center text-center bg-success/5 border-success/15 relative overflow-hidden">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-success/10 rounded-2xl flex items-center justify-center text-success mb-8 relative z-10">
                  <Globe2 className="w-10 h-10" />
                </div>

                <div className="space-y-7 sm:space-y-9 max-w-4xl z-10">
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="landing-feature-title">
                      Global Ops <br />
                      Ingestion.
                    </h3>
                    <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                      Localized compliance protocols and autonomous ingestion
                      across 140+ sovereign regions and talent markets.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
                    {["GDPR", "CCPA", "SOC2 TYPE II", "ISO 27001"].map(
                      (comp) => (
                        <div
                          key={comp}
                          className="min-w-0 p-3 sm:p-4 rounded-xl border border-success/20 bg-success/5 text-success font-bold text-[9px] sm:text-[10px] tracking-normal sm:tracking-wider uppercase"
                        >
                          {comp}
                        </div>
                      ),
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-8 justify-center text-muted-foreground font-semibold text-[9px] sm:text-[10px] uppercase tracking-wider pt-5 sm:pt-8">
                    <span>Node: LDN-01</span>
                    <span>Node: SFO-04</span>
                    <span>Node: TKY-09</span>
                    <span>Node: BER-02</span>
                    <span>Node: SIN-05</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Large Item: Security */}
            <motion.div variants={itemVariants} className="group">
              <div className="premium-card landing-intelligence-card flex flex-col items-center justify-center text-center sapphire-gradient border-none relative overflow-hidden">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 relative z-10">
                  <Shield className="w-12 h-12" />
                </div>

                <div className="space-y-7 sm:space-y-9 max-w-4xl z-10">
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="landing-feature-title text-white">
                      Hardened <br />
                      Protocols.
                    </h3>
                    <p className="text-base sm:text-lg text-white/80 font-medium leading-relaxed max-w-xl mx-auto">
                      Military-grade end-to-end encryption for every technical
                      application, resume, and internal telemetry note.
                    </p>
                  </div>

                  <div className="max-w-full p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-3 sm:gap-6 justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/80">
                      AES-256 Multi-Layer Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-20 sm:py-28 border-t border-border/40">
        <div className="premium-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 sm:gap-14">
            <div className="max-w-md space-y-6">
              <h2 className="text-4xl font-black tracking-tighter leading-tight">
                Trusted by the next generation of technical leaders.
              </h2>
              <p className="text-muted-foreground font-medium opacity-60">
                RecruitFlow powers high-performance teams globally, from stealth
                startups to Fortune 500 engineering hubs.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:gap-10 text-center opacity-40">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                Nexus
              </span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                Orbit
              </span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                Aether
              </span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                Prism
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Closing Section */}
      <section className="w-full py-24 sm:py-32 flex flex-col items-center text-center relative border-t border-border/40">
        <motion.div
          variants={itemVariants}
          className="relative z-10 premium-container"
        >
          <h2 className="h-xl mb-8 sm:mb-10 tracking-tighter text-gradient">
            Build Your <br />
            Legacy.
          </h2>
          <Link
            href="/signup"
            className="btn-quantum min-h-14 max-w-full px-6 sm:px-10 py-4 rounded-xl text-sm sm:text-base shadow-md inline-flex items-center"
          >
            Initialize Deployment
          </Link>
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 text-muted-foreground font-semibold uppercase tracking-wider text-[9px] sm:text-[10px]">
            <span>v4.2.0 Production Ready</span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span>ISO 27001 Certified</span>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
