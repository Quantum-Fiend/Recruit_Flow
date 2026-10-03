'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getMyApplicationsAction,
  withdrawApplicationAction,
  acceptOfferAction,
  declineOfferAction,
} from "@/app/actions/applications";
import { toast } from "sonner";
import { getStatusColor, formatDate } from "@/lib/utils";
import {
  Briefcase,
  MapPin,
  Calendar,
  FileText,
  ArrowRight,
  XCircle,
  LayoutDashboard,
  Sparkles,
  Target,
  Activity,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"

interface Application {
  id: string
  status: string
  resumeName: string
  appliedAt: Date
  job: {
    id: string
    title: string
    location: string
    type: string
  }
}

interface ApplicationPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [pagination, setPagination] = useState<ApplicationPagination>({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });

  const loadApplications = useCallback(async (page = 1) => {
    setLoading(true);
    setLoadError(false);
    try {
      const result = await getMyApplicationsAction(page);
      if (!result.success || !result.applications) {
        setLoadError(true);
        toast.error(result.error ?? "We couldn’t load your applications.");
        return;
      }
      setApplications(result.applications as Application[]);
      setStatusCounts(result.statusCounts ?? {});
      setPagination(result.pagination ?? { page, limit: 25, total: 0, pages: 0 });
    } catch {
      setLoadError(true);
      toast.error("We couldn’t load your applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => loadApplications(1));
  }, [loadApplications]);

  return (
    <div className="page-wrapper animate-reveal">
      {/* Dashboard Header */}
      <header className="w-full mb-12 sm:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-10">
        <div className="max-w-3xl space-y-5 sm:space-y-7">
          <div className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full glass-panel text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Candidate workspace</span>
          </div>
          <h1 className="h-lg text-gradient leading-tight">
            My applications
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-xl">
            Review your applications and see the latest status updates from
            hiring teams.
          </p>
        </div>

        <div className="flex items-center">
          <Link href="/jobs">
            <Button className="btn-quantum min-h-12 h-auto px-5 sm:px-8 py-3 rounded-xl shadow-sm">
              Browse jobs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-12 sm:mb-20 w-full">
        {loading ? (
          [0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-40 rounded-2xl" />
          ))
        ) : (
          <>
            <StatBox
              label="In progress"
              value={Object.entries(statusCounts)
                .filter(([status]) => !["WITHDRAWN", "REJECTED", "OFFER_DECLINED"].includes(status))
                .reduce((total, [, count]) => total + count, 0)}
              icon={<Activity className="w-6 h-6" />}
            />
            <StatBox
              label="Interviews"
              value={statusCounts.INTERVIEW ?? 0}
              icon={<Target className="w-6 h-6" />}
            />
            <StatBox
              label="Offers"
              value={statusCounts.OFFER ?? 0}
              icon={<Sparkles className="w-6 h-6" />}
            />
            <StatBox
              label="Applications"
              value={pagination.total}
              icon={<Briefcase className="w-6 h-6" />}
            />
          </>
        )}
      </div>

      {/* Main Pipeline Feed */}
      <div className="w-full space-y-8 sm:space-y-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Application activity
          </h2>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-48 w-full rounded-[2.5rem] glass-panel opacity-40"
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="dashboard-error" role="alert">
            <div>
              <h2>Applications unavailable</h2>
              <p>We couldn’t retrieve your applications. Please try again.</p>
            </div>
            <Button variant="outline" onClick={() => void loadApplications(pagination.page)}>
              Try again
            </Button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 sm:py-32 px-5 glass-panel w-full border-dashed rounded-2xl flex flex-col items-center">
            <Briefcase className="w-14 h-14 mb-6 text-muted-foreground/30" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
              No applications yet
            </h3>
            <p className="text-base text-muted-foreground mb-8 max-w-sm font-medium">
              Browse open positions and apply to roles that fit your experience.
            </p>
            <Link href="/jobs">
              <Button
                variant="outline"
                className="rounded-xl px-5 h-12 font-semibold border-border/50 hover:bg-secondary transition-all"
              >
                Browse open positions
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {applications.map((application, index) => (
                <ApplicationListItem
                  key={application.id}
                  application={application}
                  index={index}
                  onRefresh={loadApplications}
                />
              ))}
            </AnimatePresence>
            {pagination.pages > 1 && (
              <nav className="flex items-center justify-center gap-3 pt-4" aria-label="Application pages">
                <Button
                  variant="outline"
                  disabled={loading || pagination.page <= 1}
                  onClick={() => void loadApplications(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={loading || pagination.page >= pagination.pages}
                  onClick={() => void loadApplications(pagination.page + 1)}
                >
                  Next
                </Button>
              </nav>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationListItem({
  application,
  index,
  onRefresh,
}: {
  application: Application;
  index: number;
  onRefresh: () => void;
}) {
  const isActionable = ["APPLIED", "SHORTLISTED", "INTERVIEW"].includes(
    application.status,
  );
  const isOffer = application.status === "OFFER";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group/card"
    >
      <div className="premium-card p-0 glass-panel border-border/40">
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-7">
          <div className="flex min-w-0 items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground">
              <Briefcase className="w-10 h-10" />
            </div>
            <div className="min-w-0 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="min-w-0 break-words text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight leading-tight group-hover/card:text-primary transition-colors">
                  {application.job.title}
                </h3>
                <div
                  className={cn(
                    "max-w-full px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-semibold",
                    getStatusColor(application.status),
                  )}
                >
                  {application.status}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="flex min-w-0 items-center gap-2 break-words">
                  <MapPin className="w-4 h-4 shrink-0" /> {application.job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" />{" "}
                  {formatDate(application.appliedAt)}
                </span>
                <span className="flex min-w-0 items-center gap-2 break-all text-primary">
                  <FileText className="w-4 h-4 shrink-0" /> {application.resumeName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
            <Link
              href={`/jobs/${application.job.id}`}
              className="flex-1 lg:flex-none"
            >
              <Button
                variant="outline"
                className="h-11 px-4 rounded-xl font-semibold text-xs uppercase tracking-wide border-border/50 hover:bg-secondary transition-all shadow-sm"
              >
                Full Specs
              </Button>
            </Link>

            {isOffer && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  className="h-11 px-4 rounded-xl btn-quantum shadow-sm active:scale-[0.98]"
                  onClick={async () => {
                    if (
                      confirm(
                        "Accept this offer? This will update your application status.",
                      )
                    ) {
                      const result = await acceptOfferAction(application.id);
                      if (result.success) {
                        toast.success("Offer accepted");
                        onRefresh();
                      } else {
                        toast.error(result.error);
                      }
                    }
                  }}
                >
                  Accept Offer
                </Button>
                <Button
                  variant="ghost"
                  className="h-11 px-4 rounded-xl font-semibold text-xs uppercase tracking-wide text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                  onClick={async () => {
                    if (confirm("Decline this offer?")) {
                      const result = await declineOfferAction(application.id);
                      if (result.success) {
                        toast.success("Offer declined");
                        onRefresh();
                      } else {
                        toast.error(result.error);
                      }
                    }
                  }}
                >
                  Decline
                </Button>
              </div>
            )}

            {isActionable && (
              <Button
                variant="ghost"
                className="h-11 px-4 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all font-semibold text-xs uppercase tracking-wide gap-2"
                onClick={async () => {
                  if (confirm("Withdraw this application?")) {
                    const result = await withdrawApplicationAction(
                      application.id,
                    );
                    if (result.success) {
                      toast.success("Application withdrawn");
                      onRefresh();
                    } else {
                      toast.error(result.error);
                    }
                  }
                }}
              >
                <XCircle className="w-5 h-5" />
                <span>Withdraw</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="premium-card p-5 sm:p-6 flex flex-col items-center justify-center text-center glass-panel border-border/40">
       <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-foreground/[0.03] flex items-center justify-center text-foreground mb-4 sm:mb-5">
          {icon}
       </div>
       <div className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight leading-none">{value}</div>
       <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  )
}
