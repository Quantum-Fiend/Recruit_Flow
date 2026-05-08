'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRecruiterDashboardAction } from "@/app/actions/recruiter"
import { Briefcase, Users, Plus, ChevronRight, TrendingUp, UserPlus, Zap, Sparkles, Globe, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function RecruiterDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadDashboard = useCallback(async () => {
    const result = await getRecruiterDashboardAction()
    if (result.success && result.data) {
      setStats(result.data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  return (
    <div className="page-wrapper animate-reveal px-6">
      {/* Dashboard Header */}
      <header className="w-full mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-3xl space-y-8">
           <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span>Enterprise Talent Console</span>
           </div>
           <h1 className="h-lg text-gradient leading-tight">Command <br />Center.</h1>
           <p className="text-xl text-muted-foreground font-medium opacity-60 leading-relaxed max-w-xl">
             Strategic oversight and pipeline orchestration for the world's most ambitious engineering organizations.
           </p>
        </div>
        
        <div className="flex items-center gap-6">
           <Link href="/recruiter/jobs/new">
              <Button className="btn-quantum h-16 px-10 rounded-2xl shadow-2xl flex items-center gap-3">
                <Plus className="w-6 h-6" />
                <span className="font-black text-xs uppercase tracking-widest">Deploy Position</span>
              </Button>
           </Link>
        </div>
      </header>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-[2.5rem] glass-panel opacity-40" />)
        ) : (
          <>
            <StatBox label="Active Missions" value={stats.activeJobsCount} icon={<Briefcase className="w-6 h-6" />} />
            <StatBox label="Total Profiles" value={stats.totalApplicationsCount} icon={<TrendingUp className="w-6 h-6" />} />
            <StatBox label="Screening Required" value={stats.pendingApplicationsCount} icon={<UserPlus className="w-6 h-6" />} />
            <StatBox label="Hiring Velocity" value="92%" icon={<Zap className="w-6 h-6" />} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full mb-40">
        {/* Active Openings Feed */}
        <div className="lg:col-span-2 space-y-12">
           <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Deployment Pipeline</h2>
              <Link href="/recruiter/jobs" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-8 transition-all">
                Access Archives
              </Link>
           </div>
           
           {loading ? (
             <div className="space-y-8">
               {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-[2.5rem] glass-panel opacity-40" />)}
             </div>
           ) : stats.recentJobs.length === 0 ? (
             <div className="text-center py-48 glass-panel border-dashed rounded-[4rem] flex flex-col items-center">
                <Briefcase className="w-20 h-20 mb-8 text-muted-foreground/10" />
                <h3 className="text-4xl font-black mb-4 tracking-tighter">No active deployments.</h3>
                <Link href="/recruiter/jobs/new">
                   <Button variant="outline" className="mt-8 rounded-2xl font-black px-12 h-16 border-border/50 hover:bg-secondary transition-all">Initialize Mission</Button>
                </Link>
             </div>
           ) : (
             <div className="space-y-8">
               {stats.recentJobs.map((job: any, index: number) => (
                 <JobConsoleCard key={job.id} job={job} index={index} />
               ))}
             </div>
           )}
        </div>

        {/* Real-time Activity Feed */}
        <div className="space-y-12">
           <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Global Telemetry</h2>
           </div>
           
           <div className="premium-card p-10 glass-panel border-border/40 space-y-12 group/telemetry">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover/telemetry:bg-primary/10 transition-all duration-1000" />
              {loading ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl opacity-40" />)
              ) : stats.recentApplications.length === 0 ? (
                <div className="text-center py-16 space-y-6">
                   <Globe className="w-16 h-16 text-muted-foreground/10 mx-auto" />
                   <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-widest">Awaiting Transmission...</p>
                </div>
              ) : (
                <div className="space-y-12 relative">
                   <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-border/40" />
                   {stats.recentApplications.map((app: any) => (
                     <div key={app.id} className="flex gap-8 relative group/item">
                        <div className="w-6 h-6 rounded-full bg-background border-2 border-border/60 mt-1 relative z-10 group-hover/item:border-primary transition-all duration-700 shadow-xl" />
                        <div className="flex-1 space-y-2">
                           <p className="text-base font-bold leading-tight text-balance">
                             <span className="text-foreground">{app.applicant.name}</span>
                             <span className="text-muted-foreground/60 font-medium"> applied to </span>
                             <span className="text-primary font-black">{app.job.title}</span>
                           </p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{formatDate(app.appliedAt)}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
           
           {/* Insight Block */}
           <div className="premium-card p-10 sapphire-gradient border-none flex flex-col gap-10 group overflow-hidden relative shadow-2xl shadow-primary/20 rounded-[2.5rem]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <Sparkles className="w-24 h-24 text-white/20 absolute -top-6 -right-6 rotate-12 group-hover:scale-150 transition-all duration-1000" />
              <div className="relative z-10 space-y-6">
                 <h3 className="text-3xl font-black text-white tracking-tighter leading-none">Automate Talent <br />Orchestration.</h3>
                 <p className="text-base font-medium text-white/70 leading-relaxed">Activate autonomous screening protocols to identify high-trajectory talent 3x faster with neural vectoring.</p>
              </div>
              <Button className="w-full rounded-2xl bg-white text-primary font-black h-16 text-[10px] uppercase tracking-[0.2em] shadow-2xl relative z-10 hover:bg-zinc-50 transition-all active:scale-95">Initialize Intelligence</Button>
           </div>
        </div>
      </div>
    </div>
  )
}

function JobConsoleCard({ job, index }: { job: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group/card"
    >
      <Link href={`/recruiter/jobs/${job.id}/applicants`} className="block h-full">
        <div className="premium-card p-0 glass-panel border-border/40 group-hover/card:border-primary/40 transition-all duration-700">
           <div className="p-10 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="flex items-center gap-10 flex-1">
                 <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground group-hover/card:bg-foreground group-hover/card:text-background transition-all duration-700 shadow-2xl">
                    <Briefcase className="w-10 h-10" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black tracking-tighter leading-tight group-hover/card:text-primary transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                       <span className="flex items-center gap-3"><MapPin className="w-4 h-4" /> {job.location}</span>
                       <span className="w-1.5 h-1.5 bg-border rounded-full" />
                       <span className="flex items-center gap-3"><Users className="w-4 h-4" /> {job._count.applications} Profiles Ingested</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20 shadow-xl">{job.status}</div>
                 <div className="w-14 h-14 rounded-2xl bg-foreground/[0.03] flex items-center justify-center text-muted-foreground/40 group-hover/card:bg-primary group-hover/card:text-white transition-all duration-700 shadow-sm">
                    <ChevronRight className="w-6 h-6" />
                 </div>
              </div>
           </div>
        </div>
      </Link>
    </motion.div>
  )
}

function StatBox({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="premium-card p-10 flex flex-col items-center justify-center text-center group glass-panel border-border/40 hover:border-primary/40 transition-all duration-700">
       <div className="w-16 h-16 rounded-2xl bg-foreground/[0.03] flex items-center justify-center text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700 mb-8 shadow-2xl">
          {icon}
       </div>
       <div className="text-6xl font-black mb-4 tracking-tighter leading-none group-hover:scale-110 transition-transform duration-700">{value}</div>
       <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">{label}</p>
    </div>
  )
}
