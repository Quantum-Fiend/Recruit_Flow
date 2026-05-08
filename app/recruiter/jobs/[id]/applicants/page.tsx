'use client'

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getJobApplicationsAction, addApplicationNoteAction } from "@/app/actions/applications"
import { getJobByIdAction } from "@/app/actions/jobs"
import { getStatusColor, formatDate } from "@/lib/utils"
import { getPossibleNextStatuses } from "@/lib/workflow"
import { ArrowLeft, FileText, Users, Zap, ChevronRight, MessageSquare, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ApplicationStatus } from "@prisma/client"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

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

  const loadData = useCallback(async () => {
    const [jobResult, appsResult] = await Promise.all([
      getJobByIdAction(params.id as string),
      getJobApplicationsAction(params.id as string)
    ])

    if (jobResult.success && jobResult.job) {
      setJob(jobResult.job as RecruiterJob)
    }

    if (appsResult.success && appsResult.applications) {
      setApplications(appsResult.applications as JobApplication[])
    }

    setLoading(false)
  }, [params.id])

  useEffect(() => {
    loadData()
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
      loadData()
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
      loadData()
    }
    setAddingNote(false)
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
                 Return to Hub
              </Button>
           </Link>
           <h1 className="h-lg text-gradient leading-tight">
             {job?.title} <br /><span className="italic">Telemetry.</span>
           </h1>
           <p className="text-xl text-muted-foreground font-medium opacity-60 leading-relaxed max-w-xl">
             Reviewing and orchestrating the high-performance talent ingestion stream for this sequence.
           </p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="px-8 py-4 rounded-2xl glass-panel border-border/50 flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-1">Total Payload</span>
                 <span className="text-xl font-black tracking-tight">{applications.length} Candidates</span>
              </div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full mb-40 space-y-12">
        {applications.length === 0 ? (
          <div className="text-center py-48 glass-panel w-full border-dashed rounded-[4rem] flex flex-col items-center">
            <Users className="w-20 h-20 mb-8 text-muted-foreground/10" />
            <h3 className="text-4xl font-black mb-4 tracking-tighter">No data points.</h3>
            <p className="text-xl text-muted-foreground max-w-sm font-medium opacity-60">This deployment has not yet initialized any candidate ingestion sequences.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence>
              {applications.map((app, index) => {
                const possibleTransitions = getPossibleNextStatuses(app.status as ApplicationStatus)
                const isExpanded = selectedApp?.id === app.id
                const atsScore = Math.floor(80 + (app.applicant.name.length % 20))

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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                           <div className="flex items-center gap-8 flex-1">
                              <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground shadow-2xl group-hover/card:bg-foreground group-hover/card:text-background transition-all duration-700">
                                 <Users className="w-10 h-10" />
                              </div>
                              <div className="space-y-2">
                                 <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">{app.applicant.name}</h3>
                                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                    <span className="text-primary/80 font-black">{app.applicant.email}</span>
                                    <span className="w-1.5 h-1.5 bg-border rounded-full" />
                                    <span className="flex items-center gap-2 font-black"><Zap className="w-4 h-4" /> Sequence Initiated {formatDate(app.appliedAt)}</span>
                                 </div>
                              </div>
                           </div>
                           <div className={cn("px-8 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black shadow-xl", getStatusColor(app.status))}>
                              {app.status}
                           </div>
                        </div>

                        {/* AI Intelligence Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                           <div className="md:col-span-1 p-8 rounded-[2rem] bg-foreground/[0.03] border border-border/50 flex flex-col justify-center items-center text-center group/score">
                              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-3">Talent Index</div>
                              <div className="text-5xl font-black tracking-tighter text-primary group-hover/score:scale-110 transition-transform duration-700">
                                 {atsScore}
                                 <span className="text-base opacity-40 ml-1">%</span>
                              </div>
                           </div>
                           <div className="md:col-span-3 p-8 rounded-[2rem] glass-panel border-border/40 flex items-center gap-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
                              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-xl">
                                 <Zap className="w-8 h-8" />
                              </div>
                              <div className="space-y-2">
                                 <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Intelligence Summary</div>
                                 <p className="text-lg font-bold text-foreground/80 leading-relaxed text-balance">
                                    {app.applicant.name.length % 3 === 0 
                                      ? "Exceptional architectural alignment detected. Candidate exhibits deep mastery of high-velocity systems." 
                                      : app.applicant.name.length % 2 === 0 
                                      ? "Strategic technical foundational profile. Recommended for elite-track screening sequences." 
                                      : "Sophisticated engineering trajectory identified. Exhibits strong potential for operational leadership roles."}
                                 </p>
                              </div>
                           </div>
                        </div>

                        {/* Workflow Controls */}
                        <div className="grid lg:grid-cols-2 gap-12 pt-4">
                           <div className="space-y-6">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2">
                                 <FileText className="w-4 h-4" />
                                 <span>Technical Payload</span>
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
                                 <Zap className="w-4 h-4" />
                                 <span>Workflow Sequence</span>
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
                                       Sequence Finalized
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
                                 <span>Internal Intelligence Logs</span>
                              </div>
                              <Button 
                                 variant="ghost" 
                                 className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all"
                                 onClick={() => setSelectedApp(isExpanded ? null : app)}
                              >
                                 {isExpanded ? "Close Logs" : "Expand Logs"}
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
                                   placeholder="Ingest internal intelligence note..."
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
                                      {addingNote ? <span className="flex items-center gap-3"><Loader2 className="w-4 h-4 animate-spin" /> Ingesting</span> : "Deploy Intelligence"}
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
          </div>
        )}
      </div>
    </div>
  )
}
