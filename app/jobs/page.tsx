'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getJobsAction } from "@/app/actions/jobs"
import { Search, MapPin, Briefcase, Clock, Filter, Sparkles, ArrowRight, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getJobTypeLabel, formatDate } from "@/lib/utils"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const loadJobs = useCallback(async (query = "") => {
    setLoading(true)
    const result = await getJobsAction({ search: query })
    if (result.success && result.jobs) {
      setJobs(result.jobs)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadJobs(search)
  }

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      {/* Header Section */}
      <section className="w-full text-center mb-16 space-y-6">
        <h1 className="heading-xl text-gradient">
          Career <span className="text-white">Forge</span>
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Discover high-impact roles in world-class organizations.
        </p>
      </section>

      {/* Search Section */}
      <div className="w-full max-w-4xl mb-16">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 -z-10" />
          <div className="relative glass-panel p-2 flex items-center gap-2">
             <div className="flex-1 relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
               <Input 
                 placeholder="Search by title, role or keywords..." 
                 className="h-16 pl-14 pr-6 bg-transparent border-none text-lg font-medium focus-visible:ring-0 placeholder:text-white/20"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
             </div>
             <Button type="submit" className="btn-premium h-14 rounded-2xl px-10 text-lg hidden sm:flex">
               Search Roles
             </Button>
          </div>
        </form>
      </div>

      {/* Content Grid */}
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-[2.5rem] glass-panel" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-32 glass-panel w-full max-w-3xl mx-auto border-dashed">
            <Briefcase className="w-16 h-16 mx-auto mb-6 text-white/20" />
            <h3 className="text-2xl font-bold mb-2">No matching roles found</h3>
            <p className="text-white/40 mb-8 max-w-sm mx-auto font-medium">We couldn't find any jobs matching your criteria. Try different keywords.</p>
            <Button variant="outline" onClick={() => { setSearch(""); loadJobs(""); }} className="rounded-xl px-8 h-12 border-white/10 hover:bg-white/5 font-bold">
              View All Listings
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: any }) {
  return (
    <Link href={`/jobs/${job.id}`} className="block group h-full">
      <Card className="glass-panel h-full interactive-card border-none p-2 flex flex-col justify-between">
        <CardHeader className="p-8 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-black transition-all duration-500">
              <Briefcase className="w-7 h-7" />
            </div>
            <Badge variant="outline" className="rounded-full px-4 py-1 border-white/10 bg-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-white/70">
              {getJobTypeLabel(job.type)}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-black mb-4 tracking-tight group-hover:text-white transition-colors">
            {job.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 font-bold">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-white/60" /> {job.location}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-white/60" /> {formatDate(job.createdAt)}</span>
          </div>
        </CardHeader>
        <CardFooter className="p-8 pt-0 mt-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black">RF</div>
              <span className="text-sm font-bold text-white/60">{job.recruiter.name}</span>
           </div>
           <div className="flex items-center gap-1 text-white font-black text-sm group-hover:gap-2 transition-all">
              Apply Now <ChevronRight className="w-4 h-4" />
           </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
