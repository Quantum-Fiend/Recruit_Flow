'use client'

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getJobApplicationsAction, addApplicationNoteAction } from "@/app/actions/applications"
import { getJobByIdAction } from "@/app/actions/jobs"
import { getStatusColor, formatDate } from "@/lib/utils"
import { getPossibleNextStatuses } from "@/lib/workflow"
import { ArrowLeft, FileText, Users, ChevronRight, MessageSquare, Loader2, Sparkles, AlertTriangle, CheckCircle2, Download, GitCompareArrows } from "lucide-react"
import { toast } from "sonner"
import { ApplicationStatus } from "@prisma/client"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { resumeAnalysisSchema, type ResumeAnalysisResult } from "@/lib/ai/resume-analysis"

interface SavedAnalysis {
  id: string
  model: string
  result: ResumeAnalysisResult
  createdAt: string | Date
}

interface JobNote {
  id: string
  note: string
  createdAt: Date
  recruiter: {
    name: string
  }
}

interface JobApplication {
  id: string
  status: string
  appliedAt: Date
  resumeUrl: string
  resumeName: string
  applicant: {
    name: string
    email: string
  }
  notes: JobNote[]
  resumeAnalyses?: SavedAnalysis[]
}

interface RecruiterJob {
  id: string
  title: string
  location: string
}

