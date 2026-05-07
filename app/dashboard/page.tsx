'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getMyApplicationsAction, withdrawApplicationAction, declineOfferAction } from "@/app/actions/applications"
import { toast } from "sonner"
import { getStatusColor, formatDate, getJobTypeLabel } from "@/lib/utils"
import { Briefcase, MapPin, Calendar, FileText, ArrowRight, XCircle, AlertCircle, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

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
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-accent/30 border-b border-border py-12 md:py-16">
        <div className="container-wide">
          <div className="max-w-3xl animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <LayoutDashboard className="w-6 h-6" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  My <span className="gradient-text">Journey</span>
                </h1>
             </div>
             <p className="text-lg text-muted-foreground">
               Track and manage all your active job applications in one centralized dashboard.
             </p>
          </div>
        </div>
      </div>

      <div className="container-wide py-12 flex-1">
        {/* Statistics or Overview Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in [animation-delay:100ms]">
           <StatBox label="Active Applications" value={applications.filter(a => !['WITHDRAWN', 'REJECTED', 'OFFER_DECLINED'].includes(a.status)).length} icon={<Briefcase />} color="text-primary" />
           <StatBox label="Interviews" value={applications.filter(a => a.status === 'INTERVIEW').length} icon={<Calendar />} color="text-blue-500" />
           <StatBox label="Offers" value={applications.filter(a => a.status === 'OFFER').length} icon={<Sparkles />} color="text-amber-500" />
           <StatBox label="Total Applied" value={applications.length} icon={<CheckCircle2 />} color="text-emerald-500" />
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40 w-full rounded-[2rem] glass" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Card className="glass border-dashed border-2 border-border/50 text-center py-24 rounded-[3rem] animate-fade-in [animation-delay:200ms]">
            <CardContent>
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                 <Briefcase className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                 Ready to take the next step in your career? Start browsing our open roles.
              </p>
              <Link href="/jobs">
                <Button className="rounded-full px-8 h-12">Browse Available Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-fade-in [animation-delay:200ms]">
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
    <Card className="glass border-white/10 rounded-[2.5rem] p-2 hover-card group">
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6 flex-1">
           <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/10 flex items-center justify-center text-primary border border-primary/10">
              <Briefcase className="w-8 h-8" />
           </div>
           <div className="space-y-1">
             <div className="flex items-center gap-3 flex-wrap">
               <h3 className="text-2xl font-bold">{application.job.title}</h3>
               <Badge className={cn("rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider", getStatusColor(application.status))}>
                 {application.status}
               </Badge>
             </div>
             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
               <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary/70" /> {application.job.location}</span>
               <span className="w-1 h-1 bg-muted rounded-full" />
               <span className="flex items-center gap-1.5">{getJobTypeLabel(application.job.type)}</span>
               <span className="w-1 h-1 bg-muted rounded-full" />
               <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary/70" /> Applied {formatDate(application.appliedAt)}</span>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="hidden lg:flex flex-col items-end mr-4 text-right">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Attached Resume</span>
              <span className="text-sm font-medium flex items-center gap-2 mt-1">
                 <FileText className="w-4 h-4 text-primary" /> {application.resumeName}
              </span>
           </div>

           <div className="flex gap-2 w-full md:w-auto">
             <Link href={`/jobs/${application.job.id}`} className="flex-1 md:flex-none">
               <Button variant="outline" className="rounded-2xl h-12 px-6 w-full md:w-auto hover:bg-primary/5 hover:border-primary/50 transition-all">
                 View Details
               </Button>
             </Link>

             {isOffer && (
               <Button 
                 variant="destructive" 
                 className="rounded-2xl h-12 px-6 shadow-lg shadow-destructive/20"
                 onClick={async () => {
                   if(confirm('Are you sure you want to decline this offer?')) {
                     const result = await declineOfferAction(application.id)
                     if (result.success) {
                       toast.success("Offer declined successfully")
                       onRefresh()
                     } else {
                       toast.error(result.error || "Failed to decline offer")
                     }
                   }
                 }}
               >
                 Decline Offer
               </Button>
             )}

             {isActionable && (
               <Button 
                 variant="ghost" 
                 className="rounded-2xl h-12 px-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                 onClick={async () => {
                   if(confirm('Are you sure you want to withdraw your application? This action cannot be undone.')) {
                     const result = await withdrawApplicationAction(application.id)
                     if (result.success) {
                       toast.success("Application withdrawn")
                       onRefresh()
                     } else {
                       toast.error(result.error || "Failed to withdraw application")
                     }
                   }
                 }}
               >
                 <XCircle className="w-4 h-4 mr-2" />
                 Withdraw
               </Button>
             )}
           </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatBox({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <Card className="glass border-white/10 rounded-3xl p-6">
       <div className="flex items-center justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center", color)}>
             {icon}
          </div>
          <span className="text-3xl font-black">{value}</span>
       </div>
       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
    </Card>
  )
}

import { LayoutDashboard, Sparkles } from "lucide-react"
