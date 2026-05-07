'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getJobsAction } from "@/app/actions/jobs"
import { getJobTypeLabel, getEmploymentTypeLabel } from "@/lib/utils"
import { Briefcase, MapPin, Clock, Search, Filter, Sparkles, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Job {
  id: string
  title: string
  description: string
  location: string
  type: string
  employmentType: string
  experienceLevel: string
  skills: string[]
  _count: {
    applications: number
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let ignore = false;
    
    async function loadJobs() {
      setLoading(true)
      const result = await getJobsAction({ search })
      if (!ignore) {
        if (result.success && result.jobs) {
          setJobs(result.jobs)
        }
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      loadJobs()
    }, 400) // Slightly faster debounce

    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [search])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container-wide py-12 md:py-20 flex-1">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
            <Sparkles className="w-3 h-3" />
            <span>EXPLORE OPPORTUNITIES</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Find Your <span className="gradient-text">Next Chapter</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover a variety of professional roles across leading companies. 
            Filtered and curated just for you.
          </p>

          {/* Search Bar Refined */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-hover:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search jobs by title, skills, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-14 h-16 text-lg rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button size="sm" className="rounded-xl h-10 px-4 bg-primary hover:bg-primary/90">
                   Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
           {/* Filters Sidebar (Optional/Placeholder) */}
           <aside className="hidden lg:block w-64 space-y-8 animate-fade-in [animation-delay:200ms]">
              <div className="space-y-4">
                 <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                 </h3>
                 <div className="h-px bg-border/50" />
                 <div className="space-y-2">
                    <p className="text-sm font-medium">Job Type</p>
                    <div className="flex flex-wrap gap-2">
                       {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => (
                          <Badge key={t} variant="secondary" className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">{t}</Badge>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="glass rounded-2xl p-6 border-primary/10">
                 <h4 className="font-bold mb-2">Job Alerts</h4>
                 <p className="text-xs text-muted-foreground mb-4">Never miss an opportunity. Get notified about new jobs.</p>
                 <Button className="w-full text-xs h-8 rounded-lg" variant="outline">Set Up Alert</Button>
              </div>
           </aside>

           {/* Jobs List */}
           <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between mb-2 px-2">
                 <h2 className="font-bold text-lg">
                    {loading ? "Searching..." : `${jobs.length} Positions Available`}
                 </h2>
                 <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs">Recently Added</Button>
                 </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[1, 2, 4, 5, 6].map(i => (
                     <Skeleton key={i} className="h-64 w-full rounded-[2rem] glass" />
                   ))}
                </div>
              ) : jobs.length === 0 ? (
                <Card className="glass border-dashed border-2 border-border/50 text-center py-24 rounded-[3rem]">
                  <CardContent>
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                       Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <Button variant="outline" onClick={() => setSearch("")} className="rounded-xl">Clear Search</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="group block h-full">
      <Card className="glass border-white/10 rounded-[2rem] p-4 h-full flex flex-col hover-card overflow-hidden">
        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between gap-4 mb-4">
             <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
             </div>
             <Badge className="rounded-full px-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase text-[10px] tracking-widest font-bold">
               {getJobTypeLabel(job.type)}
             </Badge>
          </div>
          
          <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-1">{job.title}</CardTitle>
          <CardDescription className="flex items-center gap-3 mt-2 font-medium">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary/70" /> {job.location}</span>
            <span className="w-1 h-1 bg-muted rounded-full" />
            <span className="flex items-center gap-1.5">{getEmploymentTypeLabel(job.employmentType)}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
            {job.description}
          </p>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-[10px] rounded-lg bg-accent/50 text-muted-foreground px-2 py-0.5">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="ghost" className="text-[10px] px-0 text-muted-foreground">
                  +{job.skills.length - 3} more
                </Badge>
              )}
            </div>

            <div className="h-px bg-border/50" />

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/70">
                  <span className="flex items-center gap-1.5 uppercase tracking-tighter"><Clock className="w-3.5 h-3.5" /> {job._count.applications} Applicants</span>
               </div>
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ChevronRight className="w-5 h-5" />
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
