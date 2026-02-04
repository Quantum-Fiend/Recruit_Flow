'use client'

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getJobApplicationsAction, addApplicationNoteAction } from "@/app/actions/applications"
import { getJobByIdAction } from "@/app/actions/jobs"
import { getStatusColor, formatDate } from "@/lib/utils"
import { getPossibleNextStatuses } from "@/lib/workflow"
import { ArrowLeft, FileText, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { ApplicationStatus } from "@prisma/client"

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
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <p className="text-muted-foreground">Loading applicants...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            RecruitFlow
          </Link>
          <Link href="/recruiter/jobs">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 animate-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {job?.title}
          </h1>
          <p className="text-muted-foreground">
            {applications.length} applicants • {job?.location}
          </p>
        </div>

        {/* Applicants List */}
        {applications.length === 0 ? (
          <Card className="glass border-white/10 text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground">
                Applications will appear here once candidates apply
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const possibleTransitions = getPossibleNextStatuses(app.status as ApplicationStatus)
              
              return (
                <Card key={app.id} className="glass border-white/10">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {app.applicant.name}
                        </CardTitle>
                        <CardDescription>
                          {app.applicant.email} • Applied {formatDate(app.appliedAt)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Resume */}
                    <div>
                      <Label className="text-sm text-muted-foreground">Resume</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <FileText className="w-4 h-4" />
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {app.resumeName}
                        </a>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">
                        Update Status
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {/* Current Status (Disabled/Highlighted) */}
                         <Button
                            size="sm"
                            variant="default" // Active look
                            className="cursor-default opacity-100" // Make it look static but solid
                          >
                            {app.status}
                          </Button>

                        {/* Possible Transitions */}
                        {possibleTransitions.map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(app.id, status)}
                          >
                            Move to {status}
                          </Button>
                        ))}
                        
                        {possibleTransitions.length === 0 && (
                           <span className="text-xs text-muted-foreground flex items-center h-9">
                              {app.status === 'HIRED' ? 'Candidate Hired' : 
                               app.status === 'WITHDRAWN' ? 'Candidate Withdrawn' : 
                               app.status === 'OFFER_DECLINED' ? 'Offer Declined' : 
                               'No actions available'}
                           </span>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {app.notes.length > 0 && (
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">
                          Internal Notes
                        </Label>
                        <div className="space-y-2">
                          {app.notes.map((note: JobNote) => (
                            <div key={note.id} className="p-3 rounded-md bg-muted/50 border border-white/10">
                              <p className="text-sm">{note.note}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {note.recruiter.name} • {formatDate(note.createdAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Note */}
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {selectedApp?.id === app.id ? "Cancel" : "Add Note"}
                      </Button>

                      {selectedApp?.id === app.id && (
                        <div className="mt-3 space-y-2">
                          <Textarea
                            placeholder="Add an internal note about this candidate..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            rows={3}
                          />
                          <Button
                            onClick={handleAddNote}
                            disabled={!newNote.trim() || addingNote}
                            size="sm"
                          >
                            {addingNote ? "Adding..." : "Save Note"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

