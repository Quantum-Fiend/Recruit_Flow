'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getMyApplicationsAction, withdrawApplicationAction, declineOfferAction } from "@/app/actions/applications"
import { toast } from "sonner"
import { getStatusColor, formatDate, getJobTypeLabel } from "@/lib/utils"
import { Briefcase, MapPin, Calendar, FileText, ArrowRight, XCircle, LayoutDashboard, Sparkles, ChevronRight, Zap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
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
    <div className="flex flex-col items-center w-full animate-fade-in">
      {/* Header Section */}
      <header className="w-full text-center mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/70">
           <LayoutDashboard className="w-3 h-3" />
           <span>Candidate Dashboard</span>
        </div>
        <h1 className="heading-xl text-gradient">
          My <span className="text-white">Journey</span>
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">
          Track and manage your professional opportunities in real-time.
        </p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-16">
         <StatBox label="Active" value={applications.filter(a => !['WITHDRAWN', 'REJECTED', 'OFFER_DECLINED'].includes(a.status)).length} icon={<Zap />} />
         <StatBox label="Interviews" value={applications.filter(a => a.status === 'INTERVIEW').length} icon={<Calendar />} />
         <StatBox label="Offers" value={applications.filter(a => a.status === 'OFFER').length} icon={<Sparkles />} />
         <StatBox label="History" value={applications.length} icon={<Briefcase />} />
      </div>

      {/* Application Pipeline */}
      <div className="w-full max-w-5xl space-y-8">
        {loading ? (
          <div className="space-y-6 w-full">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-44 w-full rounded-[2.5rem] glass-panel" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-32 glass-panel w-full border-dashed">
            <Briefcase className="w-16 h-16 mx-auto mb-6 text-white/20" />
            <h3 className="text-2xl font-bold mb-2">No applications yet</h3>
            <p className="text-white/40 mb-10 max-w-sm mx-auto font-medium">Ready to take the next step? Explore our open positions.</p>
            <Link href="/jobs">
              <Button className="btn-premium h-14 px-10 rounded-2xl text-lg">Browse Available Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {applications.map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application} 
                onRefresh={loadApplications} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicationCard({ application, onRefresh }: { application: Application; onRefresh: () => void }) {
  const isActionable = ['APPLIED', 'SHORTLISTED', 'INTERVIEW'].includes(application.status)
  const isOffer = application.status === 'OFFER'

  return (
    <Card className="glass-panel p-2 interactive-card border-none flex flex-col md:flex-row md:items-center justify-between gap-8 group">
      <CardContent className="p-8 flex flex-col md:flex-row md:items-center gap-8 w-full">
        {/* Job Info */}
        <div className="flex items-center gap-6 flex-1">
           <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl shadow-white/5">
              <Briefcase className="w-8 h-8" />
           </div>
           <div className="space-y-2">
             <div className="flex items-center gap-4 flex-wrap">
               <h3 className="text-2xl font-black tracking-tight">{application.job.title}</h3>
               <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] border-none", getStatusColor(application.status))}>
                 {application.status}
               </Badge>
             </div>
             <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/40 font-bold">
               <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/60" /> {application.job.location}</span>
               <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-white/60" /> {formatDate(application.appliedAt)}</span>
               <span className="flex items-center gap-2 text-white/60"><FileText className="w-4 h-4" /> {application.resumeName}</span>
             </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
           <Link href={`/jobs/${application.job.id}`} className="flex-1 md:flex-none">
              <Button variant="outline" className="h-12 px-6 rounded-xl border-white/10 hover:bg-white/5 w-full font-bold">
                 View Position
              </Button>
           </Link>

           {isOffer && (
             <Button 
               variant="destructive" 
               className="h-12 px-6 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 border-none shadow-lg shadow-white/5"
               onClick={async () => {
                 if(confirm('Are you sure you want to decline this offer?')) {
                   const result = await declineOfferAction(application.id)
                   if (result.success) {
                     toast.success("Offer declined")
                     onRefresh()
                   } else {
                     toast.error(result.error)
                   }
                 }
               }}
             >
               Decline
             </Button>
           )}

           {isActionable && (
             <Button 
               variant="ghost" 
               className="h-12 px-6 rounded-xl font-bold text-white/40 hover:text-white hover:bg-white/5"
               onClick={async () => {
                 if(confirm('Withdraw this application?')) {
                   const result = await withdrawApplicationAction(application.id)
                   if (result.success) {
                     toast.success("Withdrawn")
                     onRefresh()
                   } else {
                     toast.error(result.error)
                   }
                 }
               }}
             >
               <XCircle className="w-5 h-5 mr-2" />
               Withdraw
             </Button>
           )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatBox({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card className="glass-panel p-8 text-center border-none interactive-card group">
       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mx-auto mb-6 group-hover:bg-white group-hover:text-black transition-all">
          {icon}
       </div>
       <div className="text-4xl font-black mb-2">{value}</div>
       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{label}</p>
    </Card>
  )
}
