'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJobByIdAction } from "@/app/actions/jobs"
import { getMyApplicationsAction, withdrawApplicationAction } from "@/app/actions/applications"
import { getJobTypeLabel, getEmploymentTypeLabel, formatDate } from "@/lib/utils"
import { MapPin, Briefcase, Clock, ArrowLeft, ArrowRight, Share2, Shield, Globe, Users, ChevronRight, Sparkles, Target, Zap, Globe2, XCircle, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface JobDetails {
  id: string
  title: string
  description: string
  location: string
  type: string
  employmentType: string
  experienceLevel: string
  skills: string[]
  status: string
  createdAt: Date
  recruiter: {
    name: string
  }
  _count: {
    applications: number
  }
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<{ id: string; status: string } | null>(null)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    let ignore = false;
    
    async function init() {
      const [jobResult, appsResult] = await Promise.all([
        getJobByIdAction(params.id as string),
        session?.user ? getMyApplicationsAction() : Promise.resolve({ success: false, applications: [] })
      ])

      if (!ignore) {
        if (jobResult.success && jobResult.job) {
          setJob(jobResult.job as JobDetails)
        }

        if (appsResult.success && appsResult.applications) {
          const existingApp = (appsResult.applications as any[]).find(a => a.jobId === params.id)
          if (existingApp) {
            setApplication({ id: existingApp.id, status: existingApp.status })
          }
        }
        setLoading(false)
      }
    }

    init()
    return () => { ignore = true }
  }, [params.id, session])

  const handleApply = () => {
    router.push(`/jobs/${params.id}/apply`)
  }

  const handleWithdraw = async () => {
    if (!application) return
    
    setWithdrawing(true)
    const result = await withdrawApplicationAction(application.id)
    
    if (result.success) {
      toast.success("Application Withdrawn")
      setApplication(prev => prev ? { ...prev, status: "WITHDRAWN" } : null)
    } else {
      toast.error(result.error || "Failed to withdraw")
    }
    setWithdrawing(false)
  }

  if (loading) {
    return (
      <div className="premium-container py-20 space-y-12">
         <Skeleton className="h-80 w-full rounded-[3rem] glass-panel opacity-40" />
         <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
               <Skeleton className="h-[500px] w-full rounded-[3rem] glass-panel opacity-40" />
               <Skeleton className="h-60 w-full rounded-[3rem] glass-panel opacity-40" />
            </div>
            <Skeleton className="h-[700px] w-full rounded-[3rem] glass-panel opacity-40" />
         </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="premium-container py-40 flex flex-col items-center justify-center text-center">
         <div className="w-24 h-24 glass-panel rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl">
            <Briefcase className="w-12 h-12 text-muted-foreground/40" />
         </div>
         <h1 className="h-lg text-gradient mb-8">Position Null.</h1>
         <p className="text-xl text-muted-foreground mb-12 max-w-md font-medium opacity-60">The target job specification is no longer active in the RecruitFlow ecosystem.</p>
         <Link href="/jobs">
            <Button className="btn-quantum px-12 h-16 shadow-2xl">Return to Pipeline</Button>
         </Link>
      </div>
    )
  }

  return (
    <div className="page-wrapper animate-reveal px-6">
      {/* Navigation & Technical Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
         <Link href="/jobs">
            <Button variant="ghost" className="rounded-xl h-12 px-6 group font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-foreground">
               <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
               Return to Pipeline
            </Button>
         </Link>
         
         <div className="flex items-center gap-6">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">Payload-ID: {job.id.split('-')[0]}</div>
            <Button variant="outline" className="h-12 w-12 rounded-2xl border-border/50 hover:bg-secondary p-0 shadow-sm transition-all">
               <Share2 className="w-5 h-5" />
            </Button>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 items-start w-full mb-40">
         {/* Main Technical Specs */}
         <div className="lg:col-span-2 space-y-12">
            {/* Header Identity */}
            <div className="premium-card p-12 md:p-16 glass-panel border-border/40 group overflow-hidden relative">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
               
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16">
                  <div className="space-y-8">
                     <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground shadow-2xl group-hover:bg-foreground group-hover:text-background transition-all duration-700">
                        <Briefcase className="w-10 h-10" />
                     </div>
                     <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-balance">{job.title}</h1>
                  </div>
                  <div className="flex flex-col items-end gap-4 shrink-0">
                     <div className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20 shadow-xl">{job.status}</div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{formatDate(job.createdAt)}</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-12 border-t border-border/40">
                  <SpecItem icon={<MapPin className="w-5 h-5" />} label="Target Location" value={job.location} />
                  <SpecItem icon={<Clock className="w-5 h-5" />} label="Commitment" value={getJobTypeLabel(job.type)} />
                  <SpecItem icon={<Target className="w-5 h-5" />} label="Seniority Level" value={job.experienceLevel} />
               </div>
            </div>

            {/* Description Body */}
            <div className="premium-card p-12 md:p-16 glass-panel border-border/40">
               <h2 className="text-[10px] font-black mb-12 tracking-[0.4em] uppercase text-muted-foreground/40">Mission Briefing</h2>
               <div className="prose prose-invert max-w-none">
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap opacity-80">
                     {job.description}
                  </p>
               </div>
            </div>

            {/* Competencies */}
            <div className="premium-card p-12 md:p-16 glass-panel border-border/40">
               <div className="flex items-center gap-4 mb-12">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground/40">Required Competencies</h2>
               </div>
               <div className="flex flex-wrap gap-4">
                  {job.skills.map((skill: string) => (
                     <div key={skill} className="px-8 py-3.5 rounded-2xl bg-foreground/[0.03] border border-border/50 text-[11px] font-black tracking-widest uppercase hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default shadow-sm">
                        {skill}
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Strategic Action Sidebar */}
         <aside className="space-y-10 sticky top-32">
            <div className="premium-card p-10 md:p-12 glass-panel border-border/40 space-y-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 sapphire-gradient opacity-50" />
               
               <div className="space-y-4 text-center">
                  <h3 className="text-3xl font-black tracking-tighter">Initialize Deployment</h3>
                  <p className="text-base text-muted-foreground font-medium opacity-60 text-balance">Begin your recruitment sequence for this position.</p>
               </div>

               {application && application.status !== "WITHDRAWN" ? (
                  <Button 
                    onClick={handleWithdraw} 
                    disabled={withdrawing || application.status === "REJECTED"}
                    variant="outline"
                    className="w-full h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/40 transition-all shadow-sm"
                  >
                    <span className="flex items-center gap-4">
                      {withdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                      {withdrawing ? "Processing..." : "Withdraw Payload"}
                    </span>
                  </Button>
               ) : (
                  <Button 
                    onClick={handleApply} 
                    disabled={job.status !== "OPEN" || (application?.status === "WITHDRAWN")}
                    className="w-full h-20 rounded-2xl btn-quantum shadow-2xl group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-black">
                      {application?.status === "WITHDRAWN" ? "Sequence Terminated" : job.status === "OPEN" ? "Initialize Application" : "Position Inactive"}
                      {application?.status !== "WITHDRAWN" && job.status === "OPEN" && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />}
                    </span>
                  </Button>
               )}

               <div className="space-y-10 pt-4">
                  <SidebarInsight 
                     icon={<Globe2 className="w-6 h-6" />} 
                     title="Global Operations" 
                     desc="Fully supports asynchronous, distributed technical contribution." 
                  />
                  <SidebarInsight 
                     icon={<Shield className="w-6 h-6" />} 
                     title="Verified Specs" 
                     desc="Endorsed by RecruitFlow corporate engineering integrity protocols." 
                  />
                  <SidebarInsight 
                     icon={<Users className="w-6 h-6" />} 
                     title="High Activity" 
                     desc={`${job._count.applications}+ active telemetry streams currently in screening.`} 
                  />
               </div>

               <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl -z-10" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Lead Intelligence</p>
                  <p className="text-sm font-bold leading-relaxed text-foreground/80 opacity-90">
                    Orchestrated by <span className="text-primary font-black underline underline-offset-4 decoration-primary/30">{job.recruiter.name}</span>. 
                    Expect high-density technical feedback sequences.
                  </p>
               </div>
            </div>

            <div className="px-10 text-center opacity-20">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed">Secured via Quantum-Slate Protocols</p>
            </div>
         </aside>
      </div>
    </div>
  )
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-3">
       <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
          <span className="text-primary/40">{icon}</span>
          <span>{label}</span>
       </div>
       <div className="text-xl font-black tracking-tighter leading-tight">{value}</div>
    </div>
  )
}

function SidebarInsight({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-6 group/insight">
       <div className="w-12 h-12 rounded-2xl bg-foreground/[0.03] flex items-center justify-center text-muted-foreground/40 group-hover/insight:bg-primary/10 group-hover/insight:text-primary transition-all duration-700 shrink-0 shadow-sm">
          {icon}
       </div>
       <div className="space-y-1.5">
          <p className="text-sm font-black tracking-tight">{title}</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-60">{desc}</p>
       </div>
    </div>
  )
}
