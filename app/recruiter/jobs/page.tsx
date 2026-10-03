'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getJobsAction, closeJobAction } from "@/app/actions/jobs"
import { getStatusColor, formatDate } from "@/lib/utils"
import { Plus, MapPin, Users, Briefcase, Activity, ArrowLeft, Eye, XCircle } from "lucide-react"
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
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const result = await getJobsAction({});
      if (!result.success) {
        setLoadError(true);
        toast.error(result.error ?? "We couldn’t load your jobs.");
      } else {
        setJobs(result.jobs as RecruiterJob[]);
      }
    } catch {
      setLoadError(true);
      toast.error("We couldn’t load your jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleCloseJob = async (jobId: string) => {
    if (
      !confirm(
        "Close this job? Candidates will no longer be able to apply.",
      )
    )
      return;

    try {
      const result = await closeJobAction(jobId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Job closed");
        void loadJobs();
      }
    } catch {
      toast.error("Couldn’t close this job. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-wrapper animate-slide-up"
    >
      {/* Header Section */}
      <header className="w-full mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
        <div className="max-w-2xl space-y-5">
          <Link href="/recruiter/dashboard">
            <Button
              variant="ghost"
              className="rounded-xl h-10 px-4 group font-bold text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to overview
            </Button>
          </Link>
          <h1 className="h-lg">
            Your jobs
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium text-balance">
            Manage your open roles, review application activity, and keep each
            hiring process moving.
          </p>
        </div>

        <div className="flex items-center">
          <Link href="/recruiter/jobs/new">
            <Button className="h-12 px-5 sm:px-6 rounded-xl sapphire-gradient text-white font-semibold text-sm transition-colors">
              <Plus className="w-5 h-5 mr-2" />
              Create a job
            </Button>
          </Link>
        </div>
      </header>

      {/* Grid Content */}
      <div className="w-full mb-20 sm:mb-28">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-40 w-full rounded-2xl glass-surface"
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="dashboard-error" role="alert">
            <div>
              <h2>Jobs unavailable</h2>
              <p>We couldn’t retrieve your jobs. Please try again.</p>
            </div>
            <Button variant="outline" onClick={() => void loadJobs()}>
              Try again
            </Button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 sm:py-28 px-5 glass-surface w-full border-dashed rounded-2xl flex flex-col items-center">
            <Briefcase className="w-14 h-14 mb-6 text-muted-foreground/30" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
              No jobs yet
            </h3>
            <p className="text-base text-muted-foreground mb-8 max-w-sm font-medium">
              Create your first job to start receiving applications.
            </p>
            <Link href="/recruiter/jobs/new">
              <Button className="h-12 px-5 rounded-xl sapphire-gradient text-white font-semibold">
                Create your first job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {jobs.map((job, index) => (
                <RecruiterJobCard
                  key={job.id}
                  job={job}
                  index={index}
                  onClose={handleCloseJob}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RecruiterJobCard({
  job,
  index,
  onClose,
}: {
  job: RecruiterJob;
  index: number;
  onClose: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="premium-card p-2 bg-card/40 group overflow-hidden border-border/50">
        <CardContent className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-7">
          <div className="flex min-w-0 items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-secondary flex items-center justify-center">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="min-w-0 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="break-words text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div
                  className={cn(
                    "badge-premium text-[10px] uppercase tracking-widest px-3 py-1 bg-primary/5 border-primary/10 text-primary",
                    getStatusColor(job.status),
                  )}
                >
                  {job.status}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="flex min-w-0 items-center gap-2 break-words">
                  <MapPin className="w-4 h-4 shrink-0" /> {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 shrink-0" /> {job._count.applications}{" "}
                  Profiles
                </span>
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 shrink-0" /> Active since{" "}
                  {formatDate(job.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
            <Link href={`/recruiter/jobs/${job.id}/applicants`}>
              <Button className="h-11 px-4 sm:px-5 rounded-xl font-semibold text-xs uppercase tracking-wide sapphire-gradient text-white">
                Analyze Talent
              </Button>
            </Link>

            <Link href={`/jobs/${job.id}`}>
              <Button
                variant="ghost"
                className="h-12 w-12 rounded-xl bg-secondary hover:bg-secondary/80 p-0 border border-border"
                title="Preview Perspective"
                aria-label={`Preview ${job.title}`}
              >
                <Eye className="w-5 h-5 text-muted-foreground" />
              </Button>
            </Link>

            {job.status === "OPEN" && (
              <Button
                variant="ghost"
                className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all p-0 border border-border"
                onClick={() => onClose(job.id)}
                title="Close job"
                aria-label={`Close ${job.title}`}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
