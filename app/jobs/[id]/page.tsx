'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJobByIdAction } from "@/app/actions/jobs"
import { getJobTypeLabel, getEmploymentTypeLabel, formatDate } from "@/lib/utils"
import { MapPin, Briefcase, Clock, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface JobDetails {
  id: string
  title: string
  description: string
  location: string
  type: string
  employmentType: string
  experienceLevel: string
  skills: string[]
  status: string
  createdAt: Date
  recruiter: {
    name: string
  }
  _count: {
    applications: number
  }
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false;
    
    async function init() {
      const result = await getJobByIdAction(params.id as string)
      if (!ignore) {
        if (result.success && result.job) {
          setJob(result.job as JobDetails)
        }
        setLoading(false)
      }
    }

    init()
    return () => { ignore = true }
  }, [params.id])

  const handleApply = async () => {
    // In a real app, this would open a dialog with resume upload
    // For now, we'll simulate it
    toast.info("Resume upload feature coming soon! For demo, please sign in first.")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Job not found</p>
          <Link href="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
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
          <Link href="/jobs">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Job Header */}
          <Card className="glass border-white/10 mb-6 animate-in">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                  <CardDescription className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </CardDescription>
                </div>
                <Button size="lg" onClick={handleApply} disabled={job.status !== "OPEN"}>
                  {job.status === "OPEN" ? "Apply Now" : "Position Closed"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary">{getJobTypeLabel(job.type)}</Badge>
                <Badge variant="secondary">{getEmploymentTypeLabel(job.employmentType)}</Badge>
                <Badge variant="outline">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {job.experienceLevel}
                </Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  Posted {formatDate(job.createdAt)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Job Description */}
          <Card className="glass border-white/10 mb-6">
            <CardHeader>
              <CardTitle>About the Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {/* Required Skills */}
          <Card className="glass border-white/10 mb-6">
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>About the Company</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Posted by {job.recruiter.name}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {job._count.applications} candidates have applied for this position
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
