'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJobsAction, closeJobAction } from "@/app/actions/jobs"
import { getStatusColor, getJobTypeLabel, formatDate } from "@/lib/utils"
import { Plus, MapPin, Users } from "lucide-react"
import { toast } from "sonner"

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
  const [jobs, setJobs] = useState<RecruiterJob[]>([])
  const [loading, setLoading] = useState(true)

  const loadJobs = useCallback(async () => {
    const result = await getJobsAction({}) // In real app, would filter by current recruiter internally or via search/query
    if (result.success && result.jobs) {
      setJobs(result.jobs as RecruiterJob[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false;
    
    async function init() {
      const result = await getJobsAction({})
      if (!ignore) {
        if (result.success && result.jobs) {
          setJobs(result.jobs as RecruiterJob[])
        }
        setLoading(false)
      }
    }

    init()
    return () => { ignore = true }
  }, [])

  const handleCloseJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to close this job posting?")) return

    const result = await closeJobAction(jobId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Job closed successfully")
      loadJobs()
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            RecruitFlow
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/recruiter/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/api/auth/signout">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              My Job Postings
            </h1>
            <p className="text-muted-foreground">
              Manage your job listings and view applicants
            </p>
          </div>
          <Link href="/recruiter/jobs/new">
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <Card className="glass border-white/10 text-center py-12">
            <CardContent>
              <Plus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Jobs Posted Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first job posting to start receiving applications
              </p>
              <Link href="/recruiter/jobs/new">
                <Button>Post Your First Job</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="glass border-white/10 hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        <Badge variant="secondary">
                          {getJobTypeLabel(job.type)}
                        </Badge>
                      </div>
                      <CardDescription className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job._count.applications} applicants
                        </span>
                        <span>Posted {formatDate(job.createdAt)}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Link href={`/recruiter/jobs/${job.id}/applicants`}>
                      <Button>View Applicants</Button>
                    </Link>
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline">Preview</Button>
                    </Link>
                    {job.status === "OPEN" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleCloseJob(job.id)}
                      >
                        Close Job
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
