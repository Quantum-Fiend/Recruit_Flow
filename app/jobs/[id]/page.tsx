'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJobByIdAction } from "@/app/actions/jobs"
import { getJobTypeLabel, getEmploymentTypeLabel, formatDate } from "@/lib/utils"
import { MapPin, Briefcase, Clock, ArrowLeft, ArrowRight, Share2, Shield, Globe, Users, ChevronRight, Sparkles, Target, Zap, Globe2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

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
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false;
    
    async function init() {
      const result = await getJobByIdAction(params.id as string)
      if (!ignore) {
        if (result.success && result.job) {
          setJob(result.job as JobDetails)
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
      className="max-w-[1300px] mx-auto py-12 md:py-20 px-6"
    >
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
         <Link href="/jobs">
            <Button variant="ghost" className="rounded-2xl h-12 px-6 group font-bold text-muted-foreground hover:text-foreground">
               <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
               Back to Pipeline
            </Button>
         </Link>
         
         <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 w-12 rounded-xl border-border hover:bg-foreground/5 p-0">
               <Share2 className="w-5 h-5" />
            </Button>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID: {job.id.split('-')[0]}</div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
         {/* Main Technical Specs */}
         <div className="lg:col-span-2 space-y-10">
            {/* Header Identity */}
            <Card className="glass-morphism creative-card p-10 border-none group overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
               
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">
                  <div className="space-y-6">
                     <div className="w-20 h-20 sapphire-gradient rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                        <Briefcase className="w-10 h-10" />
                     </div>
                     <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{job.title}</h1>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                     <div className="badge-premium bg-primary/5 text-primary border-primary/10">{job.status}</div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Updated {formatDate(job.createdAt)}</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <SpecItem icon={<MapPin />} label="Location" value={job.location} />
                  <SpecItem icon={<Clock />} label="Commitment" value={getJobTypeLabel(job.type)} />
                  <SpecItem icon={<Target />} label="Experience" value={job.experienceLevel} />
               </div>
            </Card>

            {/* Description Body */}
            <Card className="glass-morphism p-12 border-none">
               <h2 className="text-3xl font-black mb-8 tracking-tight">Mission Objective</h2>
               <div className="prose prose-sapphire dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                     {job.description}
                  </p>
               </div>
            </Card>

            {/* Competencies */}
            <Card className="glass-morphism p-12 border-none">
               <div className="flex items-center gap-4 mb-10">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-black tracking-tight">Required Competencies</h2>
               </div>
               <div className="flex flex-wrap gap-4">
                  {job.skills.map((skill: string) => (
                     <div key={skill} className="px-6 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-sm font-black tracking-tight hover:border-primary/30 transition-all">
                        {skill}
                     </div>
                  ))}
               </div>
            </Card>
         </div>

         {/* Strategic Action Sidebar */}
         <aside className="space-y-8 sticky top-32">
            <Card className="glass-morphism p-10 border-none space-y-10 shadow-2xl">
               <div className="space-y-3 text-center">
                  <h3 className="text-2xl font-black tracking-tight">Deploy Profile</h3>
                  <p className="text-sm text-muted-foreground font-medium">Initialize your application for this position.</p>
               </div>

               <Button 
                  onClick={handleApply} 
                  disabled={job.status !== "OPEN"}
                  className="w-full h-20 rounded-[2rem] text-xl font-black sapphire-gradient text-white shadow-2xl shadow-primary/20 group overflow-hidden"
               >
                  <span className="relative z-10 flex items-center gap-3">
                     {job.status === "OPEN" ? "Initialize Application" : "Mission Closed"}
                     <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </span>
               </Button>

               <div className="space-y-8 pt-4">
                  <SidebarInsight 
                     icon={<Globe2 className="w-5 h-5" />} 
                     title="Distributed Ready" 
                     desc="This role supports asynchronous workflows and global contribution." 
                  />
                  <SidebarInsight 
                     icon={<Shield className="w-5 h-5" />} 
                     title="Verified Mission" 
                     desc="Endorsed by RecruitFlow corporate integrity protocols." 
                  />
                  <SidebarInsight 
                     icon={<Users className="w-5 h-5" />} 
                     title="Active Pipeline" 
                     desc={`${job._count.applications}+ talent profiles currently in screening.`} 
                  />
               </div>

               <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Enterprise Insight</p>
                  <p className="text-xs font-bold leading-relaxed text-muted-foreground">
                    This position is managed by <span className="text-foreground">{job.recruiter.name}</span>. 
                    They are prioritizing candidates with high technical autonomy.
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
    <div className="space-y-3">
       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span className="text-primary/60">{icon}</span>
          <span>{label}</span>
       </div>
       <div className="text-xl font-black tracking-tight">{value}</div>
    </div>
  )
}

function SidebarInsight({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-5 group">
       <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
          {icon}
       </div>
       <div className="space-y-1">
          <p className="text-sm font-black">{title}</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}
