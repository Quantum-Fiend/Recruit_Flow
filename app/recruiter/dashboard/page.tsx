"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CircleUserRound,
  Clock3,
  Plus,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { getRecruiterDashboardAction } from "@/app/actions/recruiter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

type DashboardStats = {
  activeJobsCount: number;
  totalApplicationsCount: number;
  pendingApplicationsCount: number;
  applicationsByStatus: Record<string, number>;
  recentJobs: Array<{
    id: string;
    title: string;
    location: string;
    status: string;
    _count: { applications: number };
  }>;
  recentApplications: Array<{
    id: string;
    status: string;
    appliedAt: Date;
    applicant: { name: string };
    job: { title: string };
  }>;
};

const pipelineStages = [
  { status: "APPLIED", label: "Applied", color: "bg-sky-500" },
  { status: "SHORTLISTED", label: "Shortlisted", color: "bg-violet-500" },
  { status: "INTERVIEW", label: "Interview", color: "bg-amber-500" },
  { status: "OFFER", label: "Offer", color: "bg-emerald-500" },
  { status: "HIRED", label: "Hired", color: "bg-teal-600" },
] as const;

export default function RecruiterDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getRecruiterDashboardAction();
      if (!result.success || !result.data) {
        setError(true);
        toast.error(result.error ?? "We couldn’t load your hiring overview.");
        return;
      }
      setStats(result.data);
    } catch {
      setError(true);
      toast.error("We couldn’t load your hiring overview. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const firstName = session?.user?.name?.trim().split(/\s+/)[0] ?? "there";
  const interviewCount = stats?.applicationsByStatus.INTERVIEW ?? 0;

  return (
    <div className="page-wrapper recruiter-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Recruiter workspace</p>
          <h1 className="dashboard-title">Welcome back, {firstName}</h1>
          <p className="dashboard-subtitle">
            Here’s what’s happening across your hiring pipeline today.
          </p>
        </div>
        <div className="dashboard-actions">
          <Button
            variant="outline"
            size="icon"
            onClick={() => void loadDashboard()}
            disabled={loading}
            aria-label="Refresh dashboard"
            title="Refresh dashboard"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </Button>
          <Link href="/recruiter/jobs/new">
            <Button className="dashboard-primary-action">
              <Plus aria-hidden="true" />
              Create a job
            </Button>
          </Link>
        </div>
      </header>

      {error ? (
        <section className="dashboard-error" role="alert">
          <div>
            <h2>Dashboard unavailable</h2>
            <p>Your hiring data couldn’t be loaded. Check your connection and try again.</p>
          </div>
          <Button variant="outline" onClick={() => void loadDashboard()}>
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        </section>
      ) : (
        <>
          <section className="dashboard-metrics" aria-label="Hiring overview">
            <MetricCard
              label="Open positions"
              value={stats?.activeJobsCount}
              detail="Currently accepting applications"
              icon={<BriefcaseBusiness aria-hidden="true" />}
              loading={loading}
            />
            <MetricCard
              label="Applications"
              value={stats?.totalApplicationsCount}
              detail="Across all your positions"
              icon={<UsersRound aria-hidden="true" />}
              loading={loading}
            />
            <MetricCard
              label="Needs review"
              value={stats?.pendingApplicationsCount}
              detail="New applications to screen"
              icon={<Clock3 aria-hidden="true" />}
              loading={loading}
              accent="amber"
            />
            <MetricCard
              label="In interviews"
              value={interviewCount}
              detail="Candidates in interview stage"
              icon={<CircleUserRound aria-hidden="true" />}
              loading={loading}
              accent="violet"
            />
          </section>

          <section className="pipeline-panel" aria-labelledby="pipeline-title">
            <div className="section-heading">
              <div>
                <h2 id="pipeline-title">Hiring pipeline</h2>
                <p>Candidate progress across every stage</p>
              </div>
              <Link href="/recruiter/jobs" className="dashboard-text-link">
                View positions <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="pipeline-stages">
              {pipelineStages.map((stage, index) => (
                <div className="pipeline-stage" key={stage.status}>
                  <div className="pipeline-stage-top">
                    <span className={`pipeline-stage-dot ${stage.color}`} />
                    <span className="pipeline-stage-label">{stage.label}</span>
                    <span className="pipeline-stage-count">
                      {loading ? (
                        <Skeleton className="h-6 w-8" />
                      ) : (
                        stats?.applicationsByStatus[stage.status] ?? 0
                      )}
                    </span>
                  </div>
                  <div
                    className="pipeline-stage-track"
                    role="progressbar"
                    aria-label={`${stage.label} applications`}
                    aria-valuemin={0}
                    aria-valuemax={stats?.totalApplicationsCount ?? 0}
                    aria-valuenow={stats?.applicationsByStatus[stage.status] ?? 0}
                  >
                    <span
                      className={`pipeline-stage-fill ${stage.color}`}
                      style={{
                        width: `${Math.min(
                          100,
                          stats?.totalApplicationsCount
                            ? ((stats.applicationsByStatus[stage.status] ?? 0) /
                                stats.totalApplicationsCount) *
                                100
                            : 0,
                        )}%`,
                      }}
                    />
                  </div>
                  {index < pipelineStages.length - 1 && (
                    <ArrowRight className="pipeline-stage-arrow" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard-content-grid">
            <section className="dashboard-panel" aria-labelledby="positions-title">
              <div className="section-heading">
                <div>
                  <h2 id="positions-title">Your positions</h2>
                  <p>Application activity by open role</p>
                </div>
                <Link href="/recruiter/jobs" className="dashboard-text-link">
                  All positions <ArrowRight aria-hidden="true" />
                </Link>
              </div>
              {loading ? (
                <div className="dashboard-list">
                  {[0, 1, 2].map((item) => (
                    <Skeleton className="h-[76px] w-full rounded-xl" key={item} />
                  ))}
                </div>
              ) : stats?.recentJobs.length ? (
                <div className="dashboard-list">
                  {stats.recentJobs.map((job) => (
                    <Link
                      className="position-row"
                      href={`/recruiter/jobs/${job.id}/applicants`}
                      key={job.id}
                    >
                      <span className="position-icon">
                        <BriefcaseBusiness aria-hidden="true" />
                      </span>
                      <span className="position-info">
                        <span className="position-title">{job.title}</span>
                        <span className="position-location">{job.location}</span>
                      </span>
                      <span className="position-applications">
                        <strong>{job._count.applications}</strong>
                        <span>applicants</span>
                      </span>
                      <ArrowRight className="position-arrow" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No positions yet"
                  description="Create your first opening to start building your hiring pipeline."
                  href="/recruiter/jobs/new"
                  action="Create a position"
                />
              )}
            </section>

            <section className="dashboard-panel" aria-labelledby="activity-title">
              <div className="section-heading">
                <div>
                  <h2 id="activity-title">Recent applications</h2>
                  <p>Latest candidate activity</p>
                </div>
              </div>
              {loading ? (
                <div className="dashboard-list">
                  {[0, 1, 2, 3].map((item) => (
                    <Skeleton className="h-[62px] w-full rounded-xl" key={item} />
                  ))}
                </div>
              ) : stats?.recentApplications.length ? (
                <div className="activity-list">
                  {stats.recentApplications.map((application) => (
                    <div className="activity-row" key={application.id}>
                      <span className="activity-avatar" aria-hidden="true">
                        {application.applicant.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="activity-copy">
                        <p>
                          <strong>{application.applicant.name}</strong> applied
                        </p>
                        <span>{application.job.title}</span>
                      </div>
                      <time className="activity-time" dateTime={new Date(application.appliedAt).toISOString()}>
                        {formatDate(application.appliedAt)}
                      </time>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No applications yet"
                  description="New applicants will appear here as soon as they apply."
                  href="/recruiter/jobs"
                  action="View positions"
                />
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  loading,
  accent = "blue",
}: {
  label: string;
  value?: number;
  detail: string;
  icon: React.ReactNode;
  loading: boolean;
  accent?: "blue" | "amber" | "violet";
}) {
  return (
    <article className="metric-card">
      <div className={`metric-icon metric-icon-${accent}`}>{icon}</div>
      <p className="metric-label">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-9 w-16" />
      ) : (
        <p className="metric-value">{value ?? 0}</p>
      )}
      <p className="metric-detail">{detail}</p>
    </article>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="dashboard-empty">
      <span className="empty-state-icon">
        <Check aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link href={href} className="dashboard-text-link">
        {action} <ArrowUpRight aria-hidden="true" />
      </Link>
    </div>
  );
}
