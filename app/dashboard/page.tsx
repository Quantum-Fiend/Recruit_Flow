'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getMyApplicationsAction, withdrawApplicationAction, declineOfferAction } from "@/app/actions/applications"
import { toast } from "sonner"
import { getStatusColor, formatDate, getJobTypeLabel } from "@/lib/utils"
import { Briefcase, MapPin, Calendar, FileText, ArrowRight, XCircle, LayoutDashboard, Sparkles, ChevronRight, Zap, Target, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Application {
  id: string
  status: string
  resumeName: string
  appliedAt: Date
  job: {
    id: string
    title: string
    location: string
    type: string
  }
}

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const loadApplications = useCallback(async () => {
    const result = await getMyApplicationsAction()
    if (result.success && result.applications) {
      setApplications(result.applications as Application[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-wrapper animate-slide-up"
    >
      {/* Dashboard Header */}
      <header className="w-full mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-2xl space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">
              <LayoutDashboard className="w-3 h-3" />
              <span>Personal Command Center</span>
           </div>
           <h1 className="h-lg text-sapphire">My <br /><span className="text-primary">Journey.</span></h1>
           <p className="text-xl text-muted-foreground font-medium">Tracking your strategic progression across the RecruitFlow ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <Link href="/jobs">
              <Button className="btn-sapphire h-14 px-8 shadow-xl shadow-primary/10">
                Browse Network
              </Button>
           </Link>
        </div>
      </header>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
         <StatBox label="Live Missions" value={applications.filter(a => !['WITHDRAWN', 'REJECTED', 'OFFER_DECLINED'].includes(a.status)).length} icon={<Activity />} />
         <StatBox label="Screening" value={applications.filter(a => a.status === 'INTERVIEW').length} icon={<Target />} />
         <StatBox label="Offers" value={applications.filter(a => a.status === 'OFFER').length} icon={<Sparkles />} />
         <StatBox label="Total Feed" value={applications.length} icon={<Briefcase />} />
      </div>

      {/* Main Pipeline Feed */}
      <div className="w-full space-y-10">
        <div className="flex items-center justify-between px-6 mb-4">
           <h2 className="text-2xl font-black tracking-tighter uppercase text-muted-foreground/50">Active Pipeline</h2>
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{applications.length} Sequences Active</span>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-44 w-full rounded-[2.5rem] glass-morphism" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-40 glass-morphism w-full border-dashed rounded-[3rem] flex flex-col items-center">
            <Briefcase className="w-16 h-16 mb-8 text-muted-foreground/20" />
            <h3 className="text-3xl font-black mb-4 tracking-tight">The pipeline is offline</h3>
            <p className="text-xl text-muted-foreground mb-12 max-w-sm font-medium">Your professional trajectory is waiting for its next mission deployment.</p>
            <Link href="/jobs">
              <Button variant="outline" className="rounded-xl px-12 h-14 font-black border-border hover:bg-foreground/5">Initialize Search</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {applications.map((application, index) => (
                <ApplicationListItem 
                  key={application.id} 
                  application={application} 
                  index={index}
                  onRefresh={loadApplications} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ApplicationListItem({ application, index, onRefresh }: { application: Application; index: number; onRefresh: () => void }) {
  const isActionable = ['APPLIED', 'SHORTLISTED', 'INTERVIEW'].includes(application.status)
  const isOffer = application.status === 'OFFER'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="glass-morphism creative-card p-2 border-none group">
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center gap-8 flex-1">
             <div className="w-16 h-16 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:sapphire-gradient group-hover:text-white transition-all duration-700 shadow-xl shadow-primary/5">
                <Briefcase className="w-8 h-8" />
             </div>
             <div className="space-y-3">
               <div className="flex items-center gap-4 flex-wrap">
                 <h3 className="text-3xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">{application.job.title}</h3>
                 <div className={cn("badge-premium", getStatusColor(application.status))}>
                   {application.status}
                 </div>
               </div>
               <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                 <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {application.job.location}</span>
                 <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(application.appliedAt)}</span>
                 <span className="flex items-center gap-2 text-primary/40"><FileText className="w-4 h-4" /> {application.resumeName}</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <Link href={`/jobs/${application.job.id}`} className="flex-1 md:flex-none">
                <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-foreground/5 transition-all">
                   Full Specs
                </Button>
             </Link>

             {isOffer && (
               <Button 
                 className="h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest sapphire-gradient text-white shadow-xl shadow-primary/20"
               >
                 Review Offer
               </Button>
             )}

             {isActionable && (
                <Button 
                  variant="ghost" 
                  className="h-14 px-6 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all font-black text-[10px] uppercase tracking-widest gap-3"
                  onClick={async () => {
                    if(confirm('Terminate this application sequence?')) {
                      const result = await withdrawApplicationAction(application.id)
                      if (result.success) {
                        toast.success("Sequence Terminated")
                        onRefresh()
                      } else {
                        toast.error(result.error)
                      }
                    }
                  }}
                >
                  <XCircle className="w-5 h-5" />
                  <span>Withdraw</span>
                </Button>
             )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StatBox({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card className="glass-morphism creative-card p-10 text-center border-none flex flex-col items-center group">
       <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:sapphire-gradient group-hover:text-white transition-all duration-500 mb-6 shadow-xl shadow-primary/5">
          {icon}
       </div>
       <div className="text-5xl font-black mb-3 tracking-tighter">{value}</div>
       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{label}</p>
    </Card>
  )
}
