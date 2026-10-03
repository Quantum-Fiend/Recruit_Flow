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
    <div className="page-wrapper animate-reveal px-6">
      {/* Dashboard Header */}
      <header className="w-full mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Candidate workspace</span>
          </div>
          <h1 className="h-lg text-gradient leading-tight">
            My applications
          </h1>
          <p className="text-xl text-muted-foreground font-medium opacity-60 leading-relaxed max-w-xl">
            Review your applications and see the latest status updates from
            hiring teams.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/jobs">
            <Button className="btn-quantum h-16 px-10 rounded-2xl shadow-2xl">
              Browse jobs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 w-full">
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
      <div className="w-full space-y-12">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
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
          <div className="text-center py-48 glass-panel w-full border-dashed rounded-[4rem] flex flex-col items-center">
            <Briefcase className="w-20 h-20 mb-8 text-muted-foreground/10" />
            <h3 className="text-4xl font-black mb-4 tracking-tighter">
              No applications yet
            </h3>
            <p className="text-xl text-muted-foreground mb-16 max-w-sm font-medium opacity-60">
              Browse open positions and apply to roles that fit your experience.
            </p>
            <Link href="/jobs">
              <Button
                variant="outline"
                className="rounded-2xl px-12 h-16 font-black border-border/50 hover:bg-secondary transition-all"
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
      <div className="premium-card p-0 glass-panel border-border/40 group-hover/card:border-primary/30 transition-all duration-700">
        <div className="p-10 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="flex items-center gap-10 flex-1">
            <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground group-hover/card:bg-foreground group-hover/card:text-background transition-all duration-700 shadow-2xl">
              <Briefcase className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-6 flex-wrap">
                <h3 className="text-3xl font-black tracking-tighter leading-tight group-hover/card:text-primary transition-colors">
                  {application.job.title}
                </h3>
                <div
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black shadow-xl",
                    getStatusColor(application.status),
                  )}
                >
                  {application.status}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                <span className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" /> {application.job.location}
                </span>
                <span className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />{" "}
                  {formatDate(application.appliedAt)}
                </span>
                <span className="flex items-center gap-3 text-primary/60">
                  <FileText className="w-4 h-4" /> {application.resumeName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`/jobs/${application.job.id}`}
              className="flex-1 md:flex-none"
            >
              <Button
                variant="outline"
                className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/50 hover:bg-secondary transition-all shadow-sm"
              >
                Full Specs
              </Button>
            </Link>

            {isOffer && (
              <div className="flex items-center gap-3">
                <Button
                  className="h-14 px-10 rounded-2xl btn-quantum shadow-2xl active:scale-[0.98]"
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
                  className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 transition-all"
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
                className="h-14 px-6 rounded-2xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all font-black text-[10px] uppercase tracking-widest gap-3"
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
    <div className="premium-card p-10 flex flex-col items-center justify-center text-center group glass-panel border-border/40 hover:border-primary/40 transition-all duration-700">
       <div className="w-16 h-16 rounded-2xl bg-foreground/[0.03] flex items-center justify-center text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700 mb-8 shadow-2xl">
          {icon}
       </div>
       <div className="text-6xl font-black mb-4 tracking-tighter leading-none group-hover:scale-110 transition-transform duration-700">{value}</div>
       <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">{label}</p>
    </div>
  )
}
