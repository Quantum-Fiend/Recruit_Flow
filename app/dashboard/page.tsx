'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getMyApplicationsAction } from "@/app/actions/applications"
import { getStatusColor, formatDate, getJobTypeLabel } from "@/lib/utils"
import { Briefcase, MapPin, Calendar } from "lucide-react"

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
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            RecruitFlow
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/jobs">
              <Button variant="ghost">Browse Jobs</Button>
            </Link>
            <Link href="/api/auth/signout">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 animate-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            My Applications
          </h1>
          <p className="text-muted-foreground">
            Track the status of your job applications
          </p>
        </div>

        {/* Applications */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card className="glass border-white/10 text-center py-12">
            <CardContent>
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start applying to jobs to see them here
              </p>
              <Link href="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="glass border-white/10 hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {application.job.title}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {application.job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {getJobTypeLabel(application.job.type)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied {formatDate(application.appliedAt)}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Resume: {application.resumeName}
                    </div>
                    <Link href={`/jobs/${application.job.id}`}>
                      <Button variant="outline" size="sm">
                        View Job
                      </Button>
                    </Link>
                      
                      {application.status === 'OFFER' && (
                         <div className="flex gap-2">
                           {/* Add Accept/Decline logic here later or just Decline for now */}
                           <form action={async () => {
                              if(confirm('Are you sure you want to decline this offer?')) {
                                await import("@/app/actions/applications").then(mod => mod.declineOfferAction(application.id))
                              }
                           }}>
                              <Button variant="destructive" size="sm" type="submit">Decline Offer</Button>
                           </form>
                         </div>
                      )}

                      {['APPLIED', 'SHORTLISTED', 'INTERVIEW'].includes(application.status) && (
                         <form action={async () => {
                             if(confirm('Are you sure you want to withdraw your application?')) {
                               await import("@/app/actions/applications").then(mod => mod.withdrawApplicationAction(application.id))
                             }
                           }}>
                           <Button variant="ghost" size="sm" type="submit" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                             Withdraw
                           </Button>
                         </form>
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
