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
              <Button variant="ghost" className="rounded-2xl h-10 px-4 group font-bold text-muted-foreground hover:text-foreground mb-4">
                 <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                 Back to Archives
              </Button>
           </Link>
           <h1 className="h-lg text-sapphire">{job?.title} <br /><span className="text-primary text-3xl font-black">Talent Ingestion.</span></h1>
           <p className="text-xl text-muted-foreground font-medium">Review and manage the active telemetry stream for this position.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-6 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-black">{applications.length} Profiles</span>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full mb-32 space-y-8">
        {applications.length === 0 ? (
          <div className="text-center py-40 glass-morphism w-full border-dashed rounded-[3rem] flex flex-col items-center">
            <FileText className="w-16 h-16 mb-8 text-muted-foreground/10" />
            <h3 className="text-3xl font-black mb-4 tracking-tight">No data points received</h3>
            <p className="text-xl text-muted-foreground max-w-sm font-medium">This deployment has not yet initialized any candidate ingestion sequences.</p>
          </div>
        ) : (
          <div className="space-y-6">
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
                    <Card className="glass-morphism creative-card p-2 border-none group">
                      <CardContent className="p-10 space-y-10">
                        {/* Identity & Status */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                           <div className="flex items-center gap-8 flex-1">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:sapphire-gradient group-hover:text-white transition-all duration-700 shadow-xl shadow-primary/5">
                                 <Users className="w-8 h-8" />
                              </div>
                              <div className="space-y-2">
                                 <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">{app.applicant.name}</h3>
                                 <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    <span>{app.applicant.email}</span>
                                    <span className="w-1 h-1 bg-border rounded-full" />
                                    <span>Applied {formatDate(app.appliedAt)}</span>
                                 </div>
                              </div>
                           </div>
                           <div className={cn("badge-premium px-8 py-3 text-sm", getStatusColor(app.status))}>
                              {app.status}
                           </div>
                        </div>

                        {/* Technical Assets & Workflow */}
                        <div className="grid md:grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                 <FileText className="w-4 h-4" />
                                 <span>Technical Resume</span>
                              </div>
                              <a 
                                 href={app.resumeUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="flex items-center justify-between p-6 bg-foreground/5 rounded-2xl border border-foreground/10 hover:border-primary/30 transition-all group/res"
                              >
                                 <span className="font-bold text-lg">{app.resumeName}</span>
                                 <ChevronRight className="w-5 h-5 text-muted-foreground group-hover/res:translate-x-1 transition-all" />
                              </a>
                           </div>

                           <div className="space-y-6">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                 <Zap className="w-4 h-4" />
                                 <span>Workflow Optimization</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {possibleTransitions.map((status) => (
                                    <Button
                                       key={status}
                                       variant="outline"
                                       className="h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest border-border hover:bg-primary hover:text-white hover:border-primary transition-all"
                                       onClick={() => handleStatusUpdate(app.id, status)}
                                    >
                                       Move to {status}
                                    </Button>
                                 ))}
                                 {possibleTransitions.length === 0 && (
                                    <div className="h-12 flex items-center px-6 rounded-xl bg-foreground/5 text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                                       Sequence Finalized
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Intelligence Notes */}
                        <div className="space-y-6 pt-6 border-t border-foreground/5">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                 <MessageSquare className="w-4 h-4" />
                                 <span>Internal Intelligence</span>
                              </div>
                              <Button 
                                 variant="ghost" 
                                 className="h-8 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-foreground/5"
                                 onClick={() => setSelectedApp(isExpanded ? null : app)}
                              >
                                 {isExpanded ? "Hide Feed" : "Expand Intelligence"}
                              </Button>
                           </div>

                           {app.notes.length > 0 && (
                             <div className="space-y-4">
                                {app.notes.map((note) => (
                                   <div key={note.id} className="p-6 bg-foreground/5 rounded-2xl border border-foreground/5 space-y-3">
                                      <p className="text-base font-medium leading-relaxed">{note.note}</p>
                                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                                         <span>{note.recruiter.name}</span>
                                         <span>{formatDate(note.createdAt)}</span>
                                      </div>
                                   </div>
                                ))}
                             </div>
                           )}

                           {isExpanded && (
                             <div className="space-y-4 animate-in slide-in-from-top-2">
                                <Textarea
                                   placeholder="Ingest internal note for this profile..."
                                   value={newNote}
                                   onChange={(e) => setNewNote(e.target.value)}
                                   rows={3}
                                   className="rounded-2xl bg-foreground/5 border-none font-medium text-base focus-visible:ring-1 focus-visible:ring-primary/30"
                                />
                                <Button
                                   onClick={handleAddNote}
                                   disabled={!newNote.trim() || addingNote}
                                   className="h-12 px-8 rounded-xl sapphire-gradient text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                                >
                                   {addingNote ? "Ingesting..." : "Deploy Note"}
                                </Button>
                             </div>
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
