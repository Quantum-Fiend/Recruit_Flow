'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getRecruiterDashboardAction } from "@/app/actions/recruiter"
import { Briefcase, Users, FileText, Plus, ChevronRight, LayoutDashboard, Search, Filter, TrendingUp, UserPlus, Zap, Target } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getJobTypeLabel, formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function RecruiterDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col w-full animate-slide-up"
    >
      {/* Dashboard Header */}
      <header className="w-full mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                 <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Talent Console</span>
           </div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">Command <span className="opacity-30">Center</span></h1>
           <p className="text-xl text-muted-foreground font-medium">Enterprise talent acquisition and pipeline management.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <Link href="/recruiter/jobs/new">
              <Button className="h-16 px-10 rounded-2xl bg-foreground text-background font-black hover:opacity-90 shadow-2xl shadow-foreground/10 flex items-center gap-3">
                <Plus className="w-6 h-6" />
                <span>Deploy New Opening</span>
              </Button>
           </Link>
        </div>
      </header>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl glass" />)
        ) : (
          <>
            <StatBox label="Active Roles" value={stats.activeJobsCount} icon={<Briefcase />} />
            <StatBox label="Incoming Flow" value={stats.totalApplicationsCount} icon={<TrendingUp />} />
            <StatBox label="Awaiting Review" value={stats.pendingApplicationsCount} icon={<UserPlus />} />
            <StatBox label="Hiring Velocity" value="84%" icon={<Zap />} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Openings Feed */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-2xl font-black tracking-tight">Deployment Pipeline</h2>
              <Link href="/recruiter/jobs" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                View All Missions
              </Link>
           </div>
           
           {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <Skeleton key={i} className="h-44 rounded-3xl glass" />)}
             </div>
           ) : stats.recentJobs.length === 0 ? (
             <div className="text-center py-32 glass border-dashed flex flex-col items-center">
                <Briefcase className="w-16 h-16 mb-6 text-muted-foreground/20" />
                <h3 className="text-2xl font-black mb-2">No active missions</h3>
                <Link href="/recruiter/jobs/new">
                   <Button variant="outline" className="mt-6 rounded-xl font-black px-8 h-12">Create First Job</Button>
                </Link>
             </div>
           ) : (
             <div className="space-y-4">
               {stats.recentJobs.map((job: any, index: number) => (
                 <JobConsoleCard key={job.id} job={job} index={index} />
               ))}
             </div>
           )}
        </div>

        {/* Global Pipeline Activity */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
           </div>
           
           <div className="glass p-8 space-y-8">
              {loading ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : stats.recentApplications.length === 0 ? (
                <p className="text-center text-muted-foreground font-medium py-10">Waiting for talent input...</p>
              ) : (
                <div className="space-y-8 relative">
                   <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border/50" />
                   {stats.recentApplications.map((app: any, index: number) => (
                     <div key={app.id} className="flex gap-6 relative group">
                        <div className="w-5 h-5 rounded-full bg-background border-2 border-foreground/20 mt-1 relative z-10 group-hover:border-foreground transition-colors" />
                        <div className="flex-1 space-y-1">
                           <p className="text-sm font-bold">
                             <span className="text-foreground">{app.applicant.name}</span>
                             <span className="text-muted-foreground font-medium"> applied for </span>
                             <span className="text-foreground">{app.job.title}</span>
                           </p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{formatDate(app.appliedAt)}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
           
           {/* CTA Card */}
           <div className="glass p-8 bg-foreground/5 flex flex-col gap-6 group overflow-hidden relative">
              <Sparkles className="w-12 h-12 text-foreground/10 absolute -top-2 -right-2 rotate-12 group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-xl font-black tracking-tight leading-tight">Automate Your <br />Selection Flow</h3>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">Leverage RecruitFlow's intelligent filtering to find the perfect candidate 70% faster.</p>
              <Button className="w-full rounded-xl bg-foreground text-background font-black h-12 text-xs">Unlock Intelligence</Button>
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
        <Card className="glass glass-hover p-8 border-none flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-700">
                 <Briefcase className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-black tracking-tighter">{job.title}</h3>
                 <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <span>{job.location}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {job._count.applications} Profiles</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="badge-premium">{job.status}</div>
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
           </div>
        </Card>
      </Link>
    </motion.div>
  )
}

function StatBox({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card className="glass glass-hover p-8 text-center border-none flex flex-col items-center group">
       <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-500 mb-6">
          {icon}
       </div>
       <div className="text-4xl font-black mb-2 tracking-tighter">{value}</div>
       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
    </Card>
  )
}
