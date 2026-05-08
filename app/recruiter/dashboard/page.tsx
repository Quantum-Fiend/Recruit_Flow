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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard()
  }, [loadDashboard])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-wrapper animate-slide-up"
    >
      {/* Dashboard Header */}
      <header className="w-full mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-2xl space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-[10px] font-black uppercase tracking-widest text-primary">
              <Zap className="w-3 h-3" />
              <span>Enterprise Talent Console</span>
           </div>
           <h1 className="h-lg">Command <br /><span className="text-primary">Center.</span></h1>
           <p className="text-xl text-muted-foreground font-medium">Strategic oversight and pipeline management for the RecruitFlow ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <Link href="/recruiter/jobs/new">
              <Button className="btn-sapphire h-14 px-8 shadow-xl shadow-primary/20 flex items-center gap-3 rounded-xl">
                <Plus className="w-5 h-5" />
                <span className="font-bold">Deploy Position</span>
              </Button>
           </Link>
        </div>
      </header>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl glass-morphism" />)
        ) : (
          <>
            <StatBox label="Active Missions" value={stats.activeJobsCount} icon={<Briefcase />} />
            <StatBox label="Total Profiles" value={stats.totalApplicationsCount} icon={<TrendingUp />} />
            <StatBox label="Screening Required" value={stats.pendingApplicationsCount} icon={<UserPlus />} />
            <StatBox label="Hiring Velocity" value="92%" icon={<Zap />} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Active Openings Feed */}
        <div className="lg:col-span-2 space-y-10">
           <div className="flex items-center justify-between px-6 mb-4">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-muted-foreground/40">Deployment Pipeline</h2>
              <Link href="/recruiter/jobs" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4 transition-all">
                Access Archives
              </Link>
           </div>
           
           {loading ? (
             <div className="space-y-6">
               {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl glass-morphism" />)}
             </div>
           ) : stats.recentJobs.length === 0 ? (
             <div className="text-center py-32 premium-card border-dashed rounded-[2rem] flex flex-col items-center">
                <Briefcase className="w-16 h-16 mb-6 text-muted-foreground/10" />
                <h3 className="text-3xl font-black mb-4 tracking-tight">No active deployments</h3>
                <Link href="/recruiter/jobs/new">
                   <Button variant="outline" className="mt-8 rounded-xl font-black px-10 h-14 border-border hover:bg-secondary">Initialize First Mission</Button>
                </Link>
             </div>
           ) : (
             <div className="space-y-6">
               {stats.recentJobs.map((job: any, index: number) => (
                 <JobConsoleCard key={job.id} job={job} index={index} />
               ))}
             </div>
           )}
        </div>

        {/* Real-time Activity Feed */}
        <div className="space-y-10">
           <div className="flex items-center justify-between px-6 mb-4">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-muted-foreground/40">Telemetry</h2>
           </div>
           
           <div className="premium-card p-10 space-y-10 group bg-card/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
              {loading ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
              ) : stats.recentApplications.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                   <Globe className="w-12 h-12 text-muted-foreground/10 mx-auto" />
                   <p className="text-sm font-medium text-muted-foreground">Waiting for talent input...</p>
                </div>
              ) : (
                <div className="space-y-10 relative">
                   <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
                   {stats.recentApplications.map((app: any) => (
                     <div key={app.id} className="flex gap-8 relative group/item">
                        <div className="w-6 h-6 rounded-full bg-background border-2 border-border mt-1 relative z-10 group-hover/item:border-primary transition-all duration-500" />
                        <div className="flex-1 space-y-1">
                           <p className="text-sm font-bold leading-tight">
                             <span className="text-foreground">{app.applicant.name}</span>
                             <span className="text-muted-foreground font-medium"> applied to </span>
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
           <div className="premium-card p-10 sapphire-gradient border-none flex flex-col gap-8 group overflow-hidden relative shadow-xl shadow-primary/20">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <Sparkles className="w-16 h-16 text-white/20 absolute -top-4 -right-4 rotate-12 group-hover:scale-150 transition-all duration-1000" />
              <div className="relative z-10 space-y-4">
                 <h3 className="text-2xl font-black text-white tracking-tight leading-none">Automate Talent <br />Verification</h3>
                 <p className="text-sm font-medium text-white/70 leading-relaxed">Activate autonomous screening protocols to identify high-trajectory talent 3x faster.</p>
              </div>
              <Button className="w-full rounded-xl bg-white text-primary font-black h-12 text-xs shadow-2xl relative z-10 hover:bg-zinc-50 transition-all">Unlock Intelligence</Button>
           </div>
        </div>
      </div>
    </motion.div>
  )
}

function JobConsoleCard({ job, index }: { job: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/recruiter/jobs/${job.id}`} className="block group">
        <Card className="premium-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-card/40">
           <div className="flex items-center gap-8 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:sapphire-gradient group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/5">
                 <Briefcase className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                 <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">{job.title}</h3>
                 <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {job._count.applications} Profiles</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="badge-premium bg-primary/5 text-primary border-primary/10">{job.status}</div>
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <ChevronRight className="w-6 h-6" />
              </div>
           </div>
        </Card>
      </Link>
    </motion.div>
  )
}

function StatBox({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card className="premium-card p-10 text-center flex flex-col items-center group bg-card/40">
       <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:sapphire-gradient group-hover:text-white transition-all duration-500 mb-6 shadow-md shadow-primary/5">
          {icon}
       </div>
       <div className="text-5xl font-black mb-3 tracking-tighter">{value}</div>
       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{label}</p>
    </Card>
  )
}
