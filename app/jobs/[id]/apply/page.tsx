'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getJobByIdAction } from "@/app/actions/jobs"
import { createApplicationAction } from "@/app/actions/applications"
import { LocalUpload } from "@/components/local-upload"
import { ArrowLeft, FileText, CheckCircle2, Sparkles, ShieldCheck, Zap, Briefcase, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

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
        toast.error("Job position no longer active")
        router.push("/jobs")
      }
      setLoading(false)
    }
    init()
  }, [params.id, router])

  const handleSubmit = async () => {
    if (!resume) {
      toast.error("A resume is required to complete your application")
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
      toast.success("Great! Your application has been sent.")
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="container-wide py-20 flex justify-center">
         <Card className="glass border-white/10 w-full max-w-2xl rounded-[3rem] p-12 space-y-8">
            <Skeleton className="h-10 w-1/3 rounded-xl mx-auto" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-[2rem]" />
         </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-fade-in">
          <Card className="glass border-emerald-500/20 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
            <CardContent className="p-0">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight">Application Sent!</h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Your profile has been shared with <span className="text-foreground font-bold">{job.recruiter.name}</span>. 
                You can track the progress on your dashboard.
              </p>
              <Link href="/dashboard">
                <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20">
                  View My Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="container-wide py-12 md:py-20 flex-1">
        <div className="max-w-3xl mx-auto space-y-10">
           {/* Navigation */}
           <div className="animate-fade-in">
              <Link href={`/jobs/${params.id}`}>
                 <Button variant="ghost" className="rounded-xl h-10 px-4 group">
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Job Details
                 </Button>
              </Link>
           </div>

           {/* Header Section */}
           <div className="space-y-4 animate-fade-in [animation-delay:100ms]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                 <Zap className="w-3 h-3" />
                 <span>Fast Application</span>
              </div>
              <h1 className="text-5xl font-black tracking-tight">
                 Apply for <span className="gradient-text">{job.title}</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                 Join the team at <span className="text-foreground font-bold">{job.recruiter.name}</span>. 
                 Complete the form below to start your next chapter.
              </p>
           </div>

           {/* Application Card */}
           <Card className="glass border-white/10 rounded-[3rem] p-4 md:p-12 animate-fade-in [animation-delay:200ms] shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
              
              <CardHeader className="p-0 mb-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                       <FileText className="w-6 h-6" />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-bold">Resume Upload</CardTitle>
                       <CardDescription className="font-medium">Attach your professional resume to highlight your skills.</CardDescription>
                    </div>
                 </div>
              </CardHeader>

              <CardContent className="p-0 space-y-10">
                 {!resume ? (
                    <LocalUpload onUploadComplete={(res) => setResume(res)} />
                 ) : (
                    <div className="flex items-center justify-between p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/20 animate-in group">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                             <FileText className="w-7 h-7" />
                          </div>
                          <div>
                             <p className="font-bold text-lg">{resume.name}</p>
                             <p className="text-xs text-emerald-500/70 font-black uppercase tracking-widest">Successfully Analyzed</p>
                          </div>
                       </div>
                       <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setResume(null)}
                          className="rounded-xl h-10 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                       >
                          Replace File
                       </Button>
                    </div>
                 )}

                 <div className="grid md:grid-cols-2 gap-4">
                    <FeatureBox icon={<ShieldCheck />} label="Privacy Guaranteed" description="Your data is encrypted and secure." />
                    <FeatureBox icon={<Zap />} label="Direct Review" description="Your profile goes straight to the recruiter." />
                 </div>

                 <div className="pt-4 h-px bg-border/50" />
              </CardContent>

              <CardFooter className="p-0 pt-10">
                 <Button
                    className="w-full h-16 rounded-[1.5rem] text-xl font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 group"
                    disabled={!resume || submitting}
                    onClick={handleSubmit}
                 >
                    {submitting ? (
                       <span className="flex items-center gap-3">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Processing Application...
                       </span>
                    ) : (
                       <span className="flex items-center gap-2">
                          Submit Application to {job.recruiter.name}
                          <ArrowRight className="w-6 h-6 ml-1 transition-transform group-hover:translate-x-1" />
                       </span>
                    )}
                 </Button>
              </CardFooter>
           </Card>

           {/* Guidelines */}
           <div className="flex justify-center gap-8 opacity-50 font-bold text-[10px] uppercase tracking-[0.2em] animate-fade-in [animation-delay:300ms]">
              <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> Professional Review</span>
              <span className="flex items-center gap-2"><Briefcase className="w-3 h-3" /> Direct Placement</span>
           </div>
        </div>
      </div>
    </div>
  )
}

function FeatureBox({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
  return (
    <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 flex items-start gap-3">
       <div className="text-primary mt-0.5">{icon}</div>
       <div>
          <p className="text-xs font-bold">{label}</p>
          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{description}</p>
       </div>
    </div>
  )
}

