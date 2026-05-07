"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Zap, Shield, Sparkles, ArrowRight, Globe, Star, Command, MousePointer2, Layout } from "lucide-react"
import { motion, type Variants } from "framer-motion"

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center w-full"
    >
      {/* Hero Section - The 'Advanced' Look */}
      <section className="w-full pt-10 pb-32 flex flex-col items-center text-center">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 mb-12">
          <Command className="w-3.5 h-3.5" />
          <span>System Version 4.0 Stable</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-hero text-7xl md:text-9xl mb-12 max-w-5xl">
          The Talent <br />
          <span className="opacity-40">Operating</span> System
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-medium leading-relaxed mb-16 px-4">
          Experience the most advanced talent engine ever built. Minimalist design. Maximum performance. Built for the speed of tomorrow.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center px-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="btn-advanced h-16 px-12 bg-foreground text-background hover:bg-foreground/90 w-full sm:w-auto text-xl shadow-2xl shadow-foreground/10 group">
              Start Building Your Team
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button variant="ghost" className="h-16 px-12 rounded-2xl border-border hover:bg-foreground/5 w-full sm:w-auto font-black text-lg">
              Explore The Pipeline
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Advanced Bento Feature Section */}
      <section className="w-full py-32 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
           {/* Primary Feature */}
           <motion.div variants={itemVariants} className="md:col-span-2 glass glass-hover p-12 flex flex-col justify-between group min-h-[400px]">
              <div className="w-16 h-16 rounded-3xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-700">
                 <Zap className="w-8 h-8" />
              </div>
              <div>
                 <h2 className="text-4xl font-black mb-4 tracking-tighter">Hyper-Fast Pipelines</h2>
                 <p className="text-lg text-muted-foreground font-medium max-w-md">Our proprietary engine processes thousands of applications per second with zero latency. Review candidates as fast as you can think.</p>
              </div>
           </motion.div>

           {/* Secondary Feature */}
           <motion.div variants={itemVariants} className="glass glass-hover p-12 flex flex-col gap-8 group">
              <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <Shield className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-2xl font-black mb-2 tracking-tight">Core Encryption</h3>
                 <p className="text-muted-foreground font-medium text-sm leading-relaxed">Enterprise-grade security built into the fundamental architecture of the platform.</p>
              </div>
           </motion.div>

           {/* Small Bento Item */}
           <motion.div variants={itemVariants} className="glass glass-hover p-8 flex items-center gap-6 group">
              <MousePointer2 className="w-8 h-8 text-foreground/40 group-hover:text-foreground transition-colors" />
              <span className="font-black uppercase tracking-widest text-[10px]">Precision Selection</span>
           </motion.div>

           {/* Small Bento Item 2 */}
           <motion.div variants={itemVariants} className="glass glass-hover p-8 flex items-center gap-6 group">
              <Layout className="w-8 h-8 text-foreground/40 group-hover:text-foreground transition-colors" />
              <span className="font-black uppercase tracking-widest text-[10px]">Unified Interface</span>
           </motion.div>

           {/* Final Bento Item */}
           <motion.div variants={itemVariants} className="glass glass-hover p-10 flex flex-col justify-center group">
              <div className="flex gap-1 mb-4">
                 {[1,2,3].map(i => <Star key={i} className="w-4 h-4 text-foreground/20 fill-foreground/20" />)}
              </div>
              <p className="font-bold italic">&ldquo;The UI is simply flawless.&rdquo;</p>
           </motion.div>
        </div>
      </section>

      {/* Visual Break - Interactive Gradient Block */}
      <section className="w-full py-32 flex flex-col items-center">
         <motion.div 
           whileHover={{ scale: 0.98 }}
           className="w-full max-w-5xl aspect-[21/9] rounded-[3rem] bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent border border-foreground/5 flex flex-col items-center justify-center p-12 relative overflow-hidden group shadow-2xl"
         >
            <div className="absolute top-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-[120px] group-hover:bg-foreground/10 transition-colors" />
            <h2 className="text-5xl md:text-7xl font-black text-center mb-8 leading-tight">Scale Your Vision <br />With Confidence</h2>
            <div className="flex items-center gap-6">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-foreground/10" />)}
               </div>
               <span className="text-sm font-bold text-muted-foreground">+2,400 companies joined this week</span>
            </div>
         </motion.div>
      </section>

      {/* Closing Section */}
      <section className="w-full py-40 flex flex-col items-center text-center">
         <motion.h2 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-12 tracking-tighter">Ready for the <span className="opacity-30">Future?</span></motion.h2>
         <motion.div variants={itemVariants}>
            <Link href="/signup">
               <Button className="btn-advanced h-20 px-20 rounded-[2rem] text-2xl bg-foreground text-background">Initialize Profile</Button>
            </Link>
         </motion.div>
      </section>
    </motion.div>
  )
}
