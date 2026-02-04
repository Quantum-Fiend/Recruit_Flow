'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getJobsAction } from "@/app/actions/jobs"
import { Briefcase, Users, TrendingUp, Plus } from "lucide-react"

interface RecentJob {
  id: string
  title: string
  location: string
  status: string
  _count: {
    applications: number
  }
}

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
  })
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let ignore = false;

    async function init() {
      const result = await getJobsAction({})
      if (!ignore && result.success && result.jobs) {
        const jobs = result.jobs as RecentJob[]
        const openJobs = jobs.filter((j) => j.status === "OPEN")
        const totalApplications = jobs.reduce((sum, j) => sum + j._count.applications, 0)

        setStats({
          totalJobs: jobs.length,
          openJobs: openJobs.length,
          totalApplications,
        })
        setRecentJobs(jobs.slice(0, 5))
        setLoading(false)
      }
    }

    init()
    return () => { ignore = true }
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            RecruitFlow
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/recruiter/jobs">
              <Button variant="ghost">My Jobs</Button>
            </Link>
            <Link href="/api/auth/signout">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Recruiter Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your job postings and track applicants
            </p>
          </div>
          <Link href="/recruiter/jobs/new">
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Briefcase className="w-8 h-8" />}
            title="Total Jobs"
            value={stats.totalJobs}
            description="All job postings"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Open Positions"
            value={stats.openJobs}
            description="Currently accepting applications"
          />
          <StatCard
            icon={<Users className="w-8 h-8" />}
            title="Total Applications"
            value={stats.totalApplications}
            description="Across all jobs"
          />
        </div>

        {/* Recent Jobs */}
        <Card className="glass border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Job Postings</CardTitle>
              <Link href="/recruiter/jobs">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No jobs posted yet</p>
                <Link href="/recruiter/jobs/new">
                  <Button>Post Your First Job</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <Link key={job.id} href={`/recruiter/jobs/${job.id}/applicants`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.location} • {job._count.applications} applicants
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Applicants
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, description }: {
  icon: React.ReactNode
  title: string
  value: number
  description: string
}) {
  return (
    <Card className="glass border-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
