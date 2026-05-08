'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobsAction } from "@/app/actions/jobs"
import { Job } from "@/types/app"
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const loadJobs = useCallback(async (query = "") => {
    const result = await getJobsAction({ search: query })
    if (result.success && result.jobs) {
      setJobs(result.jobs)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadJobs();
  }, [loadJobs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadJobs(search)
  }

  return (
    <div className="page-wrapper animate-reveal px-6">
      {/* Header Section */}
      <section className="w-full mb-24 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <Globe className="w-3.5 h-3.5" />
              <span>Global Engineering Pipeline</span>
            </div>
            <h1 className="h-lg text-gradient leading-tight">
              The <br />Network.
            </h1>
            <p className="text-xl text-muted-foreground font-medium opacity-60 max-w-xl leading-relaxed">
              Access high-performance engineering roles within the world's most 
              ambitious technical ecosystems.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl border-border/50 flex items-center gap-3 font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-xl"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Intelligence Filters
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative group w-full">
          <div className="relative glass-panel h-24 px-6 flex items-center gap-6 rounded-[2rem] group-focus-within:border-primary/50 transition-all shadow-2xl group-focus-within:shadow-primary/5 overflow-hidden">
            <Search className="w-8 h-8 text-muted-foreground/40 ml-4" />
            <Input
              placeholder="Search roles, engineering stacks, or locations..."
              className="flex-1 h-full bg-transparent border-none text-2xl font-black tracking-tight focus-visible:ring-0 placeholder:text-muted-foreground/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              type="submit"
              className="h-16 px-12 rounded-2xl btn-quantum text-white hidden sm:flex"
            >
              Initialize Search
            </Button>
          </div>
        </form>
      </section>

      {/* Grid Content */}
      <div className="w-full mb-40">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                className="h-[400px] w-full rounded-3xl glass-panel opacity-40"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-48 premium-card w-full border-dashed rounded-[4rem] flex flex-col items-center glass-panel">
            <Briefcase className="w-20 h-20 mb-8 text-muted-foreground/10" />
            <h3 className="text-4xl font-black mb-4 tracking-tighter">
              Telemetry mismatch.
            </h3>
            <p className="text-muted-foreground mb-16 max-w-sm font-medium opacity-60">
              No active positions identified matching your search parameters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                loadJobs("");
              }}
              className="rounded-2xl px-12 h-16 font-black border-border/50 hover:bg-secondary transition-all"
            >
              Reset Search Parameters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
            <AnimatePresence>
              {jobs.map((job, index) => (
                <JobCardItem key={job.id} job={job} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

function JobCardItem({ job, index }: { job: Job; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <Link href={`/jobs/${job.id}`} className="block h-full">
        <div className="premium-card h-full flex flex-col justify-between glass-panel hover:border-primary/40">
          <div className="p-10 space-y-10">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-700 shadow-xl">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {getJobTypeLabel(job.type)}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/40">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {job.location}
                </span>
                <span className="w-1.5 h-1.5 bg-border rounded-full" />
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {formatDate(job.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-10 py-8 mt-auto flex items-center justify-between border-t border-border/40 bg-foreground/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-[11px] font-black text-primary border border-primary/20">
                {job.recruiter.name.charAt(0)}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                {job.recruiter.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100">
              Deploy <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
