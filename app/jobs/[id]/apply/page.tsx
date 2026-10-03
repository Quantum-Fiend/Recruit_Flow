'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link";

interface ApplyJob {
  id: string;
  title: string;
  recruiter: {
    name: string;
  };
}
import { Button } from "@/components/ui/button";
import { getJobByIdAction } from "@/app/actions/jobs";
import { createApplicationAction } from "@/app/actions/applications";
import { LocalUpload } from "@/components/local-upload";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Briefcase,
  ArrowRight,
  Loader2,
  Target,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const [job, setJob] = useState<ApplyJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState<{ url: string; name: string } | null>(
    null,
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login to apply for this position");
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return;

    async function init() {
      const result = await getJobByIdAction(params.id as string);
      if (result.success) {
        setJob(result.job);
      } else {
        toast.error("Job position no longer active");
        router.push("/jobs");
      }
      setLoading(false);
    }
    init();
  }, [params.id, router, status]);

  const handleSubmit = async () => {
    if (!resume) {
      toast.error("A resume is required to complete your application");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createApplicationAction({
        jobId: params.id as string,
        resumeUrl: resume.url,
        resumeName: resume.name,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        setSuccess(true);
        toast.success("Application submitted");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="premium-container py-20">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-[600px] w-full rounded-[4rem] glass-panel opacity-40" />
        </div>
      </div>
    );
  }

  if (success) {
    if (!job) return null;
    return (
      <div className="min-h-[70vh] flex items-center justify-center w-full px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full"
        >
          <div className="premium-card p-6 sm:p-10 md:p-14 text-center glass-panel border-success/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-success/5 blur-[80px] -z-10" />
            <div className="space-y-8 sm:space-y-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-success/10 rounded-2xl flex items-center justify-center mx-auto text-success">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  Application submitted
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
                  Your application has been sent to{" "}
                  <span className="text-foreground font-bold underline underline-offset-8 decoration-primary/30">
                    {job.recruiter.name}
                  </span>
                  .
                </p>
              </div>
              <Link href="/dashboard" className="block">
                <Button className="w-full min-h-12 h-auto rounded-xl text-sm font-semibold bg-success hover:bg-success-strong text-success-foreground shadow-md py-3">
                  View my applications
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="page-wrapper animate-reveal">
      <div className="w-full max-w-3xl mx-auto space-y-8 sm:space-y-10 mb-20 sm:mb-32">
        {/* Top Navigation */}
        <Link href={`/jobs/${params.id}`} className="inline-flex">
          <Button
            variant="ghost"
            className="rounded-xl h-12 px-6 group font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
            Back to job details
          </Button>
        </Link>

        {/* Header Identity */}
        <header className="space-y-5 sm:space-y-7">
          <div className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full glass-panel text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary">
            <Zap className="w-4 h-4" />
            <span>Job application</span>
          </div>
          <h1 className="h-lg text-gradient leading-tight break-words">
            Apply for <br />
            <span>{job.title}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-xl leading-relaxed break-words">
            Your application will be shared with{" "}
            <span className="text-foreground font-black">
              {job.recruiter.name}
            </span>.
          </p>
        </header>

        {/* Application Interface */}
        <div className="premium-card p-5 sm:p-8 lg:p-10 glass-panel border-border/40 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 group-hover:bg-primary/10 transition-all duration-1000" />

          <div className="space-y-10 sm:space-y-12">
            {/* Document Section */}
            <div className="space-y-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Your resume
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Upload a recent resume so the hiring team can review your experience.
                  </p>
                </div>
              </div>

              {!resume ? (
                <div className="p-2 rounded-[2.5rem] bg-foreground/[0.02] border-2 border-dashed border-border/40">
                  <LocalUpload
                    onUploadComplete={(url, name) => setResume({ url, name })}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-4 p-4 sm:p-6 bg-success/5 rounded-2xl border border-success/20 animate-reveal">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="w-12 h-12 shrink-0 bg-success/10 rounded-xl flex items-center justify-center text-success">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <p className="break-words font-semibold text-base sm:text-lg tracking-tight">
                        {resume.name}
                      </p>
                      <p className="text-[10px] text-success font-semibold uppercase tracking-wider">
                        Resume uploaded
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setResume(null)}
                    className="rounded-xl h-11 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all font-semibold text-xs uppercase tracking-wide"
                  >
                    Replace
                  </Button>
                </div>
              )}
            </div>

            {/* Integrity Features */}
            <div className="grid md:grid-cols-2 gap-8">
              <IntegrityFeature
                icon={<ShieldCheck className="w-6 h-6" />}
                label="Identity Protection"
                desc="Your resume is shared with the recruiter managing this role."
              />
              <IntegrityFeature
                icon={<Zap className="w-6 h-6" />}
                label="One application"
                desc="Submit a resume for this role and follow its status from your dashboard."
              />
            </div>

            {/* Action Footer */}
            <div className="pt-12 border-t border-border/40">
              <Button
                className="w-full h-20 rounded-2xl btn-quantum shadow-2xl disabled:opacity-20 active:scale-[0.98] transition-all"
                disabled={!resume || submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <span className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Submitting application...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
                    Submit application
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-20 font-black text-[10px] uppercase tracking-[0.4em] pt-8">
          <span className="flex items-center gap-3">
            <Globe className="w-4 h-4" /> Worldwide Ops
          </span>
          <span className="flex items-center gap-3">
            <Target className="w-4 h-4" /> High Precision
          </span>
          <span className="flex items-center gap-3">
            <Briefcase className="w-4 h-4" /> Professional Hub
          </span>
        </div>
      </div>
    </div>
  );
}

function IntegrityFeature({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] glass-panel border-border/40 flex items-start gap-6 hover:border-primary/40 transition-all duration-700 shadow-sm">
       <div className="text-primary mt-1 shadow-2xl">{icon}</div>
       <div className="space-y-2">
          <p className="text-base font-black tracking-tight leading-none">{label}</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-60">{desc}</p>
       </div>
    </div>
  )
}
