'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getJobsAction } from "@/app/actions/jobs"
import { Search, MapPin, Briefcase, Clock, Filter, Sparkles, ArrowRight, ChevronRight, SlidersHorizontal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getJobTypeLabel, formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
    <div className="flex flex-col items-center w-full animate-slide-up">
      {/* Search & Filter Header */}
      <section className="w-full mb-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">The <span className="opacity-30">Pipeline</span></h1>
              <p className="text-xl text-muted-foreground font-medium">Browse active opportunities within the RecruitFlow ecosystem.</p>
           </div>
           
           <div className="flex items-center gap-3">
              <Button variant="outline" className="h-12 w-12 p-0 rounded-xl border-border bg-foreground/5">
                 <SlidersHorizontal className="w-5 h-5" />
              </Button>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filters Active</div>
           </div>
        </div>

        <form onSubmit={handleSearch} className="relative group w-full">
          <div className="relative glass h-20 px-4 flex items-center gap-4 transition-all focus-within:border-foreground/20">
             <Search className="w-6 h-6 text-muted-foreground ml-2" />
             <Input 
               placeholder="Search by title, keywords, or location..." 
               className="flex-1 h-full bg-transparent border-none text-xl font-bold focus-visible:ring-0 placeholder:text-muted-foreground/30"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
             <Button type="submit" className="h-12 px-10 rounded-xl bg-foreground text-background font-black hover:bg-foreground/90 hidden sm:flex transition-transform active:scale-95">
               Search
             </Button>
          </div>
        </form>
      </section>

      {/* Results Grid */}
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-[2rem] glass" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-40 glass w-full border-dashed">
            <h3 className="text-3xl font-black mb-4 tracking-tight">No positions found</h3>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-medium">We couldn't find any matches for your current search criteria.</p>
            <Button variant="outline" onClick={() => { setSearch(""); loadJobs(""); }} className="rounded-xl px-10 h-14 font-black border-border hover:bg-foreground/5">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <AnimatePresence>
              {jobs.map((job, index) => (
                <JobListItem key={job.id} job={job} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

function JobListItem({ job, index }: { job: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/jobs/${job.id}`} className="block h-full">
        <Card className="glass h-full p-4 hover:border-foreground/10 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />
          
          <CardHeader className="p-6">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/40 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="badge-premium">{getJobTypeLabel(job.type)}</div>
            </div>
            
            <CardTitle className="text-2xl font-black mb-4 tracking-tighter leading-tight group-hover:text-primary transition-colors">
              {job.title}
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
              <span className="w-1 h-1 bg-border rounded-full" />
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDate(job.createdAt)}</span>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 pt-0">
             <div className="h-px bg-border/50 mb-6" />
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-foreground/10 border border-foreground/5 flex items-center justify-center text-[10px] font-black">RF</div>
                   <span className="text-xs font-bold opacity-60">{job.recruiter.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
             </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
