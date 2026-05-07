'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getJobByIdAction } from "@/app/actions/jobs"
import { createApplicationAction } from "@/app/actions/applications"
import { LocalUpload } from "@/components/local-upload"
import { ArrowLeft, FileText, CheckCircle2, Sparkles, ShieldCheck, Zap, Briefcase, ArrowRight, Loader2, Target, Globe } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"

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
      toast.success("Application Ingested Successfully")
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto py-20 px-6">
         <Card className="glass-morphism rounded-[3rem] p-12 space-y-10 border-none">
            <Skeleton className="h-10 w-1/3 rounded-xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-72 w-full rounded-[2.5rem]" />
         </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full"
        >
          <Card className="glass-morphism rounded-[3.5rem] p-16 text-center border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
            <CardContent className="p-0 space-y-10">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-500 shadow-2xl shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter">Application Ingested.</h2>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  Your professional profile is now being processed by <span className="text-foreground font-bold">{job.recruiter.name}</span>.
                </p>
              </div>
              <Link href="/dashboard">
                <Button className="w-full h-16 rounded-2xl text-lg font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20">
                  Access My Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1000px] mx-auto py-12 md:py-20 px-6"
    >
      <div className="max-w-3xl mx-auto space-y-12">
         {/* Top Navigation */}
         <Link href={`/jobs/${params.id}`}>
            <Button variant="ghost" className="rounded-2xl h-12 px-6 group font-bold text-muted-foreground hover:text-foreground">
               <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
               Back to Specifications
            </Button>
         </Link>

         {/* Header Identity */}
         <header className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
               <Zap className="w-4 h-4" />
               <span>Telemetry Deployment</span>
            </div>
            <h1 className="h-lg text-sapphire">
               Apply for <br /><span className="text-primary">{job.title}</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
               Connecting your talent profile with the <span className="text-foreground font-bold">{job.recruiter.name}</span> engineering infrastructure.
            </p>
         </header>

         {/* Application Interface */}
         <Card className="glass-morphism rounded-[3.5rem] p-4 md:p-14 border-none shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -z-10" />
            
            <div className="space-y-12">
               {/* Document Section */}
               <div className="space-y-8">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 sapphire-gradient rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                        <FileText className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black tracking-tight">Identity Document</h3>
                        <p className="text-muted-foreground font-medium">Your resume is the core of your talent profile.</p>
                     </div>
                  </div>

                  {!resume ? (
                    <LocalUpload onUploadComplete={(url, name) => setResume({ url, name })} />
                  ) : (
                    <div className="flex items-center justify-between p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 animate-in fade-in group">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                             <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                             <p className="font-black text-xl tracking-tight">{resume.name}</p>
                             <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-widest">Document Ingested</p>
                          </div>
                       </div>
                       <Button
                          variant="ghost"
                          onClick={() => setResume(null)}
                          className="rounded-xl h-12 px-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-bold"
                       >
                          Replace
                       </Button>
                    </div>
                  )}
               </div>

               {/* Integrity Features */}
               <div className="grid md:grid-cols-2 gap-6">
                  <IntegrityFeature icon={<ShieldCheck />} label="Identity Protection" desc="Your data is encrypted at the application level." />
                  <IntegrityFeature icon={<Zap />} label="Direct Channel" desc="Zero-latency delivery to the hiring infrastructure." />
               </div>

               {/* Action Footer */}
               <div className="pt-6 border-t border-foreground/5">
                  <Button
                    className="w-full h-20 rounded-[2rem] text-2xl font-black sapphire-gradient text-white shadow-2xl shadow-primary/30 group disabled:opacity-30"
                    disabled={!resume || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                       <span className="flex items-center gap-4">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span>Ingesting Application...</span>
                       </span>
                    ) : (
                       <span className="flex items-center gap-3">
                          Deploy Application
                          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                       </span>
                    )}
                  </Button>
               </div>
            </div>
         </Card>

         {/* Trust Bar */}
         <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-30 font-black text-[10px] uppercase tracking-[0.25em]">
            <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Worldwide Access</span>
            <span className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /> High Precision</span>
            <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Professional Tier</span>
         </div>
      </div>
    </motion.div>
  )
}

function IntegrityFeature({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="p-6 rounded-[2rem] bg-foreground/5 border border-foreground/5 flex items-start gap-4 hover:border-primary/20 transition-all">
       <div className="text-primary mt-1">{icon}</div>
       <div className="space-y-1">
          <p className="text-sm font-black tracking-tight">{label}</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}
