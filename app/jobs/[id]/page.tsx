'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJobByIdAction } from "@/app/actions/jobs"
import { getJobTypeLabel, getEmploymentTypeLabel, formatDate } from "@/lib/utils"
import { MapPin, Briefcase, Clock, ArrowLeft, Share2, Shield, Globe, Users, ChevronRight, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

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
      <div className="container-wide py-20 space-y-8">
         <Skeleton className="h-40 w-full rounded-[3rem] glass" />
         <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
               <Skeleton className="h-64 w-full rounded-[2rem] glass" />
               <Skeleton className="h-40 w-full rounded-[2rem] glass" />
            </div>
            <Skeleton className="h-96 w-full rounded-[2rem] glass" />
         </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container-wide py-32 flex flex-col items-center justify-center text-center">
         <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8">
            <Briefcase className="w-12 h-12 text-muted-foreground" />
         </div>
         <h1 className="text-4xl font-black mb-4">Position Unavailable</h1>
         <p className="text-lg text-muted-foreground mb-10 max-w-md">The job listing you are looking for has been removed or is no longer active.</p>
         <Link href="/jobs">
            <Button size="lg" className="rounded-2xl px-10 h-14">Return to Job Listings</Button>
         </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="container-wide py-12 md:py-20 flex-1">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 animate-fade-in">
           <Link href="/jobs">
              <Button variant="ghost" className="rounded-xl h-10 px-4 group">
                 <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                 Back to Search
              </Button>
           </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
           {/* Main Content */}
           <div className="lg:col-span-2 space-y-8 animate-fade-in [animation-delay:100ms]">
              {/* Header Card */}
              <Card className="glass border-white/10 rounded-[2.5rem] p-4 md:p-8 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
                 <CardHeader className="p-0 mb-8">
                    <div className="flex items-start justify-between gap-6 mb-8">
                       <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20">
                          <Briefcase className="w-10 h-10" />
                       </div>
                       <div className="flex gap-2">
                          <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-border/50 hover:bg-accent">
                             <Share2 className="w-5 h-5" />
                          </Button>
                       </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{job.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-muted-foreground font-medium mb-8">
                       <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary/70" /> {job.location}</span>
                       <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary/70" /> Posted {formatDate(job.createdAt)}</span>
                       <span className="flex items-center gap-2"><Users className="w-5 h-5 text-primary/70" /> {job._count.applications} applicants</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                       <Badge variant="secondary" className="rounded-full px-4 py-1 bg-primary/10 text-primary border-primary/20 uppercase text-[10px] tracking-widest font-bold">
                          {getJobTypeLabel(job.type)}
                       </Badge>
                       <Badge variant="secondary" className="rounded-full px-4 py-1 bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase text-[10px] tracking-widest font-bold">
                          {getEmploymentTypeLabel(job.employmentType)}
                       </Badge>
                       <Badge variant="secondary" className="rounded-full px-4 py-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[10px] tracking-widest font-bold">
                          {job.experienceLevel}
                       </Badge>
                    </div>
                 </CardHeader>

                 <div className="h-px bg-border/50 mb-8" />

                 <div className="space-y-4">
                    <h2 className="text-2xl font-bold">About the Role</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                       {job.description}
                    </p>
                 </div>
              </Card>

              {/* Skills Card */}
              <Card className="glass border-white/10 rounded-[2.5rem] p-8">
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-500" /> Key Competencies
                 </h2>
                 <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill: string) => (
                       <Badge key={skill} variant="outline" className="rounded-xl px-5 py-2 text-sm font-bold border-border/50 hover:border-primary/50 transition-colors">
                          {skill}
                       </Badge>
                    ))}
                 </div>
              </Card>
           </div>

           {/* Sidebar Actions */}
           <aside className="space-y-8 animate-fade-in [animation-delay:200ms]">
              <Card className="glass border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 sticky top-24">
                 <div className="space-y-2">
                    <h3 className="text-xl font-bold">Ready to apply?</h3>
                    <p className="text-sm text-muted-foreground font-medium">Join a growing team and make an impact.</p>
                 </div>
                 
                 <Button 
                    size="lg" 
                    onClick={handleApply} 
                    disabled={job.status !== "OPEN"}
                    className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group"
                 >
                    {job.status === "OPEN" ? (
                       <>
                          Apply for this position
                          <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                       </>
                    ) : "Application Closed"}
                 </Button>

                 <div className="h-px bg-border/50" />

                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Shield className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold">Verified Listing</p>
                          <p className="text-xs text-muted-foreground mt-0.5">This job was posted directly by the company recruiter.</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Globe className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold">Location Aware</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{job.location} based role with remote flexibility options.</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Company Insights</p>
                    <p className="text-sm font-medium leading-relaxed">
                       You're viewing a role at <span className="text-primary font-bold">{job.recruiter.name}'s</span> organization. 
                       Their team is currently hiring across {job.location}.
                    </p>
                 </div>
              </Card>
           </aside>
        </div>
      </div>
    </div>
  )
}
