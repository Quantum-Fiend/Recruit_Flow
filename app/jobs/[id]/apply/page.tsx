'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getJobByIdAction } from "@/app/actions/jobs"
import { createApplicationAction } from "@/app/actions/applications"
import { LocalUpload } from "@/components/local-upload"
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [resume, setResume] = useState<{ url: string; name: string } | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function init() {
      const result = await getJobByIdAction(params.id as string)
      if (result.success) {
        setJob(result.job)
      } else {
        toast.error("Job not found")
        router.push("/jobs")
      }
      setLoading(false)
    }
    init()
  }, [params.id, router])

  const handleSubmit = async () => {
    if (!resume) {
      toast.error("Please upload your resume first")
      return
    }

    setSubmitting(true)
    const result = await createApplicationAction({
      jobId: params.id as string,
      resumeUrl: resume.url,
      resumeName: resume.name,
    })

    if (result.error) {
      toast.error(result.error)
      setSubmitting(false)
    } else {
      setSuccess(true)
      toast.success("Application submitted successfully!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="glass border-white/10 max-w-md w-full text-center py-12">
          <CardContent>
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Application Sent!</h2>
            <p className="text-muted-foreground mb-8">
              Your application for <span className="text-white font-semibold">{job.title}</span> has been submitted successfully.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <nav className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            RecruitFlow
          </Link>
          <Link href={`/jobs/${params.id}`}>
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 animate-in">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Submit Your Application
            </h1>
            <p className="text-muted-foreground">
              Applying for <span className="text-white font-medium">{job.title}</span> at <span className="text-white font-medium">{job.recruiter.name}</span>
            </p>
          </div>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Resume Upload</CardTitle>
              <CardDescription>
                Please upload your resume in PDF or Word format (Max 4MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!resume ? (
                <LocalUpload
                  onUploadComplete={(res) => {
                    setResume(res)
                  }}
                />
              ) : (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{resume.name}</p>
                      <p className="text-xs text-muted-foreground">Successfully uploaded</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setResume(null)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="pt-4">
                <Button
                  className="w-full h-12 text-lg"
                  disabled={!resume || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
