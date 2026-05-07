'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getJobsAction } from "@/app/actions/jobs"
import { Briefcase, Users, TrendingUp, Plus, LayoutDashboard, Sparkles, ChevronRight, ArrowUpRight, Search, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"

interface RecentJob {
  id: string
  title: string
  location: string
  status: string
  createdAt: Date
  _count: {
    applications: number
  }
}

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
  })
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false;

    async function init() {
      const result = await getJobsAction({})
      if (!ignore && result.success && result.jobs) {
        const jobs = result.jobs as RecentJob[]
        const openJobs = jobs.filter((j) => j.status === "OPEN")
        const totalApplications = jobs.reduce((sum, j) => sum + j._count.applications, 0)

        setStats({
          totalJobs: jobs.length,
          openJobs: openJobs.length,
          totalApplications,
        })
        setRecentJobs(jobs.slice(0, 5))
        setLoading(false)
      }
    }

    init()
    return () => { ignore = true }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-accent/30 border-b border-border py-12 md:py-16">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
             <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <LayoutDashboard className="w-6 h-6" />
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                     Talent <span className="gradient-text">Console</span>
                   </h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Monitor your hiring lifecycle, manage job listings, and find your next top performer.
                </p>
             </div>
             
             <Link href="/recruiter/jobs/new">
                <Button size="lg" className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-bold group">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Job Listing
                  <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
             </Link>
          </div>
        </div>
      </div>

      <div className="container-wide py-12 flex-1">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in [animation-delay:100ms]">
          <MetricCard
            icon={<Briefcase className="w-6 h-6" />}
            title="Active Listings"
            value={stats.openJobs}
            trend="+12% from last month"
            color="text-primary"
          />
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            title="Total Candidates"
            value={stats.totalApplications}
            trend="+24 new today"
            color="text-blue-500"
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Hiring Velocity"
            value="14 Days"
            trend="-2 days improvement"
            color="text-emerald-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start animate-fade-in [animation-delay:200ms]">
          {/* Recent Listings Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Recent Job Postings
               </h2>
               <Link href="/recruiter/jobs">
                  <Button variant="ghost" size="sm" className="text-primary font-bold">View Pipeline <ChevronRight className="w-4 h-4 ml-1" /></Button>
               </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl glass" />)}
              </div>
            ) : recentJobs.length === 0 ? (
              <Card className="glass border-dashed border-2 border-border/50 text-center py-20 rounded-[3rem]">
                <CardContent>
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">No jobs posted yet</h3>
                  <p className="text-muted-foreground mb-6">Start building your team today.</p>
                  <Link href="/recruiter/jobs/new">
                    <Button className="rounded-xl">Create First Job</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <JobListItem key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions / Activity Feed Sidebar */}
          <aside className="space-y-8">
             <Card className="glass border-white/10 rounded-[2.5rem] p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <Plus className="w-5 h-5 text-primary" /> Hiring Toolkit
                </h3>
                <div className="space-y-3">
                   <QuickAction icon={<Search />} label="Search Candidates" />
                   <QuickAction icon={<Users />} label="Team Collaboration" />
                   <QuickAction icon={<Filter />} label="Workflow Settings" />
                   <QuickAction icon={<TrendingUp />} label="Recruiting Reports" />
                </div>
             </Card>

             <Card className="glass border-white/10 rounded-[2.5rem] p-6">
                <h3 className="text-lg font-bold mb-6">System Health</h3>
                <div className="space-y-4">
                   <HealthMetric label="API Performance" value="99.9%" />
                   <HealthMetric label="Database Sync" value="Optimized" />
                   <HealthMetric label="Email Delivery" value="Enabled" />
                </div>
             </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, title, value, trend, color }: { icon: React.ReactNode; title: string; value: number | string; trend: string; color: string }) {
  return (
    <Card className="glass border-white/10 rounded-[2.5rem] p-8 hover-card relative overflow-hidden group">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
      <div className="flex items-center justify-between mb-8">
        <div className={cn("w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center", color)}>
          {icon}
        </div>
        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{title}</h4>
        <div className="text-4xl font-black mb-2 tracking-tight">{value}</div>
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{trend}</p>
      </div>
    </Card>
  )
}

function JobListItem({ job }: { job: RecentJob }) {
  return (
    <Link href={`/recruiter/jobs/${job.id}/applicants`} className="group block">
      <Card className="glass border-white/10 rounded-[2rem] p-6 hover-card transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
              <p className="text-sm text-muted-foreground font-medium">
                {job.location} • Posted {formatDate(job.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
               <div className="text-xl font-black">{job._count.applications}</div>
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Candidates</div>
            </div>
            <div className="h-10 w-px bg-border/50 hidden sm:block" />
            <Badge className="hidden sm:flex rounded-full px-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[10px] tracking-widest font-bold">
               {job.status}
            </Badge>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  )
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all">
       <span className="opacity-70">{icon}</span>
       <span className="font-bold text-sm">{label}</span>
    </Button>
  )
}

function HealthMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
       <span className="text-muted-foreground font-medium">{label}</span>
       <span className="font-bold text-primary">{value}</span>
    </div>
  )
}

