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

          <div className="flex flex-col gap-32 relative">
             {/* Large Item: AI Screening */}
             <motion.div 
               variants={itemVariants} 
               className="sticky top-32 group"
             >
                <div className="premium-card h-[800px] p-12 md:p-24 flex flex-col items-center justify-center text-center glass-panel backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                   {/* Background Telemetry Visualization */}
                   <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid grid-cols-24 gap-1 px-4 py-8">
                      {Array.from({ length: 288 }).map((_, i) => (
                         <div key={i} className="h-4 w-4 rounded-sm bg-primary" />
                      ))}
                   </div>
                   
                   <div className="w-24 h-24 sapphire-gradient rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-700 mb-16 relative z-10">
                      <Cpu className="w-12 h-12" />
                   </div>
                   
                   <div className="space-y-12 max-w-4xl z-10">
                      <div className="space-y-6">
                         <h3 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">Vector <br />Screening.</h3>
                         <p className="text-xl text-muted-foreground font-medium opacity-60 max-w-2xl mx-auto">Proprietary neural analysis predicting long-term mission alignment and technical velocity with 99.4% precision.</p>
                      </div>
                      
                      {/* Illustrative Telemetry Content */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full pt-8">
                         {[
                            { label: 'Neural Mapping', value: 'Active' },
                            { label: 'Pattern Delta', value: '0.002s' },
                            { label: 'Velocity Index', value: '98.4' },
                            { label: 'Risk Vector', value: 'Minimal' }
                         ].map(stat => (
                            <div key={stat.label} className="p-6 rounded-2xl glass-panel border-primary/10 flex flex-col items-center gap-2">
                               <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">{stat.label}</span>
                               <span className="text-2xl font-black tracking-tighter text-primary">{stat.value}</span>
                            </div>
                         ))}
                      </div>

                      <div className="flex flex-wrap justify-center gap-4">
                         {['Proprietary Logic', 'Behavioral Sync', 'Skill Telemetry', 'AI Matrix'].map(tag => (
                            <span key={tag} className="px-6 py-2.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary">
                               {tag}
                            </span>
                         ))}
                      </div>
                   </div>
                </div>
             </motion.div>

             {/* Small Item: Latency */}
             <motion.div 
               variants={itemVariants} 
               className="sticky top-40 group"
             >
                <div className="premium-card h-[800px] p-12 md:p-24 flex flex-col items-center justify-center text-center bg-amber-500/5 border-amber-500/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
                      <div className="w-[1000px] h-[1000px] border-[60px] border-amber-500 rounded-full animate-pulse" />
                   </div>

                   <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-16 relative z-10">
                      <Zap className="w-10 h-10" />
                   </div>
                   
                   <div className="space-y-12 max-w-4xl z-10">
                      <div className="space-y-6">
                         <h3 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">Zero-Latency <br />Telemetry.</h3>
                         <p className="text-xl text-muted-foreground font-medium opacity-60 max-w-2xl mx-auto">Real-time telemetry synchronization across all global recruitment edge nodes, ensuring instant data parity.</p>
                      </div>

                      <div className="w-full max-w-2xl mx-auto space-y-4">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-amber-500/40 mb-2">
                            <span>Propagation Stream</span>
                            <span>99.99% Uptime</span>
                         </div>
                         <div className="grid grid-cols-12 gap-2">
                            {Array.from({ length: 12 }).map((_, i) => (
                               <div key={i} className="h-12 rounded-lg bg-amber-500/10 overflow-hidden relative border border-amber-500/5">
                                  <motion.div 
                                    className="absolute inset-0 bg-amber-500/20" 
                                    animate={{ height: ["10%", "90%", "10%"] }} 
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                                  />
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="flex gap-12 justify-center opacity-40 font-black text-[10px] uppercase tracking-widest">
                         <span>Stream: AES-256</span>
                         <span>Ping: 0.4ms</span>
                         <span>Jitter: 0.01ms</span>
                      </div>
                   </div>
                </div>
             </motion.div>

             {/* Small Item: Global */}
             <motion.div 
               variants={itemVariants} 
               className="sticky top-48 group"
             >
                <div className="premium-card h-[800px] p-12 md:p-24 flex flex-col items-center justify-center text-center bg-emerald-500/5 border-emerald-500/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                   <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-16 relative z-10">
                      <Globe2 className="w-10 h-10" />
                   </div>
                   
                   <div className="space-y-12 max-w-4xl z-10">
                      <div className="space-y-6">
                         <h3 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">Global Ops <br />Ingestion.</h3>
                         <p className="text-xl text-muted-foreground font-medium opacity-60 max-w-2xl mx-auto">Localized compliance protocols and autonomous ingestion across 140+ sovereign regions and talent markets.</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                         {['GDPR', 'CCPA', 'SOC2 TYPE II', 'ISO 27001'].map(comp => (
                            <div key={comp} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-black text-[10px] tracking-widest uppercase">
                               {comp}
                            </div>
                         ))}
                      </div>

                      <div className="flex flex-wrap gap-8 justify-center opacity-40 font-black text-[10px] uppercase tracking-widest pt-8">
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
             <motion.div 
               variants={itemVariants} 
               className="sticky top-56 group"
             >
                <div className="premium-card h-[800px] p-12 md:p-24 flex flex-col items-center justify-center text-center sapphire-gradient border-none shadow-2xl relative overflow-hidden">
                   <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-white mb-16 relative z-10">
                      <Shield className="w-12 h-12" />
                   </div>
                   
                   <div className="space-y-12 max-w-4xl z-10">
                      <div className="space-y-6">
                         <h3 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none">Hardened <br />Protocols.</h3>
                         <p className="text-xl text-white/70 font-medium leading-relaxed max-w-xl mx-auto">Military-grade end-to-end encryption for every technical application, resume, and internal telemetry note.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6 justify-center">
                         <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">AES-256 Multi-Layer Active</span>
                      </div>
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
