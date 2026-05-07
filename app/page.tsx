"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Zap, Shield, Sparkles, ArrowRight, Globe, Star, Command, MousePointer2, Layout, Layers, Cpu, Globe2 } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
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

  const itemVariants: any = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
  }

  return (
    <motion.div 
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center w-full"
    >
      {/* Hero Section */}
      <section className="w-full premium-container pt-8 pb-32 flex flex-col items-center text-center relative">
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-black uppercase tracking-[0.25em] text-primary mb-12 shadow-2xl shadow-primary/5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen Talent Acquisition</span>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="h-xl text-sapphire mb-12 max-w-6xl"
        >
          Engineering <br />
          <span className="opacity-40">Elite</span> Teams.
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-medium leading-relaxed mb-20 px-6"
        >
          RecruitFlow is the definitive talent infrastructure for world-class engineering teams. 
          Build your legacy with the most advanced ATS ever conceived.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center px-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="btn-sapphire group min-w-[240px]">
              Deploy Infrastructure
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button variant="ghost" className="h-14 px-10 rounded-2xl font-black text-lg hover:bg-primary/5 text-foreground/70 hover:text-foreground">
              Explore Network
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Bento Grid - Intelligence Section */}
      <section className="w-full py-24 border-t border-border/30">
        <div className="bento-container premium-container">
           {/* Primary Intelligence Block */}
           <motion.div variants={itemVariants} className="bento-item lg:col-span-8 creative-card glass-morphism min-h-[500px] flex flex-col justify-end group">
              <div className="absolute top-12 right-12 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-1000" />
              <div className="space-y-6">
                 <div className="w-16 h-16 rounded-3xl sapphire-gradient flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                    <Cpu className="w-8 h-8" />
                 </div>
                 <h2 className="text-5xl font-black tracking-tighter leading-none">AI-Assisted <br />Vector Screening</h2>
                 <p className="text-lg text-muted-foreground font-medium max-w-md leading-relaxed">Our proprietary algorithms analyze candidate trajectories to predict long-term performance and cultural alignment with 94% accuracy.</p>
              </div>
           </motion.div>

           {/* Velocity Block */}
           <motion.div variants={itemVariants} className="bento-item lg:col-span-4 creative-card glass-morphism flex flex-col justify-between group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-black tracking-tight">Zero-Latency Flow</h3>
                 <p className="text-muted-foreground font-medium text-sm leading-relaxed">Experience a pipeline that moves as fast as your thoughts. Optimized for extreme recruiting speed.</p>
              </div>
           </motion.div>

           {/* Global Scale Block */}
           <motion.div variants={itemVariants} className="bento-item lg:col-span-4 creative-card glass-morphism flex flex-col gap-8 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                 <Globe2 className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-2xl font-black mb-3">Global Sourcing</h3>
                 <p className="text-muted-foreground font-medium text-sm leading-relaxed">Connect with talent across 140+ countries with localized compliance and automated screening.</p>
              </div>
           </motion.div>

           {/* Security Block */}
           <motion.div variants={itemVariants} className="bento-item lg:col-span-8 creative-card sapphire-gradient p-12 group overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between h-full gap-8">
                 <div className="max-w-md space-y-6">
                    <Shield className="w-16 h-16 text-white/40 mb-4" />
                    <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Hardened <br />Data Integrity</h2>
                    <p className="text-lg text-white/70 font-medium leading-relaxed">Bank-grade encryption for every application, resume, and interview note. Your talent data is your most valuable asset.</p>
                 </div>
                 <Button className="h-16 px-10 rounded-2xl bg-white text-primary font-black hover:bg-zinc-100 shadow-2xl">View Security Audit</Button>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-24 flex flex-col items-center">
         <div className="premium-container w-full">
            <motion.div 
              variants={itemVariants}
              className="text-center mb-24"
            >
               <h2 className="h-lg text-sapphire mb-6">Trusted by the innovators.</h2>
               <p className="text-xl text-muted-foreground font-medium">Powering talent acquisition for the world's most ambitious companies.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center justify-center font-black text-3xl tracking-tighter">NEXUS</div>
               <div className="flex items-center justify-center font-black text-3xl tracking-tighter">ORBIT</div>
               <div className="flex items-center justify-center font-black text-3xl tracking-tighter">AETHER</div>
               <div className="flex items-center justify-center font-black text-3xl tracking-tighter">PRISM</div>
            </div>
         </div>
      </section>

      {/* CTA Closing Section */}
      <section className="w-full py-32 flex flex-col items-center text-center relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse 60% 80% at 50% 50%, hsla(217,91%,60%,0.08) 0%, transparent 70%)'}} />
         <motion.div variants={itemVariants} className="relative z-10 px-6 premium-container">
            <h2 className="h-xl text-sapphire mb-10 tracking-tighter">Build Your <br /><span className="text-primary">Legacy.</span></h2>
            <Link
               href="/signup"
               className="btn-sapphire h-20 px-20 rounded-[2rem] text-xl shadow-2xl inline-flex items-center"
            >
               Initialize Deployment
            </Link>
            <p className="mt-10 text-muted-foreground font-black uppercase tracking-widest text-xs">Join 500+ Engineering Teams This Month</p>
         </motion.div>
      </section>
    </motion.div>
  )
}
