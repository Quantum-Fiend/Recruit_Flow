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
      <div className="premium-container py-20">
         <div className="max-w-2xl mx-auto">
            <Skeleton className="h-[600px] w-full rounded-[4rem] glass-panel opacity-40" />
         </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full"
        >
          <div className="premium-card p-16 md:p-24 text-center glass-panel border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-1000" />
            <div className="space-y-12">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-emerald-500 shadow-2xl shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">Payload <br />Ingested.</h2>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed opacity-60">
                  Your professional profile is now being processed by <span className="text-foreground font-bold underline underline-offset-8 decoration-primary/30">{job.recruiter.name}</span>.
                </p>
              </div>
              <Link href="/dashboard" className="block">
                <Button className="w-full h-18 rounded-2xl text-xs font-black uppercase tracking-[0.2em] bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all py-6">
                  Access My Command Center
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="page-wrapper animate-reveal px-6">
      <div className="max-w-3xl mx-auto space-y-12 mb-40">
         {/* Top Navigation */}
         <Link href={`/jobs/${params.id}`} className="inline-flex">
            <Button variant="ghost" className="rounded-xl h-12 px-6 group font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-foreground">
               <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
               Return to Specifications
            </Button>
         </Link>

         {/* Header Identity */}
         <header className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel text-[10px] font-black uppercase tracking-[0.3em] text-primary">
               <Zap className="w-4 h-4" />
               <span>Sequence Initialization</span>
            </div>
            <h1 className="h-lg text-gradient leading-tight">
               Deploy for <br /><span>{job.title}</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium opacity-60 max-w-xl leading-relaxed">
               Connecting your talent profile with the <span className="text-foreground font-black">{job.recruiter.name}</span> engineering infrastructure.
            </p>
         </header>

         {/* Application Interface */}
         <div className="premium-card p-12 md:p-16 glass-panel border-border/40 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
            
            <div className="space-y-16">
               {/* Document Section */}
               <div className="space-y-10">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground shadow-2xl group-hover:bg-foreground group-hover:text-background transition-all duration-700">
                        <FileText className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black tracking-tighter">Identity Payload</h3>
                        <p className="text-sm text-muted-foreground font-medium opacity-60">Your resume is the core telemetry of your talent profile.</p>
                     </div>
                  </div>

                  {!resume ? (
                    <div className="p-2 rounded-[2.5rem] bg-foreground/[0.02] border-2 border-dashed border-border/40">
                      <LocalUpload onUploadComplete={(url, name) => setResume({ url, name })} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-10 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/20 animate-reveal">
                       <div className="flex items-center gap-8">
                          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10">
                             <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <div className="space-y-2">
                             <p className="font-black text-2xl md:text-3xl tracking-tighter">{resume.name}</p>
                             <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.2em]">Telemetry Ingested</p>
                          </div>
                       </div>
                       <Button
                          variant="ghost"
                          onClick={() => setResume(null)}
                          className="rounded-xl h-14 px-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all font-black text-[10px] uppercase tracking-widest"
                       >
                          Replace
                       </Button>
                    </div>
                  )}
               </div>

               {/* Integrity Features */}
               <div className="grid md:grid-cols-2 gap-8">
                  <IntegrityFeature icon={<ShieldCheck className="w-6 h-6" />} label="Identity Protection" desc="Your data is encrypted at the application level via Quantum Slate protocols." />
                  <IntegrityFeature icon={<Zap className="w-6 h-6" />} label="Zero Latency" desc="Direct, non-buffered delivery to the hiring manager's infrastructure." />
               </div>

               {/* Action Footer */}
               <div className="pt-12 border-t border-border/40">
                  <Button
                    className="w-full h-20 rounded-2xl btn-quantum shadow-2xl disabled:opacity-20 active:scale-[0.98] transition-all"
                    disabled={!resume || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                       <span className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Ingesting Payload...</span>
                       </span>
                    ) : (
                       <span className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
                          Deploy Final Application
                          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                       </span>
                    )}
                  </Button>
               </div>
            </div>
         </div>

         {/* Trust Bar */}
         <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-20 font-black text-[10px] uppercase tracking-[0.4em] pt-8">
            <span className="flex items-center gap-3"><Globe className="w-4 h-4" /> Worldwide Ops</span>
            <span className="flex items-center gap-3"><Target className="w-4 h-4" /> High Precision</span>
            <span className="flex items-center gap-3"><Briefcase className="w-4 h-4" /> Professional Hub</span>
         </div>
      </div>
    </div>
  )
}

function IntegrityFeature({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] glass-panel border-border/40 flex items-start gap-6 hover:border-primary/40 transition-all duration-700 shadow-sm">
       <div className="text-primary mt-1 shadow-2xl">{icon}</div>
       <div className="space-y-2">
          <p className="text-base font-black tracking-tight leading-none">{label}</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-60">{desc}</p>
       </div>
    </div>
  )
}
