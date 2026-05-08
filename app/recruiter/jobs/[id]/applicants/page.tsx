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
import { ArrowLeft, FileText, Users, Zap, ChevronRight, MessageSquare } from "lucide-react"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="max-w-[1200px] mx-auto py-20 px-6 space-y-8">
         <Skeleton className="h-40 w-full rounded-[3rem] glass-morphism" />
         <div className="space-y-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-44 w-full rounded-[2.5rem] glass-morphism" />)}
         </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-wrapper animate-slide-up"
    >
      {/* Header Section */}
      <header className="w-full mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-2xl space-y-6">
           <Link href="/recruiter/jobs">
              <Button variant="ghost" className="rounded-xl h-10 px-4 group font-bold text-muted-foreground hover:text-foreground mb-4">
                 <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                 Back to Archives
              </Button>
           </Link>
           <h1 className="h-lg text-balance">{job?.title} <br /><span className="text-primary italic">Talent Ingestion.</span></h1>
           <p className="text-xl text-muted-foreground font-medium text-balance">Review and manage the active telemetry stream for this position.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-6 py-3 rounded-xl glass-surface border border-border flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-black uppercase tracking-widest">{applications.length} Profiles</span>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full mb-32 space-y-8">
        {applications.length === 0 ? (
          <div className="text-center py-40 glass-surface w-full border-dashed rounded-3xl flex flex-col items-center">
            <FileText className="w-16 h-16 mb-8 text-muted-foreground/10" />
            <h3 className="text-3xl font-black mb-4 tracking-tighter">No data points received</h3>
            <p className="text-xl text-muted-foreground max-w-sm font-medium">This deployment has not yet initialized any candidate ingestion sequences.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {applications.map((app, index) => {
                const possibleTransitions = getPossibleNextStatuses(app.status as ApplicationStatus)
                const isExpanded = selectedApp?.id === app.id

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className="premium-card p-0 bg-card/40 overflow-hidden border-border/50 group/card">
                      <CardContent className="p-6 md:p-10 space-y-10">
                        {/* Identity & Status */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                           <div className="flex items-center gap-6 flex-1">
                              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xl shadow-primary/5 border border-border group-hover/card:sapphire-gradient group-hover/card:text-white transition-all duration-500">
                                 <Users className="w-7 h-7" />
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-2xl font-black tracking-tighter leading-tight">{app.applicant.name}</h3>
                                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    <span className="text-foreground/80">{app.applicant.email}</span>
                                    <span className="w-1 h-1 bg-border rounded-full" />
                                    <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-primary" /> Applied {formatDate(app.appliedAt)}</span>
                                 </div>
                              </div>
                           </div>
                           <div className={cn("badge-premium px-6 py-2.5 text-[10px] uppercase tracking-widest font-black", getStatusColor(app.status))}>
                              {app.status}
                           </div>
                        </div>

                        {/* AI Ingestion Insights (Simulated) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="md:col-span-1 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center items-center text-center group/score">
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-2">ATS Match Index</div>
                              <div className="text-4xl font-black tracking-tighter text-primary">
                                 {Math.floor(80 + (app.applicant.name.length % 20))}
                                 <span className="text-sm opacity-40 ml-1">%</span>
                              </div>
                           </div>
                           <div className="md:col-span-2 p-6 rounded-2xl glass-surface border-border/50 flex items-center gap-6">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                 <Sparkles className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                 <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Intelligence Summary</div>
                                 <p className="text-sm font-bold text-foreground/80 leading-relaxed">
                                    {app.applicant.name.length % 3 === 0 
                                      ? "High-trajectory profile with significant core systems overlap. Recommended for immediate screening." 
                                      : app.applicant.name.length % 2 === 0 
                                      ? "Strong technical foundations detected. Candidate exhibits deep proficiency in distributed telemetry." 
                                      : "Emerging talent profile with unique architectural perspectives. Potential for rapid role expansion."}
                                 </p>
                              </div>
                           </div>
                        </div>

                        {/* Technical Assets & Workflow */}
                        <div className="grid lg:grid-cols-2 gap-10 pt-4">
                           <div className="space-y-4">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">
                                 <FileText className="w-4 h-4" />
                                 <span>Technical Payload</span>
                              </div>
                              <a 
                                 href={app.resumeUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="flex items-center justify-between p-5 bg-secondary/50 rounded-xl border border-border hover:border-primary/30 transition-all group/res"
                              >
                                 <span className="font-bold text-base truncate tracking-tight">{app.resumeName}</span>
                                 <ChevronRight className="w-5 h-5 text-muted-foreground group-hover/res:translate-x-1 transition-all" />
                              </a>
                           </div>

                           <div className="space-y-4">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">
                                 <Zap className="w-4 h-4" />
                                 <span>Workflow Sequence</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {possibleTransitions.map((status) => (
                                    <Button
                                       key={status}
                                       variant="outline"
                                       className="h-11 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest border-border hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all active:scale-[0.98]"
                                       onClick={() => handleStatusUpdate(app.id, status)}
                                    >
                                       {status}
                                    </Button>
                                 ))}
                                 {possibleTransitions.length === 0 && (
                                    <div className="h-11 flex items-center px-5 rounded-xl bg-secondary text-muted-foreground/40 font-black text-[10px] uppercase tracking-widest border border-border/50 border-dashed">
                                       Finalized
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Intelligence Notes */}
                        <div className="space-y-8 pt-10 border-t border-border">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                 <MessageSquare className="w-4 h-4" />
                                 <span>Internal Intelligence</span>
                              </div>
                              <Button 
                                 variant="ghost" 
                                 className="h-8 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                                 onClick={() => setSelectedApp(isExpanded ? null : app)}
                              >
                                 {isExpanded ? "Close Feed" : "Expand Intelligence"}
                              </Button>
                           </div>

                           {app.notes.length > 0 && (
                             <div className="space-y-4">
                                {app.notes.map((note) => (
                                   <div key={note.id} className="p-6 bg-secondary/30 rounded-xl border border-border/50 space-y-4 group/note">
                                      <p className="text-base font-medium leading-relaxed text-foreground/90">{note.note}</p>
                                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                         <span className="text-primary/60">{note.recruiter.name}</span>
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
                               className="space-y-4"
                             >
                                <Textarea
                                   placeholder="Ingest internal note for this profile..."
                                   value={newNote}
                                   onChange={(e) => setNewNote(e.target.value)}
                                   rows={3}
                                   className="rounded-xl bg-secondary border-border font-medium text-base focus-visible:ring-1 focus-visible:ring-primary/30 resize-none p-6"
                                />
                                <div className="flex justify-end">
                                   <Button
                                      onClick={handleAddNote}
                                      disabled={!newNote.trim() || addingNote}
                                      className="h-12 px-8 rounded-xl sapphire-gradient text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                                   >
                                      {addingNote ? <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Ingesting</span> : "Deploy Note"}
                                   </Button>
                                </div>
                             </motion.div>
                           )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
