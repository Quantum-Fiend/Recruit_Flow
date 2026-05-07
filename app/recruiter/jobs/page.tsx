'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJobsAction, closeJobAction } from "@/app/actions/jobs"
import { getStatusColor, getJobTypeLabel, formatDate } from "@/lib/utils"
import { Plus, MapPin, Users, Briefcase, ChevronRight, Activity, Zap, Globe, ArrowLeft, Target, Eye, XCircle } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface RecruiterJob {
  id: string
  title: string
  location: string
  type: string
  status: string
  createdAt: Date
  _count: {
    applications: number
  }
}

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([])
  const [loading, setLoading] = useState(true)

  const loadJobs = useCallback(async () => {
    setLoading(true)
    const result = await getJobsAction({})
    if (result.success && result.jobs) {
      setJobs(result.jobs as RecruiterJob[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const handleCloseJob = async (jobId: string) => {
    if (!confirm("Decommission this job deployment? This will halt all incoming telemetry.")) return

    const result = await closeJobAction(jobId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Deployment Decommissioned")
      loadJobs()
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-wrapper animate-slide-up"
    >
      {/* Header Section */}
      <header className="w-full mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-2xl space-y-6">
           <Link href="/recruiter/dashboard">
              <Button variant="ghost" className="rounded-2xl h-10 px-4 group font-bold text-muted-foreground hover:text-foreground mb-4">
                 <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                 Back to Console
              </Button>
           </Link>
           <h1 className="h-lg text-sapphire">Mission <br /><span className="text-primary">Archives.</span></h1>
           <p className="text-xl text-muted-foreground font-medium">Historical and active recruitment sequences within your jurisdiction.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <Link href="/recruiter/jobs/new">
              <Button className="btn-sapphire h-14 px-8 shadow-xl shadow-primary/10">
                <Plus className="w-5 h-5 mr-2" />
                New Deployment
              </Button>
           </Link>
        </div>
      </header>

      {/* Grid Content */}
      <div className="w-full mb-32">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48 w-full rounded-[2.5rem] glass-morphism" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-40 glass-morphism w-full border-dashed rounded-[3rem] flex flex-col items-center">
            <Briefcase className="w-16 h-16 mb-8 text-muted-foreground/10" />
            <h3 className="text-3xl font-black mb-4 tracking-tight">Archives empty</h3>
            <p className="text-xl text-muted-foreground mb-12 max-w-sm font-medium">No historical or active missions were detected in your records.</p>
            <Link href="/recruiter/jobs/new">
              <Button className="btn-sapphire px-12 h-16">Initialize First Sequence</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {jobs.map((job, index) => (
                <RecruiterJobCard key={job.id} job={job} index={index} onClose={handleCloseJob} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function RecruiterJobCard({ job, index, onClose }: { job: RecruiterJob; index: number; onClose: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="glass-morphism creative-card p-2 border-none group">
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center gap-8 flex-1">
             <div className="w-20 h-20 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:sapphire-gradient group-hover:text-white transition-all duration-700 shadow-xl shadow-primary/5">
                <Briefcase className="w-10 h-10" />
             </div>
             <div className="space-y-3">
               <div className="flex items-center gap-4 flex-wrap">
                 <h3 className="text-3xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">{job.title}</h3>
                 <div className={cn("badge-premium", getStatusColor(job.status))}>
                   {job.status}
                 </div>
               </div>
               <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                 <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</span>
                 <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {job._count.applications} Profiles Ingested</span>
                 <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> Active since {formatDate(job.createdAt)}</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
             <Link href={`/recruiter/jobs/${job.id}/applicants`}>
                <Button className="h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest sapphire-gradient text-white shadow-lg shadow-primary/20">
                   Analyze Talent
                </Button>
             </Link>
             
             <Link href={`/jobs/${job.id}`}>
                <Button variant="ghost" className="h-12 w-12 rounded-xl bg-foreground/5 hover:bg-foreground/10 p-0" title="Preview Perspective">
                   <Eye className="w-5 h-5" />
                </Button>
             </Link>

             {job.status === "OPEN" && (
               <Button 
                 variant="ghost" 
                 className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all p-0"
                 onClick={() => onClose(job.id)}
                 title="Decommission Deployment"
               >
                 <XCircle className="w-5 h-5" />
               </Button>
             )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
