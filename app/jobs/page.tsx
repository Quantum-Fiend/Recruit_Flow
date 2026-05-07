'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobsAction } from "@/app/actions/jobs"
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  Globe,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"
import { getJobTypeLabel, formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function JobsPage() {
  const [jobs, setJobs] = useState<unknown[]>([]);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJobs();
  }, [loadJobs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadJobs(search)
  }

  return (
    <div className="page-wrapper animate-slide-up">
      {/* Header Section */}
      <section className="w-full mb-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">
              <Globe className="w-3 h-3" />
              <span>Global Talent Pipeline</span>
            </div>
            <h1 className="h-lg text-sapphire">
              The <br />
              <span className="text-primary">Network.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              Access world-class engineering roles within the RecruitFlow
              ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="h-12 px-6 rounded-xl border-border flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative group w-full">
          <div className="relative glass-morphism h-20 px-4 flex items-center gap-4 rounded-2xl group-focus-within:border-primary/30 transition-all">
            <Search className="w-6 h-6 text-muted-foreground ml-3" />
            <Input
              placeholder="Search roles, engineering stacks, or locations..."
              className="flex-1 h-full bg-transparent border-none text-xl font-bold focus-visible:ring-0 placeholder:text-muted-foreground/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              type="submit"
              className="h-14 px-10 rounded-xl sapphire-gradient text-white font-black hover:opacity-90 hidden sm:flex transition-all active:scale-95 shadow-xl shadow-primary/20"
            >
              Initialize Search
            </Button>
          </div>
        </form>
      </section>

      {/* Grid Content */}
      <div className="w-full mb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                className="h-72 w-full rounded-2xl glass-morphism"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-40 glass-morphism w-full border-dashed rounded-[3rem] flex flex-col items-center">
            <Briefcase className="w-16 h-16 mb-6 text-muted-foreground/20" />
            <h3 className="text-3xl font-black mb-4 tracking-tight">
              System match not found
            </h3>
            <p className="text-muted-foreground mb-12 max-w-sm font-medium">
              We could not identify any active positions matching your telemetry
              profile.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                loadJobs("");
              }}
              className="rounded-xl px-12 h-14 font-black border-border"
            >
              Clear All Parameters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <AnimatePresence>
              {jobs.map((job, index) => (
                <JobCardItem key={job.id} job={job} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function JobCardItem({ job, index }: { job: unknown; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group h-full"
    >
      <Link href={`/jobs/${job.id}`} className="block h-full">
        <Card className="glass-morphism h-full p-2 creative-card border-none flex flex-col justify-between">
          <CardHeader className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:sapphire-gradient group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="badge-premium bg-primary/5 border-primary/10 text-primary">
                {getJobTypeLabel(job.type)}
              </div>
            </div>

            <CardTitle className="text-2xl font-black mb-4 tracking-tighter leading-tight group-hover:text-primary transition-colors">
              {job.title}
            </CardTitle>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> {job.location}
              </span>
              <span className="w-1 h-1 bg-border rounded-full" />
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> {formatDate(job.createdAt)}
              </span>
            </div>
          </CardHeader>

          <CardFooter className="p-8 pt-0 mt-auto flex items-center justify-between border-t border-foreground/5 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                RF
              </div>
              <span className="text-xs font-bold opacity-60">
                {job.recruiter.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary font-black text-xs group-hover:gap-2 transition-all">
              Engage <ChevronRight className="w-4 h-4" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