export default function ApplicantsPage() {
  const params = useParams()
  const [job, setJob] = useState<RecruiterJob | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null)
  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<Record<string, SavedAnalysis>>({})
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [comparisonIds, setComparisonIds] = useState<string[]>([])
  const [copilotQuestion, setCopilotQuestion] = useState("")
  const [copilotAnswer, setCopilotAnswer] = useState("")
  const [copilotLoading, setCopilotLoading] = useState(false)
  const [applicationPage, setApplicationPage] = useState(1)
  const [applicationPages, setApplicationPages] = useState({ page: 1, pages: 1, total: 0 })
  const [loadError, setLoadError] = useState(false)

  const loadData = useCallback(async (page = 1) => {
    setLoading(true)
    setLoadError(false)
    try {
      const [jobResult, appsResult] = await Promise.all([
        getJobByIdAction(params.id as string),
        getJobApplicationsAction(params.id as string, page)
      ])

      if (jobResult.success && jobResult.job) {
        setJob(jobResult.job as RecruiterJob)
      } else {
        setLoadError(true)
      }

      if (appsResult.success && appsResult.applications) {
        const storedApplications = appsResult.applications as Array<
          Omit<JobApplication, "resumeAnalyses"> & {
            resumeAnalyses?: Array<Omit<SavedAnalysis, "result"> & { result: unknown }>
          }
        >
        let invalidStoredAnalysis = false
        const loadedApplications: JobApplication[] = storedApplications.map((application) => ({
          ...application,
          resumeAnalyses: application.resumeAnalyses?.flatMap((analysis) => {
            const parsed = resumeAnalysisSchema.safeParse(analysis.result)
            if (!parsed.success) {
              invalidStoredAnalysis = true
              console.error("Stored resume analysis failed validation", analysis.id)
              return []
            }
            return [{ ...analysis, result: parsed.data }]
          }),
        }))
        setApplications(loadedApplications)
        setApplicationPage(appsResult.pagination?.page ?? page)
        setApplicationPages({
          page: appsResult.pagination?.page ?? page,
          pages: appsResult.pagination?.pages ?? 1,
          total: appsResult.pagination?.total ?? loadedApplications.length,
        })
        if (invalidStoredAnalysis) {
          toast.error("A saved AI analysis could not be displayed. Run the analysis again.")
        }
        setAnalysisResults(Object.fromEntries(
          loadedApplications.flatMap((application) =>
            application.resumeAnalyses?.[0]
              ? [[application.id, application.resumeAnalyses[0]]]
              : [],
          ),
        ))
      } else {
        setLoadError(true)
        toast.error(appsResult.error ?? "We couldn’t load applications for this job.")
      }

    } catch {
      setLoadError(true)
      toast.error("We couldn’t load this job’s applications. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    queueMicrotask(() => loadData(1));
  }, [loadData])

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to update status')
      }

      toast.success("Application status updated")
      void loadData(applicationPage)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    }
  }

  const handleAddNote = async () => {
    if (!selectedApp || !newNote.trim()) return

    setAddingNote(true)
    const result = await addApplicationNoteAction({
      applicationId: selectedApp.id,
      note: newNote,
    })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Note added")
      setNewNote("")
      void loadData(applicationPage)
    }
    setAddingNote(false)
  }

  const analyzeCandidate = async (applicationId: string) => {
    setAnalyzingId(applicationId)
    try {
      const response = await fetch(`/api/recruiter/applications/${applicationId}/analyze`, {
        method: "POST",
      })
      const data = await response.json() as { analysis?: SavedAnalysis; error?: string }
      if (!response.ok || !data.analysis) {
        throw new Error(data.error ?? "Could not analyze this resume.")
      }
      setAnalysisResults((current) => ({ ...current, [applicationId]: data.analysis! }))
      toast.success("Candidate analysis is ready")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not analyze this resume.")
    } finally {
      setAnalyzingId(null)
    }
  }

  const toggleComparison = (applicationId: string) => {
    setComparisonIds((selected) => {
      if (selected.includes(applicationId)) {
        return selected.filter((id) => id !== applicationId)
      }
      if (selected.length >= 3) {
        toast.error("Compare up to three candidates at a time.")
        return selected
      }
      return [...selected, applicationId]
    })
  }

  const askCopilot = async () => {
    if (!copilotQuestion.trim()) return
    setCopilotLoading(true)
    setCopilotAnswer("")
    try {
      const response = await fetch(`/api/recruiter/jobs/${params.id}/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: copilotQuestion }),
      })
      const data = await response.json() as { answer?: string; error?: string }
      if (!response.ok || !data.answer) {
        throw new Error(data.error ?? "Copilot could not answer right now.")
      }
      setCopilotAnswer(data.answer)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Copilot could not answer right now.")
    } finally {
      setCopilotLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="premium-container py-20 space-y-12">
         <Skeleton className="h-60 w-full rounded-[3rem] glass-panel opacity-40" />
         <div className="space-y-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-[2.5rem] glass-panel opacity-40" />)}
         </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper animate-reveal px-6">
      {/* Header Section */}
      <header className="w-full mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-3xl space-y-8">
           <Link href="/recruiter/jobs" className="inline-flex">
              <Button variant="ghost" className="rounded-xl h-10 px-4 group font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-foreground">
                 <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                 Back to jobs
              </Button>
           </Link>
           <h1 className="h-lg text-gradient leading-tight">
            {job?.title}
           </h1>
           <p className="text-xl text-muted-foreground font-medium opacity-60 leading-relaxed max-w-xl">
             Review applications, update candidate stages, and keep recruiter notes together.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <div className="px-8 py-4 rounded-2xl glass-panel border-border/50 flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-1">Applications</span>
                 <span className="text-xl font-black tracking-tight">{applicationPages.total}</span>
              </div>
           </div>
           <Button variant="outline" onClick={() => downloadApplicationsCsv(applications, job?.title ?? "applications")}>
              <Download className="h-4 w-4" />
              Export page CSV
           </Button>
        </div>
      </header>

      <section className="mb-12 rounded-3xl border border-primary/20 bg-primary/[0.035] p-5 sm:p-7" aria-label="Recruiter copilot">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Sparkles className="h-5 w-5" /></div>
          <div>
            <h2 className="font-semibold">Recruiter Copilot</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask for role-specific interview planning, requirement clarification, or pipeline guidance. The job description, your question, and aggregate counts are sent to OpenAI; no resume or candidate identity is included.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 space-y-2">
            <span className="text-sm font-medium">What would you like help with?</span>
            <Textarea
              value={copilotQuestion}
              onChange={(event) => setCopilotQuestion(event.target.value)}
              placeholder="For example: What should I clarify in the requirements before my next interview?"
              rows={3}
              maxLength={1200}
              className="resize-y bg-background"
            />
          </label>
          <Button
            className="w-full sm:w-auto"
            disabled={copilotLoading || copilotQuestion.trim().length < 2}
            onClick={() => void askCopilot()}
          >
            {copilotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {copilotLoading ? "Thinking…" : "Ask copilot"}
          </Button>
        </div>
        {copilotAnswer && (
          <div className="mt-4 rounded-2xl border border-border/70 bg-background p-4 text-sm leading-6 whitespace-pre-wrap" aria-live="polite">
            {copilotAnswer}
            <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
              AI-generated guidance may be incomplete. Verify details and keep hiring decisions with your team.
            </p>
          </div>
        )}
      </section>

      {comparisonIds.length > 0 && (
        <section className="mb-12 rounded-3xl border border-border/70 bg-card p-5 sm:p-7 space-y-5" aria-label="Candidate comparison">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Candidate comparison</h2>
              <p className="text-sm text-muted-foreground">Compare up to three candidates using the same evidence-based criteria.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setComparisonIds([])}>Clear comparison</Button>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {applications.filter((application) => comparisonIds.includes(application.id)).map((application) => {
              const analysis = analysisResults[application.id]?.result
              return (
                <article key={application.id} className="min-w-0 rounded-2xl border border-border/70 bg-background p-4 space-y-4">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{application.applicant.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">{application.applicant.email}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs">{application.status}</span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Applied</dt><dd className="text-right">{formatDate(application.appliedAt)}</dd>
                    <dt className="text-muted-foreground">Compatibility</dt><dd className="text-right font-semibold">{analysis ? `${analysis.overallScore}/100` : "Not analyzed"}</dd>
                    <dt className="text-muted-foreground">Skills</dt><dd className="text-right">{analysis ? `${analysis.dimensions.skills.score}/100` : "—"}</dd>
                    <dt className="text-muted-foreground">Experience</dt><dd className="text-right">{analysis ? `${analysis.dimensions.experience.score}/100` : "—"}</dd>
                    <dt className="text-muted-foreground">Education</dt><dd className="text-right">{analysis ? `${analysis.dimensions.education.score}/100` : "—"}</dd>
                  </dl>
                  {analysis ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.extractedSkills.slice(0, 8).map((skill) => (
                        <span key={skill} className="max-w-full truncate rounded-full bg-secondary px-2 py-1 text-xs">{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Run AI analysis to compare role-related skills and evidence.</p>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="w-full mb-40 space-y-12">
        {loadError ? (
          <div className="dashboard-error" role="alert">
            <div>
              <h2>Applications unavailable</h2>
              <p>We couldn’t retrieve applications for this job.</p>
            </div>
            <Button variant="outline" onClick={() => void loadData(applicationPage)}>Try again</Button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-48 glass-panel w-full border-dashed rounded-[4rem] flex flex-col items-center">
            <Users className="w-20 h-20 mb-8 text-muted-foreground/10" />
            <h3 className="text-4xl font-black mb-4 tracking-tighter">No applications yet</h3>
            <p className="text-xl text-muted-foreground max-w-sm font-medium opacity-60">Applications for this position will appear here when candidates apply.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence>
              {applications.map((app, index) => {
                const possibleTransitions = getPossibleNextStatuses(app.status as ApplicationStatus)
                const isExpanded = selectedApp?.id === app.id

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group/card"
                  >
                    <div className="premium-card p-0 glass-panel border-border/40 group-hover/card:border-primary/30 transition-all duration-700">
                      <div className="p-10 md:p-14 space-y-12">
                        {/* Identity & Status */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="flex items-center gap-8 flex-1">
                              <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground shadow-2xl group-hover/card:bg-foreground group-hover/card:text-background transition-all duration-700">
                                 <Users className="w-10 h-10" />
                              </div>
                              <div className="space-y-2">
                                 <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">{app.applicant.name}</h3>
                                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                    <span className="text-primary/80 font-black">{app.applicant.email}</span>
                                    <span className="w-1.5 h-1.5 bg-border rounded-full" />
                                    <span className="flex items-center gap-2 font-black">Applied {formatDate(app.appliedAt)}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-wrap items-center gap-3">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 aria-pressed={comparisonIds.includes(app.id)}
                                 onClick={() => toggleComparison(app.id)}
                              >
                                 <GitCompareArrows className="h-4 w-4" />
                                 {comparisonIds.includes(app.id) ? "Selected" : "Compare"}
                              </Button>
                              <div className={cn("px-5 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black shadow-xl", getStatusColor(app.status))}>
                                 {app.status}
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="p-6 rounded-2xl bg-background border border-border/50">
                              <div className="text-xs font-semibold text-muted-foreground mb-2">Application status</div>
                              <p className="text-sm font-medium leading-relaxed">
                                 This application is currently in the <strong>{app.status.toLowerCase().replaceAll("_", " ")}</strong> stage.
                                 Use the workflow controls below to record your next decision.
                              </p>
                           </div>
                           <div className="p-6 rounded-2xl bg-background border border-border/50">
                              <div className="text-xs font-semibold text-muted-foreground mb-2">Resume review</div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                 Review the attached resume or request an evidence-based AI compatibility analysis for this role.
                              </p>
                           </div>
                        </div>

                        <section className="rounded-2xl border border-primary/20 bg-primary/[0.035] p-5 sm:p-7 space-y-5" aria-label={`AI analysis for ${app.applicant.name}`}>
                           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-start gap-3">
                                 <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Sparkles className="h-5 w-5" /></div>
                                 <div>
                                    <h4 className="font-semibold">AI-assisted role match</h4>
                                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                       {app.resumeName.toLowerCase().endsWith(".pdf") && (app.resumeUrl.startsWith("/uploads/") || app.resumeUrl.startsWith("/api/resumes/"))
                                          ? "On request, the resume PDF and job description are sent to OpenAI. Review all findings yourself; this is not a hiring decision."
                                          : "AI analysis currently requires a PDF resume uploaded to this workspace."}
                                    </p>
                                 </div>
                              </div>
                              <Button
                                 className="w-full shrink-0 sm:w-auto"
                                 variant="outline"
                                 disabled={analyzingId !== null || !app.resumeName.toLowerCase().endsWith(".pdf") || (!app.resumeUrl.startsWith("/uploads/") && !app.resumeUrl.startsWith("/api/resumes/"))}
                                 onClick={() => void analyzeCandidate(app.id)}
                              >
                                 {analyzingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                 {analyzingId === app.id ? "Analyzing…" : analysisResults[app.id] ? "Run analysis again" : "Analyze resume"}
                              </Button>
                           </div>
                           {analysisResults[app.id] && (
                              <AnalysisPanel analysis={analysisResults[app.id]} />
                           )}
                        </section>

                        {/* Workflow Controls */}
                        <div className="grid lg:grid-cols-2 gap-12 pt-4">
                           <div className="space-y-6">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2">
                                 <FileText className="w-4 h-4" />
                                 <span>Resume</span>
                              </div>
                              <a
                                 href={app.resumeUrl}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center justify-between p-8 bg-foreground/[0.02] rounded-3xl border border-border/40 hover:border-primary/40 transition-all group/res shadow-sm"
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                                       <FileText className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <span className="font-bold text-lg tracking-tight truncate max-w-[200px] md:max-w-none">{app.resumeName}</span>
                                 </div>
                                 <ChevronRight className="w-6 h-6 text-muted-foreground/40 group-hover/res:translate-x-1 transition-all" />
                              </a>
                           </div>

                           <div className="space-y-6">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2">
                                 <span>Update application status</span>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                 {possibleTransitions.map((status) => (
                                    <Button
                                       key={status}
                                       variant="outline"
                                       className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all active:scale-[0.98] shadow-sm"
                                       onClick={() => handleStatusUpdate(app.id, status)}
                                    >
                                       {status}
                                    </Button>
                                 ))}
                                 {possibleTransitions.length === 0 && (
                                    <div className="h-14 flex items-center px-8 rounded-2xl bg-foreground/[0.02] text-muted-foreground/40 font-black text-[10px] uppercase tracking-widest border border-border/40 border-dashed">
                                       Application closed
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Internal Intelligence (Notes) */}
                        <div className="space-y-10 pt-14 border-t border-border/40">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2">
                                 <MessageSquare className="w-4 h-4" />
                                 <span>Recruiter notes</span>
                              </div>
                              <Button
                                 variant="ghost"
                                 className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all"
                                 onClick={() => setSelectedApp(isExpanded ? null : app)}
                              >
                                 {isExpanded ? "Close notes" : "Add or view notes"}
                              </Button>
                           </div>

                           {app.notes.length > 0 && (
                             <div className="space-y-6">
                                {app.notes.map((note) => (
                                   <div key={note.id} className="p-8 bg-foreground/[0.02] rounded-[2rem] border border-border/40 space-y-6 relative group/note">
                                      <p className="text-lg font-bold leading-relaxed text-foreground/80">{note.note}</p>
                                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                         <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[8px]">{note.recruiter.name.charAt(0)}</div>
                                            <span className="text-primary/60">{note.recruiter.name}</span>
                                         </div>
                                         <span>{formatDate(note.createdAt)}</span>
                                      </div>
                                   </div>
                                ))}
                             </div>
                           )}

                           {isExpanded && (
                             <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 pt-4"
                             >
                                <Textarea
                                   placeholder="Add a private note for your recruiting team…"
                                   value={newNote}
                                   onChange={(e) => setNewNote(e.target.value)}
                                   rows={4}
                                   className="rounded-[2rem] bg-foreground/[0.03] border-border/50 font-bold text-lg focus-visible:ring-primary/20 resize-none p-8 placeholder:text-muted-foreground/20"
                                />
                                <div className="flex justify-end">
                                   <Button
                                      onClick={handleAddNote}
                                      disabled={!newNote.trim() || addingNote}
                                      className="h-16 px-12 rounded-2xl btn-quantum shadow-2xl active:scale-[0.98]"
                                   >
                                      {addingNote ? <span className="flex items-center gap-3"><Loader2 className="w-4 h-4 animate-spin" /> Saving…</span> : "Add note"}
                                   </Button>
                                </div>
                             </motion.div>
                           )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {applicationPages.pages > 1 && (
              <nav className="flex items-center justify-center gap-3 pt-4" aria-label="Candidate pages">
                <Button
                  variant="outline"
                  disabled={loading || applicationPage <= 1}
                  onClick={() => void loadData(applicationPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  Page {applicationPage} of {applicationPages.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={loading || applicationPage >= applicationPages.pages}
                  onClick={() => void loadData(applicationPage + 1)}
                >
                  Next
                </Button>
              </nav>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AnalysisPanel({ analysis }: { analysis: SavedAnalysis }) {
  const { result } = analysis
  const dimensions: Array<[string, keyof ResumeAnalysisResult["dimensions"]]> = [
    ["Skills", "skills"],
    ["Experience", "experience"],
    ["Education", "education"],
    ["Requirements", "requirements"],
    ["Role alignment", "roleAlignment"],
  ]

  return (
    <div className="space-y-6 border-t border-primary/10 pt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
            {result.overallScore}
          </div>
          <div>
            <h5 className="font-semibold">Compatibility signal</h5>
            <p className="text-xs text-muted-foreground">Evidence-based aid, not a validated predictor</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          Updated {new Date(analysis.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-sm leading-6">{result.summary}</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {dimensions.map(([label, key]) => (
          <div key={key} className="rounded-xl border border-border/70 bg-background p-3">
            <div className="mb-2 flex justify-between gap-2 text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold">{result.dimensions[key].score}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${result.dimensions[key].score}%` }} />
            </div>
            {result.dimensions[key].evidence[0] && (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{result.dimensions[key].evidence[0]}</p>
            )}
          </div>
        ))}
      </div>
      {result.extractedSkills.length > 0 && (
        <div>
          <h5 className="mb-2 text-sm font-semibold">Skills identified</h5>
          <div className="flex flex-wrap gap-2">
            {result.extractedSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{skill}</span>
            ))}
          </div>
        </div>
      )}
      {result.matchedRequirements.length > 0 && (
        <div>
          <h5 className="mb-2 text-sm font-semibold">Requirement evidence</h5>
          <ul className="space-y-2">
            {result.matchedRequirements.map((item, index) => (
              <li key={`${item.requirement}-${index}`} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><strong>{item.requirement}</strong> <span className="text-muted-foreground">— {item.evidence}</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.missingRequirements.length > 0 && (
        <div>
          <h5 className="mb-2 text-sm font-semibold">Unverified requirements</h5>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.missingRequirements.map((item) => <li key={item}>• {item}</li>)}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Unverified does not mean absent; confirm directly with the candidate.</p>
        </div>
      )}
      {result.cautions.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
          <h5 className="mb-2 flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="h-4 w-4 text-amber-600" />Evidence gaps to clarify</h5>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.cautions.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      )}
      {result.interviewQuestions.length > 0 && (
        <div>
          <h5 className="mb-2 text-sm font-semibold">Suggested interview questions</h5>
          <ol className="list-decimal space-y-3 pl-5">
            {result.interviewQuestions.map((item, index) => (
              <li key={`${item.competency}-${index}`} className="pl-1 text-sm">
                <span className="font-medium">{item.question}</span>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.competency} · {item.rationale}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      {result.strengths.length > 0 && (
        <div>
          <h5 className="mb-2 text-sm font-semibold">Evidence-backed strengths</h5>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.strengths.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

function downloadApplicationsCsv(applications: JobApplication[], jobTitle: string) {
  const escapeCell = (value: string) => {
    const safeValue = /^[\s\u0000-\u001F]*[=+\-@]/.test(value) ? `'${value}` : value
    return `"${safeValue.replaceAll('"', '""')}"`
  }
  const rows = [
    ["Candidate", "Email", "Job", "Status", "Applied date", "Resume filename"],
    ...applications.map((application) => [
      application.applicant.name,
      application.applicant.email,
      jobTitle,
      application.status,
      new Date(application.appliedAt).toISOString(),
      application.resumeName,
    ]),
  ]
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => escapeCell(String(cell))).join(",")).join("\r\n")}`
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `${jobTitle.replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}-applications.csv`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
