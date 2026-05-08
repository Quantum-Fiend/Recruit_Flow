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
  }, [params.id])

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
      <div className="max-w-[1200px] mx-auto py-20 px-6 space-y-12">
         <Skeleton className="h-64 w-full rounded-[3rem] glass-morphism" />
         <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
               <Skeleton className="h-96 w-full rounded-[2.5rem] glass-morphism" />
               <Skeleton className="h-40 w-full rounded-[2.5rem] glass-morphism" />
            </div>
            <Skeleton className="h-[600px] w-full rounded-[2.5rem] glass-morphism" />
         </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-[1200px] mx-auto py-40 flex flex-col items-center justify-center text-center px-6">
         <div className="w-24 h-24 bg-foreground/5 rounded-[2.5rem] flex items-center justify-center mb-10">
            <Briefcase className="w-12 h-12 text-muted-foreground" />
         </div>
         <h1 className="h-lg text-sapphire mb-6">Position Null.</h1>
         <p className="text-xl text-muted-foreground mb-12 max-w-md font-medium">The target job specification is no longer active in the RecruitFlow ecosystem.</p>
         <Link href="/jobs">
            <Button className="btn-sapphire px-12 h-16">Return to Pipeline</Button>
         </Link>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-wrapper animate-slide-up"
    >
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
         <Link href="/jobs">
            <Button variant="ghost" className="rounded-xl h-12 px-6 group font-bold text-muted-foreground hover:text-foreground">
               <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
               Back to Pipeline
            </Button>
         </Link>
         
         <div className="flex items-center gap-4">
            <Button variant="outline" className="h-10 w-10 rounded-lg border-border hover:bg-secondary p-0">
               <Share2 className="w-4 h-4" />
            </Button>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Spec ID: {job.id.split('-')[0]}</div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
         {/* Main Technical Specs */}
         <div className="lg:col-span-2 space-y-10">
            {/* Header Identity */}
            <Card className="premium-card p-10 group overflow-hidden bg-card/40">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
               
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">
                  <div className="space-y-6">
                     <div className="w-16 h-16 sapphire-gradient rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                        <Briefcase className="w-8 h-8" />
                     </div>
                     <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-balance">{job.title}</h1>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                     <div className="badge-premium bg-primary/5 text-primary border-primary/10 uppercase tracking-widest">{job.status}</div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{formatDate(job.createdAt)}</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-border">
                  <SpecItem icon={<MapPin className="w-4 h-4" />} label="Location" value={job.location} />
                  <SpecItem icon={<Clock className="w-4 h-4" />} label="Commitment" value={getJobTypeLabel(job.type)} />
                  <SpecItem icon={<Target className="w-4 h-4" />} label="Level" value={job.experienceLevel} />
               </div>
            </Card>

            {/* Description Body */}
            <Card className="premium-card p-12 bg-card/20">
               <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase text-muted-foreground/40">Mission Objective</h2>
               <div className="prose prose-sapphire dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                     {job.description}
                  </p>
               </div>
            </Card>

            {/* Competencies */}
            <Card className="premium-card p-12 bg-card/20">
               <div className="flex items-center gap-4 mb-10">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-black tracking-tighter uppercase text-muted-foreground/40">Competencies</h2>
               </div>
               <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill: string) => (
                     <div key={skill} className="px-5 py-2.5 rounded-xl bg-secondary border border-border text-xs font-black tracking-tight hover:border-primary/30 transition-all cursor-default">
                        {skill}
                     </div>
                  ))}
               </div>
            </Card>
         </div>

         {/* Strategic Action Sidebar */}
         <aside className="space-y-8 sticky top-32">
            <Card className="premium-card p-10 space-y-10 shadow-2xl bg-card/40">
               <div className="space-y-3 text-center">
                  <h3 className="text-2xl font-black tracking-tighter">Deploy Profile</h3>
                  <p className="text-sm text-muted-foreground font-medium text-balance">Initialize your application for this position.</p>
               </div>

               {application && application.status !== "WITHDRAWN" ? (
                  <Button 
                    onClick={handleWithdraw} 
                    disabled={withdrawing || application.status === "REJECTED"}
                    variant="outline"
                    className="w-full h-16 rounded-xl text-base font-black border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      {withdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                      {withdrawing ? "Processing..." : "Withdraw Application"}
                    </span>
                  </Button>
               ) : (
                  <Button 
                    onClick={handleApply} 
                    disabled={job.status !== "OPEN" || (application?.status === "WITHDRAWN")}
                    className="w-full h-16 rounded-xl text-base font-black sapphire-gradient text-white shadow-xl shadow-primary/20 group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {application?.status === "WITHDRAWN" ? "Application Withdrawn" : job.status === "OPEN" ? "Initialize Application" : "Mission Closed"}
                      {application?.status !== "WITHDRAWN" && job.status === "OPEN" && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
                    </span>
                  </Button>
               )}

               <div className="space-y-8 pt-4">
                  <SidebarInsight 
                     icon={<Globe2 className="w-5 h-5" />} 
                     title="Distributed Ready" 
                     desc="Supports asynchronous workflows and global contribution." 
                  />
                  <SidebarInsight 
                     icon={<Shield className="w-5 h-5" />} 
                     title="Verified Mission" 
                     desc="Endorsed by RecruitFlow corporate integrity protocols." 
                  />
                  <SidebarInsight 
                     icon={<Users className="w-5 h-5" />} 
                     title="Active Pipeline" 
                     desc={`${job._count.applications}+ profiles currently in screening.`} 
                  />
               </div>

               <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Enterprise Insight</p>
                  <p className="text-xs font-bold leading-relaxed text-muted-foreground/80">
                    This position is managed by <span className="text-foreground font-black">{job.recruiter.name}</span>. 
                    They prioritize candidates with high technical autonomy.
                  </p>
               </div>
            </Card>

            <div className="px-8 text-center opacity-30">
               <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">System protected by end-to-end encryption</p>
            </div>
         </aside>
      </div>
    </motion.div>
  )
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-2">
       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          <span className="text-primary/60">{icon}</span>
          <span>{label}</span>
       </div>
       <div className="text-lg font-black tracking-tight">{value}</div>
    </div>
  )
}

function SidebarInsight({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-5 group">
       <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all shrink-0">
          {icon}
       </div>
       <div className="space-y-1">
          <p className="text-sm font-black">{title}</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}
