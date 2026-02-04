'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getJobsAction } from "@/app/actions/jobs"
import { getJobTypeLabel, getEmploymentTypeLabel } from "@/lib/utils"
import { Briefcase, MapPin, Clock, Search } from "lucide-react"

interface Job {
  id: string
  title: string
  description: string
  location: string
  type: string
  employmentType: string
  experienceLevel: string
  skills: string[]
  _count: {
    applications: number
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let ignore = false;
    
    async function init() {
      const result = await getJobsAction()
      if (!ignore) {
        if (result.success && result.jobs) {
          setJobs(result.jobs)
        }
        setLoading(false)
      }
    }

    init()
    return () => { ignore = true }
  }, [])

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            RecruitFlow
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">My Applications</Button>
            </Link>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Browse {jobs.length} open positions and start your career journey
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search jobs by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No jobs found matching your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="glass border-white/10 hover-lift h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <Badge variant="secondary">{getJobTypeLabel(job.type)}</Badge>
          </div>
          <CardDescription className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {job.location} • {getEmploymentTypeLabel(job.employmentType)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {job.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              {job.experienceLevel}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {job._count.applications} applicants
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
