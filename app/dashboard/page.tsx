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
      className="flex flex-col w-full animate-slide-up"
    >
      {/* Dashboard Header */}
      <header className="w-full mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                 <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Command Center</span>
           </div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">My <span className="opacity-30">Journey</span></h1>
           <p className="text-xl text-muted-foreground font-medium">Monitoring your professional progression across the RecruitFlow network.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <Link href="/jobs">
              <Button className="h-14 px-8 rounded-2xl bg-foreground text-background font-black hover:opacity-90">
                Browse New Roles
              </Button>
           </Link>
        </div>
      </header>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
         <StatBox label="Live Applications" value={applications.filter(a => !['WITHDRAWN', 'REJECTED', 'OFFER_DECLINED'].includes(a.status)).length} icon={<Activity />} />
         <StatBox label="Interviews" value={applications.filter(a => a.status === 'INTERVIEW').length} icon={<Target />} />
         <StatBox label="Offers" value={applications.filter(a => a.status === 'OFFER').length} icon={<Sparkles />} />
         <StatBox label="Total Pipeline" value={applications.length} icon={<Briefcase />} />
      </div>

      {/* Main Pipeline Feed */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between px-4 mb-8">
           <h2 className="text-2xl font-black tracking-tight">Active Applications</h2>
           <div className="h-px bg-border flex-1 mx-8 opacity-50" />
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{applications.length} Items Found</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40 w-full rounded-[2.5rem] glass" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-40 glass w-full border-dashed flex flex-col items-center">
            <Briefcase className="w-16 h-16 mb-6 text-muted-foreground/30" />
            <h3 className="text-2xl font-black mb-2">The pipeline is empty</h3>
            <p className="text-muted-foreground mb-10 max-w-sm font-medium">Your next professional milestone is just one application away.</p>
            <Link href="/jobs">
              <Button variant="outline" className="rounded-xl px-10 h-14 font-black">Explore Positions</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
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
      <Card className="glass glass-hover p-2 border-none group">
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center gap-8 flex-1">
             <div className="w-16 h-16 rounded-3xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-700">
                <Briefcase className="w-8 h-8" />
             </div>
             <div className="space-y-2">
               <div className="flex items-center gap-4 flex-wrap">
                 <h3 className="text-3xl font-black tracking-tighter leading-none">{application.job.title}</h3>
                 <div className={cn("badge-premium", getStatusColor(application.status))}>
                   {application.status}
                 </div>
               </div>
               <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                 <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {application.job.location}</span>
                 <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(application.appliedAt)}</span>
                 <span className="flex items-center gap-2 text-foreground/40"><FileText className="w-4 h-4" /> {application.resumeName}</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <Link href={`/jobs/${application.job.id}`} className="flex-1 md:flex-none">
                <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black text-sm hover:bg-foreground/5 transition-all">
                   Position Specs
                </Button>
             </Link>

             {isOffer && (
               <Button 
                 className="h-14 px-10 rounded-2xl font-black text-sm bg-foreground text-background"
                 onClick={async () => {
                   if(confirm('Accept or Decline? This will trigger the next phase.')) {
                     // logic for accept/decline
                   }
                 }}
               >
                 Review Offer
               </Button>
             )}

             {isActionable && (
               <Button 
                 variant="ghost" 
                 className="h-14 w-14 p-0 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                 onClick={async () => {
                   if(confirm('Withdraw this application? This cannot be undone.')) {
                     const result = await withdrawApplicationAction(application.id)
                     if (result.success) {
                       toast.success("Profile Withdrawn")
                       onRefresh()
                     } else {
                       toast.error(result.error)
                     }
                   }
                 }}
               >
                 <XCircle className="w-6 h-6" />
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
    <Card className="glass glass-hover p-8 text-center border-none flex flex-col items-center group">
       <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-500 mb-6">
          {icon}
       </div>
       <div className="text-4xl font-black mb-2 tracking-tighter">{value}</div>
       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
    </Card>
  )
}
